// Simple history utility used by frontend pages to persist user actions
function load() {
  try {
    const raw = localStorage.getItem('transactionHistory');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function save(list) {
  try { localStorage.setItem('transactionHistory', JSON.stringify(list)); } catch (e) {}
}

export function addEntry(action, details) {
  const entry = {
    id: Date.now(),
    action,
    details,
    timestamp: new Date().toLocaleString(),
  };
  const items = [entry, ...load()];
  save(items);
  return items;
}

export function getHistory() {
  return load();
}

export function clearHistory() {
  save([]);
  return [];
}

export default { addEntry, getHistory, clearHistory };
