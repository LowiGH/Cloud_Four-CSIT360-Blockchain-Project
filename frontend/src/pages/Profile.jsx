import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: null,
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return;
    }

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Fetch latest data from API
      if (userData.username) {
        axios
          .get(`http://localhost:8080/api/profile/${userData.username}`)
          .then((res) => {
            setUser({
              id: res.data.id,
              username: res.data.username || "",
              email: res.data.email || "",
            });
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching profile:", err);
            // Fallback to stored data
            setUser({
              id: userData.id,
              username: userData.username || "",
              email: userData.email || "",
            });
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const saveProfile = async () => {
    if (!user.id) {
      setError("User ID not found. Please login again.");
      return;
    }

    setError("");
    setSuccess("");
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:8080/api/profile/${user.id}`,
        {
          username: user.username,
          email: user.email,
          wallet: "", // Wallet is managed by blockchain team member
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data.success) {
        setSuccess("Profile updated successfully!");
        // Update stored user data
        const updatedUser = {
          id: res.data.user.id,
          username: res.data.user.username,
          email: res.data.user.email,
          walletAddress: res.data.user.walletAddress,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser({
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
        });
      } else {
        setError(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return <div className="profile-page">Loading...</div>;
  }

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
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      {/* Profile Form */}
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header-section">
            <div className="profile-avatar">
              <span>👤</span>
            </div>
            <h2>{user.username || "User"}</h2>
            <p className="profile-subtitle">Manage your account settings</p>
          </div>

          {error && <div className="profile-error">{error}</div>}
          {success && <div className="profile-success">{success}</div>}

          <div className="profile-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <button onClick={saveProfile} className="save-button">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
