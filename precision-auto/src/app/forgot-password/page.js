// src/app/forgot-password/page.js
import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../constants/nav.js";

export default function ForgotPassword() {
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
						required
					  ></input>
					</div>
				 </div>
				 
				<button className={styles.button + " " + styles.signup_button}>
				Submit
				</button>
			</div>
			
          </div>
        </main>
      </div>
    </div>
  );
}
