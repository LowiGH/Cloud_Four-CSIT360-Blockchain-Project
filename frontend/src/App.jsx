// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile"
import Transaction from "./pages/Transaction";
import Settings from "./pages/Settings";
import History from "./pages/History";  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users/profile" element={<Profile />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
