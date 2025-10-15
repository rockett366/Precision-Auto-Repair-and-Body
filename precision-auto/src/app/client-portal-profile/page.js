"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./page.module.css";
import Nav from "../constants/nav";

/* utils: password + VIN validation (centralized) */
import {
  PWD_MIN,
  computePasswordRules,
  passwordsMatch,
  PasswordChecklist, // <- dynamic checklist UI
  validateVIN,       // <- ISO-3779 VIN checker
  normalizeVinInput,
  digitsOnly,
  isValidYear,
} from "../utils/validation";

// TEMP: frontend-only auth bypass — set to false when re-enabling auth
const DEV_BYPASS = true;

// Define API base URL and user ID (in real app, get from auth context)
const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const api = (path) => `${base}/api${path}`;

/* ----------------------------------------------------------------------
   VEHICLES: constants (UI-only for now; backend wiring later)
------------------------------------------------------------------------*/
const VEHICLE_FIELDS = ["make", "model", "year", "vin"];
const currentYear = new Date().getFullYear();

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

  // helper for auth headers
  const authHeaders = () =>
    DEV_BYPASS
      ? {}
      : (() => {
          const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null;
          return token ? { Authorization: `Bearer ${token}` } : {};
        })();

  // ---- profile state ----
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
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

  // backend call to update profile
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
          last_name: formData.lastName,
          phone: formData.phone,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();

      const next = {
        firstName: updated.first_name,
        lastName: updated.last_name,
        email: updated.email,
        phone: updated.phone,
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

        if (DEV_BYPASS) {
          // show mock data immediately for layout testing
          const demo = {
            firstName: "Ezra",
            lastName: "Pisiw",
            email: "demo@example.com",
            phone: "(916) 555-0000",
          };
          setFormData(demo);
          setOriginalData(demo);
          return;
        }

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
          lastName: u.last_name ?? "",
          email: u.email ?? "",
          phone: u.phone ?? "",
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

  // --- password validation (using helpers) ---
  const rules = computePasswordRules(pwd.next);
  const rulesOk = Object.values(rules).every(Boolean);
  const matchOk = passwordsMatch(pwd.next, pwd.confirm);

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

  /* ----------------------------------------------------------------------
     VEHICLES: state + handlers
  ----------------------------------------------------------------------*/
  const [vehicles, setVehicles] = useState([]);
  const [draftVehicle, setDraftVehicle] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editBuffer, setEditBuffer] = useState(null);
  const [vehError, setVehError] = useState("");

  const startAddVehicle = () => {
    if (draftVehicle) return;
    setVehError("");
    setDraftVehicle({
      make: "",
      model: "",
      year: "",
      vin: "",
      file: null,
      preview: "",
    });
  };

  const handleVehicleField = (key, value) => {
    setDraftVehicle((v) => ({ ...(v || {}), [key]: value }));
  };

  const handleVehicleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setDraftVehicle((v) => ({ ...(v || {}), file, preview }));
  };

  // NEW: cancel add (clear draft and revoke preview blob)
  const cancelAddVehicle = () => {
    setVehError("");
    setDraftVehicle((v) => {
      if (v?.preview && String(v.preview).startsWith("blob:")) {
        try {
          URL.revokeObjectURL(v.preview);
        } catch {}
      }
      return null;
    });
  };

  function validateVehicleFields(obj, existingList, excludeId = null) {
    const errs = [];
    if (!obj.make?.trim()) errs.push("Make is required.");
    if (!obj.model?.trim()) errs.push("Model is required.");
    const yr = Number(obj.year);
    if (!obj.year?.toString().trim() || Number.isNaN(yr)) {
      errs.push("Year must be a number.");
    } else if (!isValidYear(yr, currentYear)) {
      errs.push(`Year must be between 1900 and ${currentYear + 1}.`);
    }
    const vinCheck = validateVIN(obj.vin);
    if (!vinCheck.ok) errs.push(...vinCheck.errors);
    const dup = existingList.some(
      (v) =>
        v.vin.toUpperCase().trim() === obj.vin.toUpperCase().trim() &&
        v.id !== excludeId
    );
    if (dup) errs.push("A vehicle with this VIN already exists.");
    return errs;
  }

  // create vehicle (POST /api/user-vehicles)
  const confirmAddVehicle = async () => {
    if (!draftVehicle) return;
    setVehError("");

    const errs = validateVehicleFields(draftVehicle, vehicles);
    if (errs.length) {
      setVehError(errs.join(" "));
      return;
    }

    // Prepare request payload
    const payload = {
      user_id: 1, // TEMP — replace with actual user_id when auth is re-enabled
      make: draftVehicle.make.trim(),
      model: draftVehicle.model.trim(),
      year: Number(draftVehicle.year),
      vin: normalizeVinInput(draftVehicle.vin),
    };

    try {
      const res = await fetch(api(`/user-vehicles`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.detail || `Vehicle creation failed (${res.status})`);
      }

      const newVeh = await res.json();
      setVehicles((list) => [newVeh, ...list]);
      setDraftVehicle(null);
    } catch (e) {
      console.error("Add vehicle failed:", e);
      setVehError(e.message || "Could not add vehicle.");
    }
  };

  const startEditVehicle = (id) => {
    const v = vehicles.find((x) => x.id === id);
    if (!v) return;
    setVehError("");
    setEditingId(id);
    setEditBuffer({ ...v });
  };

  const cancelEditVehicle = () => {
    setEditingId(null);
    setEditBuffer(null);
    setVehError("");
  };

  // UPDATED: Save edit -> PUT to API
  const saveEditVehicle = async () => {
    if (!editBuffer) return;
    setVehError("");

    const errs = validateVehicleFields(editBuffer, vehicles, editingId);
    if (errs.length) {
      setVehError(errs.join(" "));
      return;
    }

    const payload = {
      make: editBuffer.make?.trim() || undefined,
      model: editBuffer.model?.trim() || undefined,
      year: editBuffer.year ? Number(editBuffer.year) : undefined,
      vin: editBuffer.vin ? normalizeVinInput(editBuffer.vin) : undefined,
    };

    try {
      const res = await fetch(api(`/user-vehicles/${editingId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.detail || `Update failed (${res.status})`);
      }

      const updated = await res.json();

      setVehicles((list) =>
        list.map((item) => (item.id === editingId ? { ...item, ...updated } : item))
      );
      setEditingId(null);
      setEditBuffer(null);
    } catch (e) {
      console.error("Update vehicle failed:", e);
      setVehError(e.message || "Could not update vehicle.");
    }
  };

  const removeVehicle = async (id) => {
    const target = vehicles.find((x) => x.id === id);
    if (!target) return;

    const label = [target.year, target.make, target.model].filter(Boolean).join(" ");
    const ok = window.confirm(
      `Remove vehicle${label ? `: ${label}` : ""}? This cannot be undone.`
    );
    if (!ok) return;

    try {
      const res = await fetch(api(`/user-vehicles/${id}`), {
        method: "DELETE",
        headers: { ...authHeaders() },
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setVehicles((list) => list.filter((v) => v.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setEditBuffer(null);
      }
    } catch (e) {
      console.error("Delete vehicle failed:", e);
      setVehError(e.message || "Could not delete vehicle.");
    }
  };

  const handleEditImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setEditBuffer((buf) => {
      if (buf?.preview && String(buf.preview).startsWith("blob:")) {
        try {
          URL.revokeObjectURL(buf.preview);
        } catch {}
      }
      return { ...(buf || {}), file, preview };
    });
  };

  /* ----------------------------------------------------------------------
     page layout
  ----------------------------------------------------------------------*/
  return (
    <div className={styles.pageShell}>
      <Nav />

      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Your Service Dashboard</h1>

        <div className={styles.mainLayout}>
          {/* Sidebar */}
          <aside className={styles.sideNav}>
            <ul className={styles.sideNavMenu}>
              {menu.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.key !== "profile" && pathname?.startsWith(item.href));
                return (
                  <li
                    key={item.key}
                    className={`${styles.sideNavItem} ${
                      isActive ? styles.sideNavItemActive : ""
                    }`}
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
          <main className={styles.mainContent}>
            <div className={styles.panelCard}>
              <div className={styles.sectionHeader}>
                <h2>Account Information</h2>
                {!isEditing ? (
                  <button
                    className={`${styles.buttonBase} ${styles.buttonPrimary}`}
                    onClick={toggleEdit}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className={styles.buttonRow}>
                    <button
                      className={`${styles.buttonBase} ${styles.buttonPrimary}`}
                      onClick={saveProfile}
                    >
                      Save
                    </button>
                    <button
                      className={`${styles.buttonBase} ${styles.buttonSecondary}`}
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

              {!loading && !error && (!isEditing ? (
                <div>
                  <p><strong>First Name:</strong> {formData.firstName || "—"}</p>
                  <p><strong>Last Name:</strong> {formData.lastName || "—"}</p>
                  <p><strong>Email:</strong> {formData.email || "—"}</p>
                  <p><strong>Phone:</strong> {formData.phone || "—"}</p>
                </div>
              ) : (
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label>First Name</label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Last Name</label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Email</label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Phone</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ))}

              {/* Change password */}
              <div style={{ marginTop: 16 }}>
                {pwdMode === "hidden" && (
                  <button
                    className={`${styles.buttonBase} ${styles.buttonSecondary}`}
                    onClick={startPwd}
                  >
                    Change Password
                  </button>
                )}

                {pwdMode === "verify" && (
                  <div className={styles.panelCard} style={{ marginTop: 12 }}>
                    <div className={styles.sectionHeader} style={{ marginBottom: 8 }}>
                      <h3>Verify Current Password</h3>
                      <button
                        className={`${styles.buttonBase} ${styles.buttonSecondary}`}
                        onClick={cancelPwd}
                      >
                        Close
                      </button>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formField}>
                        <label>Current Password</label>
                        <input
                          type="password"
                          autoComplete="current-password"
                          value={pwd.current}
                          onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                        />
                      </div>
                      <div className={`${styles.formField} ${styles.formFullRow}`}>
                        <button
                          className={`${styles.buttonBase} ${styles.buttonPrimary}`}
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
                  <div className={styles.panelCard} style={{ marginTop: 12 }}>
                    <div className={styles.sectionHeader} style={{ marginBottom: 8 }}>
                      <h3>Update Password</h3>
                      <button
                        className={`${styles.buttonBase} ${styles.buttonSecondary}`}
                        onClick={cancelPwd}
                      >
                        Close
                      </button>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formField}>
                        <label>New Password</label>
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={pwd.next}
                          onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label>Confirm Password</label>
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={pwd.confirm}
                          onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                        />
                      </div>

                      {/* Dynamic rules checklist (expects .ruleList/.ruleOk/.ruleBad) */}
                      <PasswordChecklist
                        rules={rules}
                        matchOk={matchOk}
                        styles={styles}
                      />

                      <div className={`${styles.buttonRow} ${styles.formFullRow}`}>
                        <button
                          className={`${styles.buttonBase} ${styles.buttonPrimary}`}
                          disabled={!rulesOk || !matchOk || pwdSaving}
                          onClick={updatePwd}
                          type="button"
                        >
                          {pwdSaving ? "Saving..." : "Update Password"}
                        </button>
                        <button
                          className={`${styles.buttonBase} ${styles.buttonSecondary}`}
                          onClick={() => setPwdMode("verify")}
                          type="button"
                        >
                          Back
                        </button>
                      </div>

                      {!matchOk && (pwd.next || pwd.confirm) && (
                        <div
                          className={`${styles.alert} ${styles.alertError} ${styles.formFullRow}`}
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
                          } ${styles.formFullRow}`}
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

            {/* ------------------------------------------------------------------
                VEHICLES: UI (rendered UNDER the profile card)
            ------------------------------------------------------------------ */}
            <div className={styles.panelCard} style={{ marginTop: 16 }}>
              <div className={styles.sectionHeader}>
                <h2>Vehicles</h2>
                <span />
              </div>

              {vehError && (
                <div className={`${styles.alert} ${styles.alertError}`} style={{ marginBottom: 8 }}>
                  {vehError}
                </div>
              )}

              {vehicles.length === 0 && !draftVehicle && (
                <p style={{ marginTop: 8 }}>No vehicles added yet.</p>
              )}

              {vehicles.map((v) => {
                const isEditingVehicle = editingId === v.id;
                return (
                  <div
                    key={v.id}
                    className={styles.panelCard}
                    style={{ marginTop: 12, padding: "1.25rem" }}
                  >
                    <div className={styles.sectionHeader} style={{ marginBottom: 8 }}>
                      <h3 style={{ margin: 0 }}>
                        {v.make} {v.model} {v.year}
                      </h3>
                      {!isEditingVehicle ? (
                        <button
                          className={`${styles.buttonBase} ${styles.buttonPrimary}`}
                          onClick={() => startEditVehicle(v.id)}
                        >
                          Edit
                        </button>
                      ) : (
                        <div className={styles.buttonRow}>
                          <button
                            className={`${styles.buttonBase} ${styles.buttonPrimary}`}
                            onClick={saveEditVehicle}
                          >
                            Save
                          </button>
                          <button
                            className={`${styles.buttonBase} ${styles.buttonSecondary}`}
                            onClick={() => removeVehicle(v.id)}
                            title="Remove this vehicle"
                          >
                            Delete
                          </button>
                          <button
                            className={`${styles.buttonBase} ${styles.buttonSecondary}`}
                            onClick={cancelEditVehicle}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* === VIEW MODE === */}
                    {!isEditingVehicle ? (
                      <div className={styles.vehicleRow}>
                        {/* Thumbnail */}
                        <div className={`${styles.vehicleThumb} ${styles.vehicleThumbFixed}`}>
                          {v.preview ? (
                            <img
                              src={v.preview}
                              alt="Vehicle"
                              className={styles.vehicleThumbImg}
                            />
                          ) : (
                            <span className={styles.vehicleThumbEmpty}>No image</span>
                          )}
                        </div>

                        {/* Details (read-only) */}
                        <div className={styles.vehicleFormCol}>
                          <div className={styles.readOnlyRow}>
                            <span className={styles.readOnlyLabel}>Make:</span> {v.make}
                          </div>
                          <div className={styles.readOnlyRow}>
                            <span className={styles.readOnlyLabel}>Model:</span> {v.model}
                          </div>
                          <div className={styles.readOnlyRow}>
                            <span className={styles.readOnlyLabel}>Year:</span> {v.year}
                          </div>
                          <div className={styles.readOnlyRow}>
                            <span className={styles.readOnlyLabel}>VIN:</span> {v.vin}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* === EDIT MODE === */
                      <div className={styles.vehicleRow}>
                        {/* image + uploader column */}
                        <div className={styles.vehicleImageCol}>
                          <div className={styles.vehicleThumb}>
                            {editBuffer?.preview ? (
                              <img
                                src={editBuffer.preview}
                                alt="Vehicle"
                                className={styles.vehicleThumbImg}
                              />
                            ) : (
                              <span className={styles.vehicleThumbEmpty}>No image</span>
                            )}
                          </div>
                          <input type="file" accept="image/*" onChange={handleEditImage} />
                        </div>

                        {/* form column */}
                        <div className={styles.vehicleFormCol}>
                          <div className={styles.formGrid}>
                            <div className={styles.formField}>
                              <label>Make</label>
                              <input
                                value={editBuffer.make}
                                onChange={(e) => setEditBuffer({ ...editBuffer, make: e.target.value })}
                              />
                            </div>
                            <div className={styles.formField}>
                              <label>Model</label>
                              <input
                                value={editBuffer.model}
                                onChange={(e) => setEditBuffer({ ...editBuffer, model: e.target.value })}
                              />
                            </div>
                            <div className={styles.formField}>
                              <label>Year</label>
                              <input
                                value={editBuffer.year}
                                onChange={(e) =>
                                  setEditBuffer({ ...editBuffer, year: digitsOnly(e.target.value) })
                                }
                              />
                            </div>
                            <div className={styles.formField}>
                              <label>VIN</label>
                              <input
                                value={editBuffer.vin}
                                onChange={(e) =>
                                  setEditBuffer({ ...editBuffer, vin: normalizeVinInput(e.target.value) })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Draft add box */}
              {draftVehicle && (
                <div className={`${styles.panelCard} ${styles.cardCompact} ${styles.mt12}`}>
                  <div className={styles.vehicleRow}>
                    {/* image column */}
                    <div className={styles.vehicleImageCol}>
                      <div className={`${styles.vehicleThumb} ${styles.mb8}`}>
                        {draftVehicle.preview ? (
                          <img
                            src={draftVehicle.preview}
                            alt="Preview"
                            className={styles.vehicleThumbImg}
                          />
                        ) : (
                          <span className={styles.vehicleThumbEmpty}>Thumbnail</span>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleVehicleImage} />
                    </div>

                    {/* form column */}
                    <div className={styles.vehicleFormCol}>
                      <div className={styles.formGrid}>
                        <div className={styles.formField}>
                          <label>Make</label>
                          <input
                            value={draftVehicle.make}
                            onChange={(e) => handleVehicleField("make", e.target.value)}
                          />
                        </div>
                        <div className={styles.formField}>
                          <label>Model</label>
                          <input
                            value={draftVehicle.model}
                            onChange={(e) => handleVehicleField("model", e.target.value)}
                          />
                        </div>
                        <div className={styles.formField}>
                          <label>Year</label>
                          <input
                            value={draftVehicle.year}
                            onChange={(e) => handleVehicleField("year", digitsOnly(e.target.value))}
                          />
                        </div>
                        <div className={styles.formField}>
                          <label>VIN</label>
                          <input
                            value={draftVehicle.vin}
                            onChange={(e) => handleVehicleField("vin", normalizeVinInput(e.target.value))}
                          />
                        </div>

                        {/* confirm row */}
                        <div
                          className={`${styles.formFullRow} ${styles.buttonRow}`}
                          style={{ justifyContent: "flex-end", marginTop: 8, gap: "0.5rem" }}
                        >
                          <button
                            className={`${styles.buttonBase} ${styles.buttonPrimary}`}
                            onClick={confirmAddVehicle}
                            type="button"
                          >
                            Confirm Vehicle
                          </button>
                          <button
                            className={`${styles.buttonBase} ${styles.buttonSecondary}`}
                            onClick={cancelAddVehicle}
                            type="button"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ADD VEHICLE button */}
              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 12 }}>
                <button
                  className={`${styles.buttonBase} ${styles.buttonSecondary}`}
                  onClick={startAddVehicle}
                  disabled={!!draftVehicle}
                  title={draftVehicle ? "Finish current vehicle first" : undefined}
                >
                  Add Vehicle
                </button>
              </div>
            </div>
            {/* --------------------------- end Vehicles UI --------------------------- */}
          </main>
        </div>
      </div>
    </div>
  );
}
