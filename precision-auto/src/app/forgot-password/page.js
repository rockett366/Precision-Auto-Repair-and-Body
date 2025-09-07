// src/app/forgot-password/page.js
"use client"
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../constants/nav.js";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [showPopup, setShowPopup] = useState(false);
	const [popupMessage, setPopupMessage] = useState("");

// When clicked, the 'submit' button calls this function.
const handleSubmit = () => {
  if (!email.includes("@")) {
    setPopupMessage("Please enter a valid email address.");
    setShowPopup(true);
    return;
  }
	// Then look for the E-mail in the database
	
	// If successful, send and E-mail to the address
  
	// On success, make a window appear.
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
			
			<div className={styles.emailbox}>
				<b>E-Mail:</b>
				<div className={styles.formContainer}>
					<div className={styles.inputWrapper}>
					  <label htmlFor="email">
					  </label>
					  <input
						className={styles.inputbox}
						type="text"
						placeholder="eg. example@gmail.com"
						onChange={(e) => setEmail(e.target.value)}
						required
					  ></input>
					</div>
				 </div>
				 
				<button className={styles.button + " " + styles.signup_button}
                onClick={handleSubmit}>
				Submit
				</button>
			</div>
			
          </div>
        </main>
      </div>
	  	{showPopup && (
  <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
    <div className={styles.popupBox}>
      <p>{popupMessage}</p>
      <button onClick={() => setShowPopup(false)}>Close</button>
    </div>
  </div>
)}
    </div>
  );
}
