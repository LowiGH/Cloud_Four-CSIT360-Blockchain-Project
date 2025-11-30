// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
// import CardanoTransactionsDashboard from "./pages/Transaction";
import Transaction from "./pages/Transaction";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/transaction" element={<Transaction />} />
      </Routes>
    </Router>
  );
}

export default App;
