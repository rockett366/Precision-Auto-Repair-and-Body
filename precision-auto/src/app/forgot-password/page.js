"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Nav from "../constants/nav.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!email || !email.includes("@")) {
      setPopupMessage("Please enter a valid email address.");
      setShowPopup(true);
      return;
    }
    // TODO: call backend to initiate reset email
    setPopupMessage("Email submitted successfully!");
    setShowPopup(true);
  };

  return (
    <div>
      <Nav />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.landing}>
            <h1>Forgot Password</h1>
            <p>Please enter the E-Mail associated with your account and a temporary password will</p>
            <p>be provided. Please change your password within the profile service dashboard.</p>

            <br />
            <br />

            <form className={styles.emailbox} onSubmit={handleSubmit} noValidate>
              <b>Email:</b>
              <div className={styles.formContainer}>
                <div className={styles.inputWrapper}>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    name="email"
                    className={styles.inputbox}
                    type="email"
                    placeholder="eg. example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`${styles.button} ${styles.signup_button}`}
              >
                Submit
              </button>
            </form>
          </div>
        </main>
      </div>

      {showPopup && (
        <div className={styles.popupOverlay} role="dialog" aria-modal="true">
          <div className={styles.popupBox}>
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}