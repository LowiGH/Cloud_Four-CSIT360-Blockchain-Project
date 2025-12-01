import React, { useState, useEffect } from "react";
import { getPrimaryAddress, findCardanoProvider, connectWallet, disconnectWallet, isConnected, getNetworkInfo, getBalance } from '../utils/cardano';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // dropdown menu
  const [showNoteComposer, setShowNoteComposer] = useState(false); // New Note modal

  const [editingId, setEditingId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("cloudfour_theme") || "light";
    } catch {
      return "light";
    }
  });

  const [profile, setProfile] = useState({
  username: "",
  ownerWallet: "",
});
  const [providerName, setProviderName] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
useEffect(() => {
  axios
    .get("http://localhost:8080/api/users")
    .catch((err) => console.error("Failed to load profile:", err));
}, []);

useEffect(() => {
  (async () => {
    try {
      const prov = await findCardanoProvider();
      if (prov) setProviderName(prov.name || 'cardano');
      if (isConnected()) {
        const addr = await getPrimaryAddress();
        if (addr) setConnectedAddress(addr);
        const net = await getNetworkInfo(); if (net && net.name) setNetworkName(net.name);
        setBalanceLoading(true);
        const b = await getBalance();
        if (b != null) setBalance(b);
        setBalanceLoading(false);
      }
    } catch (e) { /* ignore */ }
  })();
}, []);


  // Composer fields
  const [newUser, setNewUser] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newCategory, setNewCategory] = useState("Personal");

  // Edit fields
  const [editFileName, setEditFileName] = useState("");
  const [editNote, setEditNote] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("cloudfour_theme", theme);
    } catch {}
  }, [theme]);

  const addNote = async () => {
    if (!newNote.trim()) return;

    let baseName = newFileName.trim() || "Untitled";
    let finalName = baseName.endsWith(".txt") ? baseName : baseName + ".txt";
    let counter = 1;

    const existingNames = notes.map((n) => (n.fileName || "").toLowerCase());
    while (existingNames.includes(finalName.toLowerCase())) {
      finalName = `${baseName}(${counter}).txt`;
      counter++;
    }

    const newNoteObj = {
      user: newUser || "Jenette",
      fileName: finalName,
      note: newNote,
      category: newCategory,
      ownerWallet: "0123",
      dateTime: new Date().toISOString(),
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/users",
        newNoteObj
      );
      setNotes([res.data, ...notes]);
      setNewFileName("");
      setNewNote("");
      setNewCategory("Personal");
      setShowNoteComposer(false);
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditFileName((note.fileName || "").replace(".txt", ""));
    setEditNote(note.note || "");
  };

  const saveEdit = async (id) => {
    const noteToUpdate = notes.find((n) => n.id === id);
    const updatedNote = {
      ...noteToUpdate,
      fileName: editFileName.endsWith(".txt")
        ? editFileName
        : editFileName + ".txt",
      note: editNote,
    };

    try {
      const res = await axios.put(
        `http://localhost:8080/api/users/${id}`,
        updatedNote
      );
      setNotes(notes.map((note) => (note.id === id ? res.data : note)));
      setEditingId(null);
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/users/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const filteredNotes = notes.filter((note) => {
    const category = note.category || "Personal";
    const matchesCategory = activeCategory === "ALL" || category === activeCategory;
    const matchesSearch =
      (note.fileName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.note || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["Notes", "Cardano Transactions", "History", "Setting"];

  return (
    <div className="modern-dashboard" data-theme={theme}>
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
        <div>
          
<div style={{ position: "relative", display: "inline-block" }}>
  <button
    onClick={() => setShowDropdown(!showDropdown)}
    className="add-button"
    style={{
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      border: "none",
      background: "#3b82f6",
      color: "white",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    }}
  >
    <span className="plus-icon">+</span> Add
  </button>

  {showDropdown && (
    <div className="dropdown-menu" style={{
      position: "absolute",
      top: "100%",
      right: 0,
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      marginTop: "0.5rem",
      minWidth: "160px",
      zIndex: 50,
    }}>
      <button
        onClick={() => {
          navigate("/transaction");
          setShowDropdown(false);
        }}
        style={{ display: "block", width: "100%", padding: "0.75rem 1rem", textAlign: "left", border: "none", background: "transparent", cursor: "pointer" }}
      >
        New Transaction
      </button>
      <button
        onClick={() => {
          setShowDropdown(false);
          setShowNoteComposer(true);
        }}
        style={{ display: "block", width: "100%", padding: "0.75rem 1rem", textAlign: "left", border: "none", background: "transparent", cursor: "pointer" }}
      >
        New Note
      </button>
    </div>
  )}
</div>



        </div>

            {/* Wallet connect & balance */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
              <button
                onClick={connectedAddress ? () => { disconnectWallet(); setConnectedAddress(null); setProviderName(null); setNetworkName(null); setBalance(null);} : async () => {
                  const r = await connectWallet();
                  if (r) { setProviderName(r.name || 'cardano'); const addr = await getPrimaryAddress(); if (addr) setConnectedAddress(addr); const net = await getNetworkInfo(); if (net && net.name) setNetworkName(net.name); setBalanceLoading(true); const b = await getBalance(); if (b != null) setBalance(b); setBalanceLoading(false); }
                }}
                style={{ padding: '0.5rem 0.8rem', borderRadius: 6, border: '1px solid #e2e8f0', background: connectedAddress ? '#ecfdf5' : '#f1f5f9', cursor: 'pointer' }}
                title={connectedAddress ? 'Disconnect wallet' : 'Connect wallet'}
              >
                {connectedAddress ? (connectedAddress.slice(0,8) + '...') : 'Connect Wallet'}
              </button>

              {connectedAddress ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: 12 }}>
                  <div style={{ fontWeight: 600 }}>{networkName ? `${providerName || 'wallet'} (${networkName})` : providerName || 'wallet'}</div>
                  <div style={{ color: '#333', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div>{balanceLoading ? 'Checking balance...' : (balance ? `${balance} ADA` : 'Balance unknown')}</div>
                    <button onClick={async () => { setBalanceLoading(true); const b = await getBalance(); if (b != null) setBalance(b); setBalanceLoading(false); }} style={{ padding: '2px 6px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11 }}>Refresh</button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Profile Button using useNavigate */}
            <button
              onClick={() => navigate("/users/profile")}
              className="profile-button"
              title="View Profile"
            >
              👤 Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <h1 className="page-title">Your notes</h1>

        {/* Category Tabs */}
  <div className="category-tabs">
  {categories.map((cat) => (
    <button
      key={cat}
      onClick={() => {
        if (cat === "Cardano Transactions") {// navigate to cardano tx page
          navigate("/transaction");
        } else if (cat === "Notes") {
          navigate("/"); // navigate to home page
        } else if (cat === "History") {
          navigate("/history"); // navigate to History page
        }else if (cat === "Setting") {
          navigate("/settings"); // navigate to settings page
        }else {
          setActiveCategory(cat);
        }
      }}
      className={`category-tab ${activeCategory === cat ? "active" : ""}`}
    >
      {cat}
    </button>
  ))}
</div>




        {/* Composer */}
{showNoteComposer && (
  <div className="composer-modal">
    <h2 className="composer-title">New Note</h2>
    <div className="composer-fields">
      <div className="composer-row">
        <input
          type="text"
          placeholder="Username"
          value={newUser || profile.user}
          onChange={(e) => setNewUser(e.target.value)}
          className="composer-input"
        />
        <input
          type="text"
          placeholder="File Name"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          className="composer-input"
        />
      </div>
      <textarea
        placeholder="Type your note..."
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        rows={4}
        className="composer-textarea"
      />
      <div className="composer-footer">
        {/* <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="category-select"
        >
          <option value="Notes">Home</option>
          <option value="Transaction">Personal</option>
        </select> */}
        <div className="composer-actions">
          <button
            onClick={() => setShowNoteComposer(false)}
            className="cancel-button"
          >
            Cancel
          </button>
          <button onClick={addNote} className="save-button">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}


        {/* Notes Grid */}
        <div className="notes-modern-grid">
          {filteredNotes.map((note) => {
            const category = note.category || "Personal";
            return (
              <div key={note.id} className="note-modern-card">
                <div className="note-header">
                  <span className={`category-badge ${category.toLowerCase()}`}>
                    {category}
                  </span>
                  <div className="note-actions">
                    {editingId === note.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(note.id)}
                          className="action-btn save"
                          title="Save"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="action-btn cancel"
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(note)}
                          className="action-btn edit"
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="action-btn delete"
                          title="Delete"
                        >
                          🗑
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editingId === note.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editFileName}
                      onChange={(e) => setEditFileName(e.target.value)}
                      className="edit-input"
                    />
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      rows={3}
                      className="edit-textarea"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="note-title">
                      {(note.fileName || "").replace(".txt", "")}
                    </h3>
                    <p className="note-content">{note.note}</p>
                    <p className="note-date">
                      {new Date(note.dateTime).toLocaleDateString("en-GB")}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {filteredNotes.length === 0 && (
          <div className="empty-state">
            <p>No notes found. Create your first note!</p>
          </div>
        )}
      </main>
    </div>
  );
}
