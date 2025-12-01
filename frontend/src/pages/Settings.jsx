// Settings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Settings() {
  const [profile, setProfile] = useState({
    user: "",
    email: "",
    ownerWallet: "",
    dateTime: "",
    note: "",
    fileName: "",
  });

  const [activeTab, setActiveTab] = useState("Account");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      const res = await axios.put(
        "http://localhost:8080/api/users",
        profile
      );
      setProfile(res.data);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const tabs = [
    "Account",
    "Security",
    "Notifications",
    "Appearance",
    "Privacy",
    "Integrations",
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          borderRight: "1px solid #e0e0e0",
          padding: "1rem",
          background: "#f8f9fa",
        }}
      >
        <h2 style={{ marginBottom: "2rem" }}>Settings</h2>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              display: "block",
              width: "100%",
              padding: "0.5rem 1rem",
              marginBottom: "0.5rem",
              border: "none",
              borderRadius: "6px",
              textAlign: "left",
              background: activeTab === tab ? "#3b82f6" : "transparent",
              color: activeTab === tab ? "white" : "#333",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: "2rem",
          background: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {activeTab === "Account" && (
          <div style={{ width: "100%", maxWidth: "600px" }}>
            <h3 style={{ marginBottom: "1rem", textAlign: "center" }}>
              Profile Information
            </h3>

            <label style={{ display: "block", marginBottom: "1rem" }}>
              User
              <input
                type="text"
                name="user"
                value={profile.user}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginTop: "0.25rem",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "1rem" }}>
              Email
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginTop: "0.25rem",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "1rem" }}>
              Wallet
              <input
                type="text"
                name="ownerWallet"
                value={profile.ownerWallet}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginTop: "0.25rem",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "1rem" }}>
              Last Updated
              <input
                type="text"
                name="dateTime"
                value={profile.dateTime}
                readOnly
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: "#f0f0f0",
                  marginTop: "0.25rem",
                }}
              />
            </label>

            <button
              onClick={saveProfile}
              style={{
                padding: "0.6rem 1.2rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Placeholder tabs */}
        {activeTab !== "Account" && (
          <div style={{ color: "#888", fontStyle: "italic", textAlign: "center" }}>
            {activeTab} settings coming soon...
          </div>
        )}
      </div>
    </div>
  );
}
