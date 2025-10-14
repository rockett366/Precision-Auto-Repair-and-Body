"use client";
import React, { useState } from "react";
import styles from "./cSignIn.module.css";
import Nav from "../constants/nav";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function SignInPage() {
  const router = useRouter();

  // --- form state ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- ui state ---
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = { email: "", password: "" };
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!email) e.email = "Email is required.";
    else if (!emailRx.test(email)) e.email = "Enter a valid email.";

    if (!password) e.password = "Password is required.";

    setErrors(e);
    return !e.email && !e.password;
  };

  const canSubmit = email.length > 0 && password.length > 0 && !submitting;

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        // try to surface backend validation/401 messages
        const ct = res.headers.get("content-type") || "";
        let msg = "Invalid email or password.";
        if (ct.includes("application/json")) {
          const data = await res.json().catch(() => null);
          if (typeof data?.detail === "string") msg = data.detail;
          else if (Array.isArray(data?.detail) && data.detail[0]?.msg)
            msg = data.detail[0].msg;
        } else {
          const text = await res.text().catch(() => "");
          if (text) msg = text;
        }
        setServerError(msg);
        setSubmitting(false);
        return;
      }

      const data = await res.json().catch(() => null);
      if (data?.is_admin) router.push("/admin-profile");
      else router.push("/client-portal-profile");
    } catch (err) {
      setServerError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Nav />
      <div className={styles.signupPage}>
        <div className={styles.leftContainer}>
          <div className={styles.container}>
            <h1 className={styles.header1}>Sign in to your Account</h1>
            <h4 className={styles.header2}>to continue your experience</h4>

            {/* server error banner */}
            {serverError && <p className={styles.errorBanner}>{serverError}</p>}

            <form onSubmit={onSubmit}>
              <div className={styles.formContainer}>
                {/* Email Field with Forgot Password link */}
                <div className={styles.inputWrapper}>
                  <label htmlFor="email">
                    <b>Email</b>
                  </label>
                  <input
                    id="email"
                    className={styles.inputbox}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && (
                    <span className={styles.fieldError}>{errors.email}</span>
                  )}
                  <a href="/forgot-password" className={styles.forgotPassword}>
                    Forgot Password
                  </a>
                </div>

                {/* Password Field */}
                <div className={styles.inputWrapper}>
                  <label htmlFor="password">
                    <b>Password</b>
                  </label>
                  <input
                    id="password"
                    className={styles.inputbox}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errors.password && (
                    <span className={styles.fieldError}>{errors.password}</span>
                  )}
                </div>
              </div>

              <button
                className={`${styles.button} ${styles.signin_button}`}
                type="submit"
                disabled={!canSubmit}
              >
                {submitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Optional: keep Google for later */}
            <button
              className={`${styles.button} ${styles.google_button}`}
              type="button"
            >
              Sign in with Google
              <img
                src="/images/signup/google-logo.jpg"
                alt="google logo"
                className={styles.googlelogo}
              />
            </button>

            <a href="/admin-signin" className={styles.adminSignIn}>
              Admin Sign In
            </a>
          </div>
        </div>

        <div className={styles.rightContainer}>
          <img
            src="/images/signup/b&w_logo.jpg"
            alt="logo pic"
            className={styles.logo}
          />
          <p className={styles.description}>
            Subscribe to our membership and have instant access to exclusive
            rewards, and savings!
          </p>
        </div>
      </div>
    </div>
  );
}
