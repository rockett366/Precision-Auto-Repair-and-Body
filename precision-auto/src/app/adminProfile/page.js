"use client";
import React, { useState } from "react";
import styles from "./adminProfile.module.css";

export default function AdminProfile() {
  const [formData, setFormData] = useState({
    firstName: "Lorem",
    lastName: "Ipsum",
    email: "lore@email.com",
    phone: "(324) 943‑2321",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleEdit = () => setIsEditing((v) => !v);
  const saveProfile = () => {
    setIsEditing(false);
    alert("Profile saved!");
  };

  const menu = [
    { key: "profile", label: "Profile" },
    { key: "vehicle", label: "View Vehicle Status" },
    { key: "request", label: "Request New Service" },
    { key: "review", label: "Leave a Review" },
    { key: "records", label: "Past Records" },
    { key: "signout", label: "Signout" },
  ];
  const [active, setActive] = useState("profile");

  return (
    <div className={styles.page}>
      {/* Navbar has been removed */}
      <div className={styles.container}>
        <h1 className={styles.title}>Your Service Dashboard</h1>
        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <ul className={styles.menu}>
              {menu.map((item) => (
                <li
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className={
                    item.key === active
                      ? `${styles.menuItem} ${styles.active}`
                      : styles.menuItem
                  }
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </aside>
          <main className={styles.main}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <h2>Profile</h2>
                <button
                  className={styles.editButton}
                  onClick={isEditing ? saveProfile : toggleEdit}
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>
              <div className={styles.profileFields}>
                <div className={styles.field}>
                  <label>First Name:</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    disabled={!isEditing}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label>Last Name:</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    disabled={!isEditing}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label>Email:</label>
                  <input
                    name="email"
                    value={formData.email}
                    disabled={!isEditing}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label>Phone Number:</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    disabled={!isEditing}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
