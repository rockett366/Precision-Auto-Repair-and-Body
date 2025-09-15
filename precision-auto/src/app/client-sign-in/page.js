"use client";
import React from "react";
import styles from "./cSignIn.module.css";
import Nav from "../constants/nav"; // Ensure the path is correct

export default function SignInPage() {
  return (
    <div>
      <Nav />
      <div className={styles.signupPage}>
        <div className={styles.leftContainer}>
          <div className={styles.container}>
            <h1 className={styles.header1}>Sign in to your Account</h1>
            <h4 className={styles.header2}>to continue your experience</h4>

            <div className={styles.formContainer}>
              {/* Email Field with Forgot Password link underneath */}
              <div className={styles.inputWrapper}>
                <label htmlFor="email">
                  <b>Email</b>
                </label>
                <input
                  className={styles.inputbox}
                  type="text"
                  placeholder="Email"
                  required
                />
                <a href="#" className={styles.forgotPassword}>
                  Forgot Password
                </a>
              </div>

              {/* Password Field */}
              <div className={styles.inputWrapper}>
                <label htmlFor="password">
                  <b>Password</b>
                </label>
                <input
                  className={styles.inputbox}
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <button className={`${styles.button} ${styles.signin_button}`}>
              Sign In
            </button>

            <button className={`${styles.button} ${styles.google_button}`}>
              Sign in with Google
              <img
                src="/images/signup/google-logo.jpg"
                alt="google logo"
                className={styles.googlelogo}
              />
            </button>

            <a href="#" className={styles.adminSignIn}>
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
