"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./page.module.css";
import Nav from "../constants/nav";

// Define API base URL and user ID (in real app, get from auth context)
const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const api = (path) => `${base}/api${path}`;

export default function AdminProfile() {
  const menu = [
    { key: "profile", label: "Profile", href: "/client-portal-profile" },
    { key: "vehicle", label: "View Vehicle Status", href: "/client-vehicle-status" },
    { key: "request", label: "Create New Service Request", href: "/select-service" },
    { key: "review", label: "Leave a Review", href: "/review" },
    { key: "records", label: "Past Records", href: "/client-past-records" },
    { key: "signout", label: "Sign Out", href: "/client-signout" },
  ];

  const pathname = usePathname();

  //helper methods for auth headers
  const authHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

  // ---- profile state ----
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [originalData, setOriginalData] = useState(formData);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleEdit = () => setIsEditing((v) => !v);
  const cancelEdit = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  //backend call to update profile
  const saveProfile = async () => {
  try {
    const res = await fetch(api(`/users/me`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        first_name: formData.firstName,
        last_name:  formData.lastName,
        phone:      formData.phone,
      }),
    });
    if (!res.ok) throw new Error("Save failed");
    const updated = await res.json();

    const next = {
      firstName: updated.first_name,
      lastName:  updated.last_name,
      email:     updated.email,
      phone:     updated.phone,
    };
    setFormData(next);
    setOriginalData(next);
    setIsEditing(false);
    alert("Profile updated!");
  } catch {
    alert("Failed to update profile.");
  }
};

  // backend call to load user profile
useEffect(() => {
  (async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(api(`/users/me`), {
        headers: {
          Accept: "application/json",
          ...authHeaders(),
        },
      });

      if (res.status === 401) throw new Error("Please sign in to continue");
      if (!res.ok) throw new Error(`Profile load failed: ${res.status}`);

      const u = await res.json();
      const next = {
        firstName: u.first_name ?? "",
        lastName:  u.last_name  ?? "",
        email:     u.email      ?? "",
        phone:     u.phone      ?? "",
      };
      setFormData(next);
      setOriginalData(next);
    } catch (e) {
      setError(e.message || "Could not load user profile.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  })();
}, []);

  // ---- password state ----
  const [pwdMode, setPwdMode] = useState("hidden");
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdBanner, setPwdBanner] = useState("");
  const [pwdBannerKind, setPwdBannerKind] = useState("error");

  const PWD_MIN = 8;
  const rules = {
    len: pwd.next.length >= PWD_MIN,
    upper: /[A-Z]/.test(pwd.next),
    number: /\d/.test(pwd.next),
    special: /[^A-Za-z0-9]/.test(pwd.next),
  };
  const rulesOk = Object.values(rules).every(Boolean);
  const matchOk = pwd.next.length > 0 && pwd.next === pwd.confirm;

  const startPwd = () => {
    setPwd({ current: "", next: "", confirm: "" });
    setPwdBanner("");
    setPwdBannerKind("error");
    setPwdMode("verify");
  };
  const cancelPwd = () => {
    setPwdMode("hidden");
    setPwd({ current: "", next: "", confirm: "" });
    setPwdBanner("");
    setPwdBannerKind("error");
  };
  const verifyPwd = async () => {
  setPwdSaving(true);
  setPwdBanner("");
  setPwdBannerKind("error");
  try {
    const res = await fetch(api(`/users/me/verify-password`), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ current_password: pwd.current }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.detail || "Current password is incorrect.");
    }
    setPwdBannerKind("success");
    setPwdBanner("Password verified.");
    setPwdMode("reset"); // reveal new/confirm fields
  } catch (e) {
    setPwdBannerKind("error");
    setPwdBanner(e.message || "Unable to verify password.");
  } finally {
    setPwdSaving(false);
  }
};

  // backend call to update password
