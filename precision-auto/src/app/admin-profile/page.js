"use client";
import React, { useState } from "react";
import styles from "./adminProfile.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { handleLogout } from "../utils/authUtils";

export default function AdminProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    async function verifyAdmin() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/admin/me`,
          { credentials: "include" }
        );

        if (!res.ok) {
          router.push("/client-sign-in");
          return;
        }

        const data = await res.json();
        if (!data.is_admin) {
          router.push("/client-portal-profile");
          return;
        }

        setUser(data);
        setFormData({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: data.phone,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error verifying admin:", err);
        router.push("/client-sign-in");
      }
    }

    verifyAdmin();
  }, [router]);

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
    { key: "signout", label: "Sign Out", action: () => handleLogout(true) },
  ];
  const [active, setActive] = useState("profile");

  if (loading) {
    return <p className="text-center mt-8">Loading admin profile...</p>;
  }

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
