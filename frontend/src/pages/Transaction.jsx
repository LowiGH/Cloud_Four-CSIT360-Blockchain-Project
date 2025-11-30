import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [showNewTx, setShowNewTx] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");

  const [txType, setTxType] = useState("Send");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  // Load from API only ONCE
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/transactions")
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error("Error loading:", err));
  }, []);

  // Add Transaction (Send to API)
  const addTransaction = async () => {
    if (!toAddress.trim() || !amount) return;

    const newTx = {
      type: txType,
      toAddress,
      amount: parseFloat(amount),
      memo: memo || "No memo",
      status: "Pending",
      ownerWallet: "your-wallet-address"
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/transactions",
        newTx
      );

      // Add newly created transaction from server response
      setTransactions([res.data, ...transactions]);

      // reset form
      setToAddress("");
      setAmount("");
      setMemo("");
      setShowNewTx(false);

    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  // Filtering
  const filteredTxs = transactions.filter((tx) => {
    const matchesTab =
      activeTab === "ALL" || tx.type === activeTab || tx.status === activeTab;

    const matchesSearch =
      tx.txHash?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.toAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.fromAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.memo?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const tabs = ["ALL", "Send", "Receive", "Confirmed", "Pending"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "#10b981";
      case "Pending":
        return "#f59e0b";
      case "Failed":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };



  return (
    <div style={{
      minHeight: "100vh",
      background: theme === "light" ? "#f8fafc" : "#0f172a",
      color: theme === "light" ? "#1e293b" : "#e2e8f0",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      {/* Header */}
      <header style={{
        background: theme === "light" ? "#ffffff" : "#1e293b",
        borderBottom: `1px solid ${theme === "light" ? "#e2e8f0" : "#334155"}`,
        padding: "1rem 2rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem"
        }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>🔍</span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                border: `1px solid ${theme === "light" ? "#e2e8f0" : "#334155"}`,
                borderRadius: "8px",
                background: theme === "light" ? "#f8fafc" : "#0f172a",
                color: "inherit",
                fontSize: "0.95rem"
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
              style={{
                padding: "0.75rem 1rem",
                border: "none",
                borderRadius: "8px",
                background: theme === "light" ? "#f1f5f9" : "#334155",
                cursor: "pointer",
                fontSize: "1.2rem"
              }}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button
              onClick={() => setShowNewTx(!showNewTx)}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "8px",
                background: "#3b82f6",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>+</span>
              New Transaction
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem" }}>
          Cardano Transactions
        </h1>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          borderBottom: `2px solid ${theme === "light" ? "#e2e8f0" : "#334155"}`,
          overflowX: "auto"
        }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                background: "transparent",
                color: activeTab === tab ? "#3b82f6" : "inherit",
                borderBottom: activeTab === tab ? "2px solid #3b82f6" : "2px solid transparent",
                cursor: "pointer",
                fontWeight: activeTab === tab ? "600" : "400",
                marginBottom: "-2px",
                whiteSpace: "nowrap"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* New Transaction Form */}
        {showNewTx && (
          <div style={{
            background: theme === "light" ? "#ffffff" : "#1e293b",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            border: `1px solid ${theme === "light" ? "#e2e8f0" : "#334155"}`,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem" }}>
              New Transaction
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>
                  Type
                </label>
                <select
                  value={txType}
                  onChange={(e) => setTxType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${theme === "light" ? "#e2e8f0" : "#334155"}`,
                    borderRadius: "8px",
                    background: theme === "light" ? "#f8fafc" : "#0f172a",
                    color: "inherit"
                  }}
                >
                  <option value="Send">Send</option>
                  <option value="Receive">Receive</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>
                  {txType === "Send" ? "To Address" : "From Address"}
                </label>
                <input
                  type="text"
                  placeholder="addr1q..."
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${theme === "light" ? "#e2e8f0" : "#334155"}`,
                    borderRadius: "8px",
                    background: theme === "light" ? "#f8fafc" : "#0f172a",
                    color: "inherit"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>
                  Amount (ADA)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${theme === "light" ? "#e2e8f0" : "#334155"}`,
                    borderRadius: "8px",
                    background: theme === "light" ? "#f8fafc" : "#0f172a",
                    color: "inherit"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>
                  Memo (Optional)
                </label>
                <textarea
                  placeholder="Add a note..."
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${theme === "light" ? "#e2e8f0" : "#334155"}`,
                    borderRadius: "8px",
                    background: theme === "light" ? "#f8fafc" : "#0f172a",
                    color: "inherit",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowNewTx(false)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: `1px solid ${theme === "light" ? "#e2e8f0" : "#334155"}`,
                    borderRadius: "8px",
                    background: "transparent",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={addTransaction}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "none",
                    borderRadius: "8px",
                    background: "#3b82f6",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Submit Transaction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div style={{ display: "grid", gap: "1rem" }}>
          {filteredTxs.map((tx) => (
            <div
              key={tx.id}
              style={{
                background: theme === "light" ? "#ffffff" : "#1e293b",
                borderRadius: "12px",
                padding: "1.5rem",
                border: `1px solid ${theme === "light" ? "#e2e8f0" : "#334155"}`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "all 0.2s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <span style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "6px",
                      background: tx.type === "Send" ? "#fee2e2" : "#dbeafe",
                      color: tx.type === "Send" ? "#dc2626" : "#2563eb",
                      fontSize: "0.85rem",
                      fontWeight: "600"
                    }}>
                      {tx.type}
                    </span>
                    <span style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "6px",
                      background: `${getStatusColor(tx.status)}20`,
                      color: getStatusColor(tx.status),
                      fontSize: "0.85rem",
                      fontWeight: "600"
                    }}>
                      {tx.status}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: theme === "light" ? "#64748b" : "#94a3b8", margin: 0 }}>
                    {tx.toAddress || tx.fromAddress}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    margin: 0,
                    color: tx.type === "Send" ? "#dc2626" : "#10b981"
                  }}>
                    {tx.type === "Send" ? "-" : "+"}{tx.amount.toFixed(2)} ₳
                  </p>
                  <p style={{ fontSize: "0.85rem", color: theme === "light" ? "#94a3b8" : "#64748b", margin: "0.25rem 0 0 0" }}>
                    {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div style={{
                padding: "1rem",
                background: theme === "light" ? "#f8fafc" : "#0f172a",
                borderRadius: "8px",
                fontSize: "0.85rem"
              }}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600" }}>Transaction Hash:</p>
                <p style={{
                  margin: "0 0 1rem 0",
                  fontFamily: "monospace",
                  color: theme === "light" ? "#64748b" : "#94a3b8",
                  wordBreak: "break-all"
                }}>
                  {tx.txHash}
                </p>
                {tx.memo && (
                  <>
                    <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600" }}>Memo:</p>
                    <p style={{ margin: 0, color: theme === "light" ? "#64748b" : "#94a3b8" }}>
                      {tx.memo}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTxs.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: theme === "light" ? "#ffffff" : "#1e293b",
            borderRadius: "12px",
            border: `1px solid ${theme === "light" ? "#e2e8f0" : "#334155"}`
          }}>
            <p style={{ fontSize: "1.1rem", color: theme === "light" ? "#64748b" : "#94a3b8" }}>
              No transactions found. Create your first transaction!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}