import React, { useState, useEffect } from "react";
import axios from "axios";
import { addEntry } from '../utils/history';
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: null,
    username: "",
    email: "",
    wallet: "",
  });

  // Fetch user data
useEffect(() => {
  axios
    .get("http://localhost:8080/api/users/profile")
    .then((res) =>
      setUser({
        id: res.data.id || null,
        username: res.data.user,       // backend: user
        email: res.data.email,         // backend: email
        wallet: res.data.ownerWallet,  // backend: ownerWallet
      })
    )
    .catch((err) => console.error("Error fetching profile:", err));
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
  try {
    const payload = {
      user: user.username,
      email: user.email,
      ownerWallet: user.wallet,
    };

    const res = await axios.put("http://localhost:8080/api/users/profile", payload);

    console.log('Profile save response', res && res.data);

    if (!res || (res.status && res.status >= 400)) {
      alert('Failed to update profile - server returned an error');
      return;
    }

    alert('Profile updated successfully!');

    setUser((prev) => ({
      id: res.data.id || prev.id,
      username: res.data.user,
      email: res.data.email,
      wallet: res.data.ownerWallet,
    }));
    try { addEntry('Profile updated', `Updated profile info (username: ${res.data.user || ''})`); } catch (e) {}

    // persist server-side audit entry for profile update
    try {
      const audit = {
        userId: res.data.id || user.id,
        ownerWallet: res.data.ownerWallet,
        action: 'Profile updated',
        details: `Updated profile (username: ${res.data.user || ''})`,
        network: 'preview'
      };
      const auditRes = await axios.post('http://localhost:8080/api/history', audit);
      console.log('Profile audit saved:', auditRes && auditRes.data);
    } catch (e) {
      console.warn('Failed to save profile audit:', e);
    }
  } catch (err) {
    console.error("Failed to update profile:", err);
    alert("Failed to update profile.");
  }
};


return (
  <div className="profile-container">
    <div className="profile-card">

      <div className="profile-heading">
        <button className="back-btn" onClick={() => navigate("/")}>←</button>
        <h1>Your Profile</h1>
      </div>

      <div className="profile-info-section">

        <div className="profile-avatar">
          {user.username?.charAt(0)?.toUpperCase()}
        </div>

        <h2 className="profile-username">@{user.username || "username"}</h2>
        <p className="profile-role">Student • Account Owner</p>

      </div>

      <div className="profile-form">
        <label>
          Username
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Wallet ID
          <input
            type="text"
            name="wallet"
            value={user.wallet}
            onChange={handleChange}
          />
        </label>

        <button className="save-btn" onClick={saveProfile}>
          Save Profile
        </button>
      </div>

    </div>
  </div>
);


}