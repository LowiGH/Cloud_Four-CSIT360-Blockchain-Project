import React, { useState, useEffect } from "react";
import "./NoteCard.css";

export default function NoteCard({ data, isEditing, onEdit, onStartEdit, onCancelEdit, onDelete }) {
  const [editedFileName, setEditedFileName] = useState(data.fileName);
  const [editedNote, setEditedNote] = useState(data.note);
  const [selectedColor, setSelectedColor] = useState(data.color || "yellow");
  const [isBold, setIsBold] = useState(data.bold || false);

  // Update state when the data prop changes
  useEffect(() => {
    setEditedFileName(data.fileName);
    setEditedNote(data.note);
    setSelectedColor(data.color || "yellow");
    setIsBold(data.bold || false);
  }, [data]);

const handleSave = () => {
  if (!editedFileName.trim() || !editedNote.trim()) return;

  onEdit({
    ...data,
    fileName: editedFileName,
    note: editedNote,
    dateTime: new Date().toISOString(),
    ownerWallet: data.ownerWallet, // keep same wallet
  });
};


  return (
    <div className={`note-card ${selectedColor}`} style={{ fontWeight: isBold ? "bold" : "normal" }}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedFileName}
            onChange={(e) => setEditedFileName(e.target.value)}
            placeholder="File Name"
          />
          <textarea
            autoFocus
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
          />
          <div className="edit-controls">
            <label>
              Color:
              <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                <option value="yellow">Yellow</option>
                <option value="teal">Teal</option>
                <option value="green">Green</option>
                <option value="pink">Pink</option>
              </select>
            </label>
            <label>
              <input type="checkbox" checked={isBold} onChange={() => setIsBold(!isBold)} />
              Bold
            </label>
          </div>
          <div className="note-footer">
            <small>{new Date(data.dateTime).toLocaleString()}</small>
            <div>
              <button onClick={handleSave}>💾</button>
              <button onClick={onCancelEdit}>✖</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h4>{data.fileName}</h4>
          <p>{data.note}</p>
          <div className="note-footer">
            <small>{new Date(data.dateTime).toLocaleString()}</small>
            <div>
              <button onClick={onStartEdit}>✏</button>
              <button onClick={onDelete}>🗑</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
