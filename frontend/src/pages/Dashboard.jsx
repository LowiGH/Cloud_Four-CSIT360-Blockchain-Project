import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteCard from "../components/NoteCard";
import "./Dashboard.css";

export default function Dashboard() {
  const [editingIndex, setEditingIndex] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showComposer, setShowComposer] = useState(false);

  // Composer fields
  const [newUser, setNewUser] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newWallet, setNewWallet] = useState("");

  // Fetch notes from backend when component mounts
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  // ADD NOTE
  const addNote = async () => {
  if (!newNote.trim()) return;

  // Handle automatic filename
  let baseName = newFileName.trim() || "Untitled";
  let finalName = baseName + ".txt";
  let counter = 1;

  // Check for duplicates
  const existingNames = notes.map(n => n.fileName.toLowerCase());
  while (existingNames.includes(finalName.toLowerCase())) {
    finalName = `${baseName}(${counter}).txt`;
    counter++;
  }

  const newNoteObj = {
    user: "Jenette",
    fileName: finalName,
    note: newNote,
    ownerWallet: "0123",
    dateTime: new Date().toISOString(),
  };

  try {
    const res = await axios.post("http://localhost:8080/api/users", newNoteObj);
    setNotes([...notes, res.data]);
    setNewFileName("");
    setNewNote("");
    setShowComposer(false);
  } catch (err) {
    console.error("Failed to save note:", err);
  }
};
  // EDIT NOTE
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

  // DELETE NOTE
  const deleteNote = async (index) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/users/${notes[index].id}`);
      setNotes(notes.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div className="notes-app">
      <header className="notes-header">
        <h1>Notes</h1>
        <button onClick={() => setShowComposer(!showComposer)}>
          {showComposer ? "Cancel" : "+ Add Note"}
        </button>
      </header>

      {/* Composer Card */}
      {showComposer && (
        <div className="note-card add-note">
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
          <textarea
            placeholder="Type your note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <input
            type="text"
            placeholder="Owner Wallet"
            value={newWallet}
            onChange={(e) => setNewWallet(e.target.value)}
          />
          <button onClick={addNote}>Save</button>
        </div>
      )}

      {/* Notes Grid */}
      <div className="notes-grid">
        {notes.map((note, i) => (
          <NoteCard
            key={note.id || note.FileName}
            data={note}
            isEditing={editingIndex === i}
            onEdit={(updatedNote) => editNote(i, updatedNote)}
            onStartEdit={() => setEditingIndex(i)}
            onCancelEdit={() => setEditingIndex(null)}
            onDelete={() => deleteNote(i)}
          />
        ))}
      </div>
    </div>
  );
}
