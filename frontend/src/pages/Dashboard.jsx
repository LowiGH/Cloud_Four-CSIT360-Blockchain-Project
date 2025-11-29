import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteCard from "../components/NoteCard";
import "./Dashboard.css";

export default function Dashboard() {
  const [editingIndex, setEditingIndex] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showComposer, setShowComposer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
  const [newWallet, setNewWallet] = useState("");

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
    let finalName = baseName + ".txt";
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
      ownerWallet: newWallet || "0123",
      dateTime: new Date().toISOString(),
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/users",
        newNoteObj
      );
      setNotes([...notes, res.data]);
      setNewFileName("");
      setNewNote("");
      setShowComposer(false);
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  const editNote = async (index, updatedNote) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/users/${updatedNote.id}`,
        updatedNote
      );
      const updatedNotes = [...notes];
      updatedNotes[index] = res.data;
      setNotes(updatedNotes);
      setEditingIndex(null);
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  const deleteNote = async (index) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/users/${notes[index].id}`
      );
      setNotes(notes.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div className={`dashboard-container ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h1 className="app-title">CloudFour</h1>
          <div className="controls-row">
            <button
              className="icon-btn"
              aria-label="toggle-theme"
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button
              className="icon-btn mobile-toggle"
              aria-label="toggle-sidebar"
              onClick={() => setSidebarOpen((s) => !s)}
            >
              ☰
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="add-btn" onClick={() => setShowComposer(!showComposer)}>
            {showComposer ? "Cancel" : "+ Add Note"}
          </button>

          <div className="meta">
            <small>{notes.length} notes</small>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Composer */}
        {showComposer && (
          <div className="composer-card">
            <div className="composer-row">
              <input
                type="text"
                placeholder="Username"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
              />
              <input
                type="text"
                placeholder="File Name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </div>

            <textarea
              placeholder="Type your note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />

            <div className="composer-row">
              <input
                type="text"
                placeholder="Owner Wallet"
                value={newWallet}
                onChange={(e) => setNewWallet(e.target.value)}
              />

              <div className="composer-actions">
                <button className="save-btn" onClick={addNote}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        <div className="notes-grid">
          {notes.map((note, i) => (
            <NoteCard
              key={note.id || note.fileName}
              data={note}
              isEditing={editingIndex === i}
              onEdit={(updatedNote) => editNote(i, updatedNote)}
              onStartEdit={() => setEditingIndex(i)}
              onCancelEdit={() => setEditingIndex(null)}
              onDelete={() => deleteNote(i)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
