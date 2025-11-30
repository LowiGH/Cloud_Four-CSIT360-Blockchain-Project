import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Check, X } from "lucide-react";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [showComposer, setShowComposer] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");

  // Composer fields
  const [newUser, setNewUser] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newCategory, setNewCategory] = useState("Personal");

  // Edit fields
  const [editFileName, setEditFileName] = useState("");
  const [editNote, setEditNote] = useState("");

  useEffect(() => {
    // Mock data for demonstration
    setNotes([
      {
        id: 1,
        user: "Jenette",
        fileName: "Project Meeting.txt",
        note: "Remember to finish task on the board. After finishing give for evaluation Matt.",
        category: "Business",
        dateTime: "2023-01-22T10:00:00Z",
      },
      {
        id: 2,
        user: "Jenette",
        fileName: "Shopping List.txt",
        note: "Remember to buy a new tea cup.",
        category: "Home",
        dateTime: "2023-01-21T10:00:00Z",
      },
      {
        id: 3,
        user: "Jenette",
        fileName: "Weekend Plans.txt",
        note: "Hang out with Marry, friday at 7 pm in Blue Wolf Cafe",
        category: "Personal",
        dateTime: "2023-01-20T10:00:00Z",
      },
    ]);
  }, []);

  const addNote = () => {
    if (!newNote.trim()) return;

    let baseName = newFileName.trim() || "Untitled";
    let finalName = baseName.endsWith(".txt") ? baseName : baseName + ".txt";

    const newNoteObj = {
      id: Date.now(),
      user: newUser || "Jenette",
      fileName: finalName,
      note: newNote,
      category: newCategory,
      dateTime: new Date().toISOString(),
    };

    setNotes([newNoteObj, ...notes]);
    setNewFileName("");
    setNewNote("");
    setNewCategory("Personal");
    setShowComposer(false);
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditFileName(note.fileName.replace(".txt", ""));
    setEditNote(note.note);
  };

  const saveEdit = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? {
              ...note,
              fileName: editFileName.endsWith(".txt")
                ? editFileName
                : editFileName + ".txt",
              note: editNote,
            }
          : note
      )
    );
    setEditingId(null);
  };

  const deleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesCategory =
      activeCategory === "ALL" || note.category === activeCategory;
    const matchesSearch =
      note.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.note.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["ALL", "Personal", "Home", "Business"];

  const getCategoryColor = (category) => {
    const colors = {
      Business: "bg-purple-200 text-purple-800",
      Home: "bg-green-200 text-green-800",
      Personal: "bg-yellow-200 text-yellow-800",
    };
    return colors[category] || "bg-gray-200 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-2xl relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowComposer(!showComposer)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Your notes</h1>

        {/* Category Tabs */}
        <div className="flex gap-6 mb-6 border-b border-gray-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeCategory === cat
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Composer */}
        {showComposer && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">New Note</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="File Name"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <textarea
                placeholder="Type your note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-4 items-center">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Personal">Personal</option>
                  <option value="Home">Home</option>
                  <option value="Business">Business</option>
                </select>
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => setShowComposer(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNote}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(
                    note.category
                  )}`}
                >
                  {note.category}
                </span>
                <div className="flex gap-2">
                  {editingId === note.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(note.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(note)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingId === note.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editFileName}
                    onChange={(e) => setEditFileName(e.target.value)}
                    className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {note.fileName.replace(".txt", "")}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{note.note}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(note.dateTime).toLocaleDateString("en-GB")}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No notes found. Create your first note!
          </div>
        )}
      </div>
    </div>
  );
}