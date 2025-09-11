"use client";
import React, { useState, useEffect } from "react";
import styles from "./adminProfile.module.css";

export default function AdminProfile() {
  // Sidebar
  const menu = [
    { key: "profile", label: "Profile" },
    { key: "vehicle", label: "View Vehicle Status" },
    { key: "request", label: "Create New Service Request" },
    { key: "review", label: "Leave a Review" },
    { key: "records", label: "Past Records" },
    { key: "signout", label: "Sign Out" },
  ];
  const [active, setActive] = useState("profile");

  // Account info
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

  // Auth handlers
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleEdit = () => setIsEditing((v) => !v);

  const cancelEdit = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const saveProfile = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Save failed");
      setOriginalData(formData);
      setIsEditing(false);
      alert("Profile updated!");
    } catch {
      alert("Failed to update profile.");
    }
  };

  // TEMP: load profile
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/token", { cache: "no-store" });
        if (!res.ok) throw new Error("Please sign in to continue");
        const user = await res.json();
        const next = {
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
        };
        setFormData(next);
        setOriginalData(next);
      } catch (e) {
        setError("Could not load user profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // PASSWORD RESET
  const [pwdMode, setPwdMode] = useState("hidden"); // "hidden" | "verify" | "reset"
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdBanner, setPwdBanner] = useState("");
  const [pwdBannerKind, setPwdBannerKind] = useState("error"); // "error" | "success"

  // Validation rules
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
      // TODO: hit your verification endpoint
      setPwdMode("reset");
    } catch (e) {
      setPwdBanner("Current password is incorrect.");
    } finally {
      setPwdSaving(false);
    }
  };

  const updatePwd = async () => {
    if (!rulesOk || !matchOk) return;
    setPwdSaving(true);
    setPwdBanner("");
    setPwdBannerKind("error");
    try {
      const payload = pwd.current
        ? { currentPassword: pwd.current, newPassword: pwd.next }
        : { newPassword: pwd.next };

      const res = await fetch("/api/users/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Unable to update password");
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

  // Middle panel
  function renderPanel() {
    switch (active) {
      case "profile":
        return (
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
              <div className={`${styles.alert} ${styles.alertError}`}>
                {error}
              </div>
            )}

            {!loading && !error && (
              !isEditing ? (
                <div className={styles.readList}>
                  <div className={styles.readRow}>
                    <span className={styles.readLabel}>First Name: </span>
                    <span className={styles.readValue}>
                      {formData.firstName || "—"}
                    </span>
                  </div>
                  <div className={styles.readRow}>
                    <span className={styles.readLabel}>Last Name: </span>
                    <span className={styles.readValue}>
                      {formData.lastName || "—"}
                    </span>
                  </div>
                  <div className={styles.readRow}>
                    <span className={styles.readLabel}>Email: </span>
                    <span className={styles.readValue}>
                      {formData.email || "—"}
                    </span>
                  </div>
                  <div className={styles.readRow}>
                    <span className={styles.readLabel}>Phone: </span>
                    <span className={styles.readValue}>
                      {formData.phone || "—"}
                    </span>
                  </div>
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
                      type="email"
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

            {/* CHANGE PASSWORD */}
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
                <div className={`${styles.card}`} style={{ marginTop: 12 }}>
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

                    <div className={styles.fullRow}>
                      <button
                        type="button"
                        onClick={() => {
                          setPwd({ current: "", next: "", confirm: "" });
                          setPwdMode("reset");
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Forgot your password? Reset instead
                      </button>
                    </div>

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

              {pwdMode === "reset" && (
                <div className={`${styles.card}`} style={{ marginTop: 12 }}>
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
                        onChange={(e) =>
                          setPwd({ ...pwd, next: e.target.value })
                        }
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={pwd.confirm}
                        onChange={(e) =>
                          setPwd({ ...pwd, confirm: e.target.value })
                        }
                      />
                    </div>

                    <div className={`${styles.fullRow} ${styles.card}`} style={{ padding: 12, maxWidth: 520 }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>
                        Password must contain:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                        <li className={rules.len ? styles.textOk : styles.textErr}>
                          At least {PWD_MIN} characters
                        </li>
                        <li className={rules.upper ? styles.textOk : styles.textErr}>
                          One uppercase letter
                        </li>
                        <li className={rules.number ? styles.textOk : styles.textErr}>
                          One number
                        </li>
                        <li className={rules.special ? styles.textOk : styles.textErr}>
                          One special character
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
        );

      case "vehicle":
        return (
          <div className={`${styles.card}`}>
            <div className={styles.profileHeader}><h2>Vehicle Status</h2></div>
            <p>Show current service status, ETA, and notes here.</p>
          </div>
        );

      case "request":
        return (
          <div className={`${styles.card}`}>
            <div className={styles.profileHeader}><h2>Request New Service</h2></div>
            <p>Simple request form goes here.</p>
          </div>
        );

      case "review":
        return (
          <div className={`${styles.card}`}>
            <div className={styles.profileHeader}><h2>Leave a Review</h2></div>
            <p>Star rating + comments box + Submit button.</p>
          </div>
        );

      case "records":
        return (
          <div className={`${styles.card}`}>
            <div className={styles.profileHeader}><h2>Past Records</h2></div>
            <p>Table/list of previous services with dates, cost, and invoices.</p>
          </div>
        );

      case "signout":
        return (
          <div className={`${styles.card}`}>
            <div className={styles.profileHeader}><h2>Sign Out</h2></div>
            <button
              className={`${styles.btn} ${styles.btnDanger}`}
              onClick={() => alert("Signed out (stub).")}
            >
              Sign out
            </button>
          </div>
        );

      default:
        return null;
    }
  }

  // Page layout
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Your Service Dashboard</h1>
        <div className={styles.content}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <ul className={styles.menu}>
              {menu.map((item) => (
                <li
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className={`${styles.menuItem} ${
                    item.key === active ? styles.active : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && setActive(item.key)
                  }
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Panel */}
          <main className={styles.main}>{renderPanel()}</main>
        </div>
      </div>
    </div>
  );
}
