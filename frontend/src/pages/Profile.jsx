import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    wallet: "",
  });

  // Fetch user data
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/profile")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      const res = await axios.put("http://localhost:8080/api/profile", user);
      alert("Profile updated successfully!");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <header className="dashboard-header profile-header">
        <div className="header-content">
          <button
            onClick={() => navigate("/")}
            className="back-button"
            title="Back to Dashboard"
          >
            ←
          </button>
          <h1 className="page-title">Your Profile</h1>
        </div>
      </header>

      {/* Profile Form */}
      <div className="profile-form">
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Wallet ID:
          <input
            type="text"
            name="wallet"
            value={user.wallet}
            onChange={handleChange}
          />
        </label>

        <button onClick={saveProfile} className="save-button">
          Save Profile
        </button>
      </div>
    </div>
  );
}
