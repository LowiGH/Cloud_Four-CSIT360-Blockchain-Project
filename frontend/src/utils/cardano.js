// Utility helpers to interact with a CIP-30 compliant Cardano wallet (e.g. Lace)
// The functions attempt to enable a wallet extension and return a safe address string.

export async function findCardanoProvider() {
  if (typeof window === 'undefined') return null;
  if (window.cardano) {
    // try common wallet keys first (lace is the one you're using)
    if (window.cardano.lace) return { name: 'lace', api: window.cardano.lace };
    // otherwise return the first available provider
    const names = Object.keys(window.cardano).filter(k => typeof window.cardano[k] === 'object' || typeof window.cardano[k] === 'function');
    if (names.length > 0) return { name: names[0], api: window.cardano[names[0]] };
  }
  return null;
}

export async function enableWallet() {
  const provider = await findCardanoProvider();
  if (!provider) return null;
  try {
    const api = await provider.api.enable();
    // cache the enabled provider for this session
    _enabled = { name: provider.name, api };
    return _enabled;
  } catch (e) {
    console.warn('Cardano wallet was not enabled:', e);
    return null;
  }
}

// Module-level cache of the enabled API and provider name so we can maintain connection state
let _enabled = null;

// Connect wallet explicitly and keep API cached
export async function connectWallet() {
  const result = await enableWallet();
  if (result && result.api) {
    _enabled = result;
  }
  return _enabled;
}

// Return true if a wallet has been enabled during this page session
export function isConnected() {
  return !!_enabled;
}

// 'Disconnect' will just clear our cached handle - CIP-30 doesn't mandate a disconnect API
export function disconnectWallet() {
  _enabled = null;
}

// Try to obtain primary user address in a few ways and return as string.
export async function getPrimaryAddress() {
  // Prefer cached enabled wallet to avoid re-prompts
  const wallet = _enabled || await enableWallet();
  if (!wallet) return null;
  const api = wallet.api;
  try {
    // prefer getChangeAddress() or getUsedAddresses()
    if (typeof api.getChangeAddress === 'function') {
      const addr = await api.getChangeAddress();
      if (addr) return normalizeAddress(addr);
    }
    if (typeof api.getUsedAddresses === 'function') {
      const addrs = await api.getUsedAddresses();
      if (Array.isArray(addrs) && addrs.length > 0) return normalizeAddress(addrs[0]);
    }
    // some wallets provide getCollateral or getRewardAddresses
    if (typeof api.getRewardAddresses === 'function') {
      const r = await api.getRewardAddresses();
      if (Array.isArray(r) && r.length > 0) return normalizeAddress(r[0]);
    }
  } catch (e) {
    console.warn('Failed to read address from wallet API:', e);
  }
  return null;
}

// Returns network info (if available) such as networkId and human-friendly name.
export async function getNetworkInfo() {
  const provider = await findCardanoProvider();
  if (!provider) return null;
  try {
    const api = await provider.api.enable();
    // Some wallets expose getNetworkId() per CIP-30
    if (typeof api.getNetworkId === 'function') {
      const id = await api.getNetworkId();
      // Heuristic names: 1 => mainnet, 0 => testnet (some wallets), other numbers may apply.
      const name = id === 1 ? 'mainnet' : (id === 0 ? 'testnet' : `network-${id}`);
      // Many preview/testnet providers may use different IDs; include both id and name.
      return { networkId: id, name };
    }
    // Some wallets expose getNetwork() or getNetworkId
    if (typeof api.getNetwork === 'function') {
      const n = await api.getNetwork();
      // return as-is
      return { name: String(n) };
    }
  } catch (e) {
    console.warn('Failed to read network info from wallet:', e);
  }
  return null;
}

