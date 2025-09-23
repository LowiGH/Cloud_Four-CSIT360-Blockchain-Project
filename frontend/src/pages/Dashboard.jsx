import React, { useState } from "react";
import NoteCard from "../components/NoteCard";
import "./Dashboard.css";

export default function Dashboard() {
  const [editingIndex, setEditingIndex] = useState(null);
  const [notes, setNotes] = useState([
    {
      user: "John Doe",
      dateTime: new Date().toISOString(),
      note: "This is my first note",
      FileName: "note1.txt",
      owner_wallet: 12345,
      color: "yellow",
      bold: false,
    },
    {
      user: "John Doe",
      dateTime: new Date().toISOString(),
      note: "Pick up the groceries",
      FileName: "note2.txt",
      owner_wallet: 12345,
      color: "teal",
      bold: false,
    },
  ]);

  const [showComposer, setShowComposer] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newNote, setNewNote] = useState("");

  // SETTINGS STATES
  const [enableInsights, setEnableInsights] = useState(false);
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(true);
  const [colorMode, setColorMode] = useState("light");
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const addNote = () => {
    if (!newFileName.trim() || !newNote.trim()) return;

    const newNoteObj = {
      user: "John Doe",
      dateTime: new Date().toISOString(),
      FileName: newFileName,
      note: newNote,
      owner_wallet: 12345,
      color: "green",
      bold: false,
    };

    setNotes([...notes, newNoteObj]);
    setNewFileName("");
    setNewNote("");
    setShowComposer(false);
  };

  const editNote = (index, updatedNote) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = updatedNote;
    setNotes(updatedNotes);
    setEditingIndex(null);
  };

  const deleteNote = (index) => {
    if (confirmBeforeDelete) {
      const confirm = window.confirm("Are you sure you want to delete this note?");
      if (!confirm) return;
    }

    setNotes(notes.filter((_, i) => i !== index));
  };

  return (
    <div className={`notes-app ${colorMode}`}>
      {/* Header */}
      <header className="notes-header">
        <h1>Notes</h1>
        <div className="header-buttons">
          <button onClick={() => setShowComposer(!showComposer)}>
            {showComposer ? "Cancel" : "+ Add Note"}
          </button>
          <button
            className="settings-toggle"
            onClick={() => setShowSettingsPanel(true)}
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Composer */}
      {showComposer && (
        <div className="note-card add-note">
          <input
            type="text"
            placeholder="File Name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
          <textarea
            placeholder="Type your note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button onClick={addNote}>Save</button>
        </div>
      )}

      {/* Notes Grid */}
      <div className="notes-grid">
        {notes.map((note, i) => (
          <NoteCard
            key={note.FileName}
            data={note}
            isEditing={editingIndex === i}
            onEdit={(updatedNote) => editNote(i, updatedNote)}
            onStartEdit={() => setEditingIndex(i)}
            onCancelEdit={() => setEditingIndex(null)}
            onDelete={() => deleteNote(i)}
          />
        ))}
      </div>

      {/* SETTINGS PANEL (Separate container) */}
      {showSettingsPanel && (
        <div className="settings-container">
          <div className="settings-header">
            <button onClick={() => setShowSettingsPanel(false)} className="back-button">
              ← Back
            </button>
            <h2>Settings</h2>
          </div>

          <div className="settings-content">
            <div className="setting-item">
              <label>
                Enable insights
                <input
                  type="checkbox"
                  checked={enableInsights}
                  onChange={() => setEnableInsights(!enableInsights)}
                />
              </label>
            </div>

            <div className="setting-item">
              <label>
                Confirm before deleting
                <input
                  type="checkbox"
                  checked={confirmBeforeDelete}
                  onChange={() => setConfirmBeforeDelete(!confirmBeforeDelete)}
                />
              </label>
            </div>

            <div className="setting-item">
              <label>
                Theme:
                <select value={colorMode} onChange={(e) => setColorMode(e.target.value)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">Use my Windows mode</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
