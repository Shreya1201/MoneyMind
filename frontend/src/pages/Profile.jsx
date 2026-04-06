import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { FaCamera, FaSave, FaEdit, FaTimes } from "react-icons/fa";
import "../styles/Profile.css";
import { useHttp } from "../api/Http";
import { toast } from "react-toastify";

const avatarList = Array.from({ length: 32 }, (_, i) => `/assets/Avatar/avatars_${i + 1}.jpg`);

export default function Profile({ user: parentUser, updateUser }) {
  const { theme } = useContext(ThemeContext);
  const { httpGet, httpPost } = useHttp();

  const [user, setUser] = useState(null);
  const [tempUser, setTempUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [avatarPopup, setAvatarPopup] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const JsonData = {};
        const headerData = {
          TranName: "GetProfileData",
          JsonData: JSON.stringify(JsonData)
        };
        const res = await httpGet("http://localhost:5000/profile", { "HeaderData": JSON.stringify(headerData) });
        if (res.ResponseType === "Success" && res.Response.length > 0) {
          const profile = res.Response[0];  
          setUser(profile);
          setTempUser(profile);
        } else {
          toast.error(res.ResponseMessage || "No profile found");
        }       
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUser({ ...tempUser, [name]: value });
  };

const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => setTempUser({ ...tempUser, Photo: reader.result });
    reader.readAsDataURL(file);   
  }
};

  const handleAvatarSelect = (avatar) => {
    setTempUser({ ...tempUser, Photo: avatar });
    setAvatarPopup(false);
  };

  const handleSave = async () => {
    const payload = {
      FullName: tempUser['FullName'],
      Photo: tempUser['Photo']
    };
    const tranName = 'EditProfile';
    try {
      const res = await httpPost("http://localhost:5000/profile", payload, { TranName: tranName });
      if (res.ResponseType === 'Success'){
        toast.success(res.ResponseMessage);
        setEditing(false);
        setUser({ ...tempUser });   
        setTempUser({ ...tempUser });
        updateUser(tempUser);
      }
      else 
        toast.error(res.ResponseMessage);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setTempUser(user);
    setEditing(false);
  };

if (!tempUser) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
        <div className="loader-text">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className={`profile-page ${theme}`}>
      <div className="profile-card">
        <h2>My Profile</h2>

        {!editing && (
          <button className="edit-icon" onClick={() => setEditing(true)}>
            <FaEdit />
          </button>
        )}
        {editing && (
          <button className="close-icon" onClick={handleCancel}>
            <FaTimes />
          </button>
        )}

        <div className="profile-photo-section">
          <img
            src={tempUser.Photo || "/default-profile.png"}
            alt="Profile"
            className="profile-photo"
          />
          {editing && (
            <div className="photo-actions">
              <label className="photo-upload">
                <FaCamera />
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
              </label>
              <button className="btn secondary" onClick={() => setAvatarPopup(true)}>
                Choose Avatar
              </button>
            </div>
          )}
        </div>

        <div className="profile-details">
          <div className="form-group">
            <label>Name</label>
            {editing ? (
              <input type="text" name="FullName" value={tempUser.FullName} onChange={handleChange} required/>
            ) : (
              <p>{user.FullName}</p>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <p>{user.Email}</p>
          </div>

          {editing && (
            <div className="profile-actions">
              <button className="btn primary" onClick={handleSave}>
                <FaSave /> Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Popup */}
      {avatarPopup && (
        <div className="avatar-popup-overlay" onClick={() => setAvatarPopup(false)}>
          <div className="avatar-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Select Avatar</h3>
            <div className="avatar-grid">
              {avatarList.map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt={`Avatar ${i + 1}`}
                  className="avatar-item"
                  onClick={() => handleAvatarSelect(avatar)}
                />
              ))}
            </div>
            <button className="btn secondary close-btn" onClick={() => setAvatarPopup(false)}>
              <FaTimes /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
