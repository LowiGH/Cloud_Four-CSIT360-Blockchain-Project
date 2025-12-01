import React, { useState, useEffect } from 'react';
import { addEntry, getHistory, clearHistory as clearHistoryUtil } from '../utils/history';
import { getPrimaryAddress, enableWallet, findCardanoProvider, getNetworkInfo, connectWallet, disconnectWallet, isConnected } from '../utils/cardano';

export default function History() {
    const [history, setHistory] = useState([]);

    const [providerName, setProviderName] = useState(null);
    const [networkName, setNetworkName] = useState(null);
    const [connectedAddress, setConnectedAddress] = useState(null);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    useEffect(() => {
        const fetchHistory = async () => {
            try {

                // If a browser Cardano wallet (Lace) is available, try to use it first
                let wallet = null;
                const provider = await findCardanoProvider();
                                    if (provider) setProviderName(provider.name || 'cardano');
                                    const net = await getNetworkInfo();
                                    if (net && net.name) setNetworkName(net.name);
                                    if (isConnected()) {
                                        try { const addr = await getPrimaryAddress(); if (addr) setConnectedAddress(addr); } catch (e) {}
                                    }
                if (provider) {
                    // ask user to connect (enable) and read primary address
                    const connectedAddr = await getPrimaryAddress();
                    if (connectedAddr) {
                        wallet = connectedAddr;
                    } else {
                        // wallet found but couldn't read address — try to fetch profile as fallback
                        console.warn('Cardano provider present but no address read; falling back to profile');
                    }
                }

                // fallback to server profile if wallet isn't provided via extension
                if (!wallet) {
                    const profileRes = await fetch('http://localhost:8080/api/users/profile');
                    if (!profileRes.ok) {
                        const txt = await profileRes.text();
                        console.error('Failed to fetch profile:', profileRes.status, txt);
                        return;
                    }
                    const profile = await profileRes.json();
                    wallet = profile.ownerWallet || profile.ownerwallet || profile.wallet;
                }

                const txRes = await fetch(`http://localhost:8080/api/transactions/wallet/${encodeURIComponent(wallet)}`);
                if (!txRes.ok) {
                    const txt = await txRes.text();
                    console.error('Failed to fetch transactions:', txRes.status, txt);
                    return;
                }

                const data = await txRes.json();
                const txEntries = data.map((tx) => ({
                    id: tx.id || Date.now(),
                    action: tx.type || 'Transaction',
                    details: `${tx.type || ''} ${tx.amount || ''} ADA ${tx.toAddress ? `to ${tx.toAddress}` : tx.fromAddress ? `from ${tx.fromAddress}` : ''} ${tx.txHash ? `(${tx.txHash})` : ''} ${tx.memo ? `- ${tx.memo}` : ''}`.trim(),
                    timestamp: tx.timestamp ? new Date(tx.timestamp).toLocaleString() : new Date().toLocaleString(),
                }));

                                // fetch server-side audit history too (persisted entries)
                                let auditEntries = [];
                                try {
                                    const auditRes = await fetch(`http://localhost:8080/api/history/wallet/${encodeURIComponent(wallet)}`);
                                    if (auditRes.ok) {
                                        const auditData = await auditRes.json();
                                        auditEntries = auditData.map(h => ({
                                            id: h.id || Date.now(),
                                            action: h.action || 'Activity',
                                            details: h.details || '',
                                            timestamp: h.timestamp ? new Date(h.timestamp).toLocaleString() : new Date().toLocaleString(),
                                        }));
                                    }
                                } catch (e) { /* ignore */ }

                                const existing = getHistory();
                                // merge: server audit entries (persisted) + transaction entries + client entries
                                const merged = [...auditEntries, ...txEntries, ...existing];
                setHistory(merged);
                try { localStorage.setItem('transactionHistory', JSON.stringify(merged)); } catch (e) { }
            } catch (error) {
                console.error('Failed to fetch history:', error);
            }
        };
        fetchHistory();
    }, []);

    const clearHistory = () => {
        clearHistoryUtil();
        setHistory([]);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '800px', margin: '0 auto', padding: '0 20px 6px 20px' }}>
            {providerName ? (
                <div style={{ marginBottom: 12, padding: 8, borderRadius: 6, background: '#f1f5f9' }}>
                    Connected wallet: <strong>{providerName}</strong>
                    {networkName ? ` — network: ${networkName}` : ''}
                    {networkName && !/testnet|preview/i.test(networkName) ? (
                        <div style={{ color: '#b91c1c', marginTop: 6 }}>Warning: Wallet is not on testnet/preview network. Switch to preview testnet to match app configuration.</div>
                    ) : null}
                </div>
            ) : null}

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                    onClick={connectedAddress ? () => { disconnectWallet(); setConnectedAddress(null); setProviderName(null); setNetworkName(null); } : async () => {
                        const res = await connectWallet();
                        if (res) { setProviderName(res.name || 'cardano'); const addr = await getPrimaryAddress(); if (addr) setConnectedAddress(addr); const net = await getNetworkInfo(); if (net && net.name) setNetworkName(net.name); }
                    }}
                    style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: connectedAddress ? '#ecfdf5' : '#f1f5f9', cursor: 'pointer' }}
                >
                    {connectedAddress ? `${connectedAddress.slice(0,8)}...` : 'Connect Wallet'}
                </button>

                {providerName && networkName && !/testnet|preview/i.test(networkName) ? (
                    <div style={{ color: '#b91c1c' }}>Warning: Wallet not on preview testnet</div>
                ) : null}
            </div>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2>Transaction History</h2>
            
            {history.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center' }}>No history yet</p>
            ) : (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {history.map((entry) => (
                            <div key={entry.id} style={{
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                padding: '12px',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>{entry.action}</div>
                                <div style={{ fontSize: '14px', color: '#555', marginBottom: '6px' }}>{entry.details}</div>
                                <div style={{ fontSize: '12px', color: '#999' }}>{entry.timestamp}</div>
                            </div>
                        ))}
                    </div>
                    <button onClick={clearHistory} style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        Clear History
                    </button>
                </>
            )}
        </div>
        </div>
    );
}