// Try to obtain wallet balance if provider exposes an API helper
// Returns a numeric string representing ADA (converted from lovelace when needed) or null
export async function getBalance() {
  try {
    const enabled = _enabled || await enableWallet();
    if (!enabled) return null;
    const api = enabled.api;

    // Many wallets expose getBalance() returning lovelace string/number or a structured result
    if (typeof api.getBalance === 'function') {
      const raw = await api.getBalance();
      if (raw == null) return null;

      // Support BigNum-like objects (with to_str), objects with coin property, numbers, and strings
      let coinStr = null;
      try {
        if (typeof raw === 'object' && typeof raw.to_str === 'function') coinStr = raw.to_str();
        else if (typeof raw === 'object' && raw.coin) coinStr = String(raw.coin);
        else coinStr = String(raw);
      } catch (e) { coinStr = String(raw); }

      // parse numeric part
      const num = Number(coinStr.replace(/[^0-9.-]/g, ''));
      if (!isNaN(num)) {
        // treat as lovelace if large number
        if (Math.abs(num) > 1000000) {
          const ada = num / 1000000;
          return ada.toFixed(6).replace(/\.0+$/, '').replace(/(\.\d{2})\d+$/, '$1');
        }
        return String(num);
      }
      return coinStr;
    }

    // No getBalance. Some wallets provide getUtxos() returning CBOR hex strings — try to compute balance by parsing UTxOs.
    if (typeof api.getUtxos === 'function') {
      try {
        const utxos = await api.getUtxos();
        if (!Array.isArray(utxos) || utxos.length === 0) return '0';

        // dynamic import of the serialization lib (browser WASM)
        const CSL = await import('@emurgo/cardano-serialization-lib-browser');

        const hexToBytes = (hex) => {
          if (!hex) return new Uint8Array();
          const h = hex.replace(/^0x/, "");
          const arr = new Uint8Array(h.length/2);
          for (let i = 0; i < h.length; i += 2) arr[i/2] = parseInt(h.substr(i,2), 16);
          return arr;
        };

        const base64ToBytes = (b64) => {
          if (!b64) return new Uint8Array();
          try {
            const bin = atob(b64);
            const u8 = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
            return u8;
          } catch (e) { return new Uint8Array(); }
        };

        let total = BigInt(0);
        let parsedCount = 0;
        for (const raw of utxos) {
          try {
            let bytes;
            if (typeof raw === 'string') {
              const cleaned = raw.trim();
              // hex or base64 handling
              if (/^[0-9a-fA-F]+$/.test(cleaned.replace(/^0x/, ''))) bytes = hexToBytes(cleaned);
              else bytes = base64ToBytes(cleaned);
            } else if (raw instanceof Uint8Array) {
              bytes = raw;
            } else if (raw instanceof ArrayBuffer) {
              bytes = new Uint8Array(raw);
            } else if (Array.isArray(raw)) {
              bytes = new Uint8Array(raw);
            } else {
              // unsupported format
              continue;
            }
            const txOut = CSL.TransactionUnspentOutput.from_bytes(bytes).output();
            const value = txOut.amount();
            // value.coin() is BigNum — use to_str()
            const coinStr = value.coin().to_str();
            const coin = BigInt(coinStr);
            total += coin;
            parsedCount++;
          } catch (e) {
            // ignore parsing errors and continue
            console.warn('UTxO parse error (skipped):', e && e.message ? e.message : e);
          }
        }

        if (parsedCount === 0) return null;

        // convert lovelace (BigInt) to ADA string
        const ada = Number(total) / 1000000;
        return ada.toFixed(6).replace(/\.0+$/, '').replace(/(\.\d{2})\d+$/, '$1');
      } catch (e) {
        console.warn('Failed to compute balance from UTxOs:', e);
      }
    }
    // give up gracefully
    return null;
  } catch (e) {
    console.warn('Failed to read balance from wallet API:', e);
    return null;
  }
}

function normalizeAddress(addr) {
  // Many providers return strings (bech32) already; some might return hex buffers encoded as hex
  if (!addr) return null;
  // If it's an array (Uint8Array wrapped), convert to hex/base64? But most return strings.
  if (Array.isArray(addr) || (typeof addr === 'object' && addr.buffer)) {
    try {
      // convert Uint8Array to hex string — this is a best-effort fallback
      const u8 = Array.isArray(addr) ? new Uint8Array(addr) : new Uint8Array(addr.buffer || addr);
      return Array.from(u8).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      return String(addr);
    }
  }
  return String(addr);
}

export default { findCardanoProvider, enableWallet, getPrimaryAddress, getNetworkInfo, connectWallet, isConnected, disconnectWallet, getBalance };