const updatePwd = async () => {
  if (!rulesOk || !matchOk) return;
  setPwdSaving(true);
  setPwdBanner("");
  setPwdBannerKind("error");
  try {
    const res = await fetch(api(`/users/me/password`), {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        current_password: pwd.current,
        new_password: pwd.next,
      }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.detail || "Unable to update password");
    }
    setPwdBannerKind("success");
    setPwdBanner("Password updated successfully.");
    setPwd({ current: "", next: "", confirm: "" });
  } catch (e) {
    setPwdBannerKind("error");
    setPwdBanner(e.message || "Unable to update password");
  } finally {
    setPwdSaving(false);
  }
};

  // ---- page layout ----
  return (
    <div className={styles.page}>
      <Nav />

      <div className={styles.container}>
        <h1 className={styles.title}>Your Service Dashboard</h1>

        <div className={styles.content}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <ul className={styles.menu}>
              {menu.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.key !== "profile" && pathname?.startsWith(item.href));
                return (
                  <li
                    key={item.key}
                    className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
                  >
                    <Link href={item.href} className={styles.menuLink}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Main panel */}
          <main className={styles.main}>
            <div className={`${styles.card} ${styles.profileCard}`}>
              <div className={styles.profileHeader}>
                <h2>Account Information</h2>
                {!isEditing ? (
                  <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={toggleEdit}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className={styles.buttonRow}>
                    <button
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      onClick={saveProfile}
                    >
                      Save
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {loading && <div>Loading profile…</div>}
              {error && (
                <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>
              )}

              {!loading && !error && (
                !isEditing ? (
                  <div>
                    <p><strong>First Name:</strong> {formData.firstName || "—"}</p>
                    <p><strong>Last Name:</strong> {formData.lastName || "—"}</p>
                    <p><strong>Email:</strong> {formData.email || "—"}</p>
                    <p><strong>Phone:</strong> {formData.phone || "—"}</p>
                  </div>
                ) : (
                  <div className={styles.profileFields}>
                    <div className={styles.field}>
                      <label>First Name</label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Last Name</label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Email</label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Phone</label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )
              )}

              {/* Change password */}
              <div style={{ marginTop: 16 }}>
                {pwdMode === "hidden" && (
                  <button
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={startPwd}
                  >
                    Change Password
                  </button>
                )}

                {pwdMode === "verify" && (
                  <div className={styles.card} style={{ marginTop: 12 }}>
                    <div className={styles.profileHeader} style={{ marginBottom: 8 }}>
                      <h3>Verify Current Password</h3>
                      <button
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        onClick={cancelPwd}
                      >
                        Close
                      </button>
                    </div>

                    <div className={styles.profileFields}>
                      <div className={styles.field}>
                        <label>Current Password</label>
                        <input
                          type="password"
                          autoComplete="current-password"
                          value={pwd.current}
                          onChange={(e) =>
                            setPwd({ ...pwd, current: e.target.value })
                          }
                        />
                      </div>
                      <div className={`${styles.field} ${styles.fullRow}`}>
                        <button
                          className={`${styles.btn} ${styles.btnPrimary}`}
                          disabled={!pwd.current || pwdSaving}
                          onClick={verifyPwd}
                          type="button"
                        >
                          {pwdSaving ? "Checking..." : "Continue"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {pwdMode === "reset" && (
                  <div className={styles.card} style={{ marginTop: 12 }}>
                    <div className={styles.profileHeader} style={{ marginBottom: 8 }}>
                      <h3>Update Password</h3>
                      <button
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        onClick={cancelPwd}
                      >
                        Close
                      </button>
                    </div>

                    <div className={styles.profileFields}>
                      <div className={styles.field}>
                        <label>New Password</label>
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={pwd.next}
                          onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                        />
                      </div>
                      <div className={styles.field}>
                        <label>Confirm Password</label>
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={pwd.confirm}
                          onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                        />
                      </div>

                      {/* ✅ Dynamic rules checklist */}
                      <div className={styles.fullRow} style={{ marginTop: 8 }}>
                        <p><strong>Password must contain:</strong></p>
                        <ul className={styles.ruleList}>
                          <li className={rules.len ? styles.ruleOk : styles.ruleBad}>
                            {rules.len ? "✓" : "•"} At least {PWD_MIN} characters
                          </li>
                          <li className={rules.upper ? styles.ruleOk : styles.ruleBad}>
                            {rules.upper ? "✓" : "•"} One uppercase letter
                          </li>
                          <li className={rules.number ? styles.ruleOk : styles.ruleBad}>
                            {rules.number ? "✓" : "•"} One number
                          </li>
                          <li className={rules.special ? styles.ruleOk : styles.ruleBad}>
                            {rules.special ? "✓" : "•"} One special character
                          </li>
                          <li className={matchOk ? styles.ruleOk : styles.ruleBad}>
                            {matchOk ? "✓" : "•"} New Password and Confirm match
                          </li>
                        </ul>
                      </div>

                      <div className={`${styles.buttonRow} ${styles.fullRow}`}>
                        <button
                          className={`${styles.btn} ${styles.btnPrimary}`}
                          disabled={!rulesOk || !matchOk || pwdSaving}
                          onClick={updatePwd}
                          type="button"
                        >
                          {pwdSaving ? "Saving..." : "Update Password"}
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnSecondary}`}
                          onClick={() => setPwdMode("verify")}
                          type="button"
                        >
                          Back
                        </button>
                      </div>

                      {!matchOk && (pwd.next || pwd.confirm) && (
                        <div
                          className={`${styles.alert} ${styles.alertError} ${styles.fullRow}`}
                          aria-live="polite"
                        >
                          New Password and Confirm Password must match.
                        </div>
                      )}

                      {pwdBanner && (
                        <div
                          className={`${styles.alert} ${
                            pwdBannerKind === "success"
                              ? styles.alertSuccess
                              : styles.alertError
                          } ${styles.fullRow}`}
                          aria-live="polite"
                        >
                          {pwdBanner}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
