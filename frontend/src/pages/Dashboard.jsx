import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [showComposer, setShowComposer] = useState(false);
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
      setShowComposer(false);
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditFileName(note.fileName.replace(".txt", ""));
    setEditNote(note.note);
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
      note.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.note.toLowerCase().includes(searchQuery.toLowerCase());
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
            <button
              onClick={() => setShowComposer(!showComposer)}
              className="add-button"
            >
              <span className="plus-icon">+</span>
              Add
            </button>
            {/* Profile Button */}
            <button
              onClick={() => (window.location.href = "/profile")}
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
              onClick={() => setActiveCategory(cat)}
              className={`category-tab ${activeCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Composer */}
        {showComposer && (
          <div className="composer-modal">
            <h2 className="composer-title">New Note</h2>
            <div className="composer-fields">
              <div className="composer-row">
                <input
                  type="text"
                  placeholder="Username"
                  value={newUser}
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
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="Notes">Home</option>
                  <option value="Transaction">Personal</option>
                </select>
                <div className="composer-actions">
                  <button
                    onClick={() => setShowComposer(false)}
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
                      {note.fileName.replace(".txt", "")}
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
