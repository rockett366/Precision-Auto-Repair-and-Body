import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../constants/nav";

export default function Home() {
  return (
    <div className={styles.signupPage}>
        <div className={styles.leftContainer}>
            <div className={styles.container}>
                <h1 className={styles.header1}>Create your Account</h1>
                <h4 className={styles.header2}>to continue your experience</h4>

                <div className={styles.formContainer}>
                    <div className={styles.inputWrapper}>
                        <label htmlFor="first name"><b>First Name</b></label>
                        <input className = {styles.inputbox} type="text" placeholder="Enter First Name" required></input>
                    </div>

                    <div className={styles.inputWrapper}>
                        <label htmlFor="last name"><b>Last Name</b></label>
                        <input className = {styles.inputbox} type="text" placeholder="Enter Last Name" required></input>
                    </div>
                </div>

                    <label htmlFor="email"><b>Email</b></label>
                    <input className = {styles.inputbox} type="email" placeholder="Enter Email" name="email" required></input>
                <div className={styles.formContainer}>
                    <div className={styles.inputWrapper}>
                        <label htmlFor="password"><b>Password</b></label>
                        <input className = {styles.inputbox} type="password" placeholder="Enter Password" required></input>
                    </div>

                    <div className={styles.inputWrapper}>
                        <label htmlFor="confirm password"><b>Confirm Password</b></label>
                        <input className = {styles.inputbox} type="password" placeholder="Confirm Password" required></input>
                    </div>
                </div>

                    <label htmlFor="phone number"><b>Phone Number</b></label>
                    <input className = {styles.inputbox} type="text" placeholder="Enter Phone Number" required></input>
            </div>
            <a href="../">
                <button className={styles.button + ' ' + styles.signup_button}>Sign Up</button>
            </a>

            <a href="../">
                <button className={styles.button + ' ' + styles.google_button}>Sign in with Google
                    <img
                        src="/images/signup/google-logo.jpg"
                        alt="google logo"
                        className={styles.googlelogo}
                        ></img>
                        </button>
            </a>
                <div className={styles.loginContainer}>
                <p>Have an account already?</p>
                <a href="../">
                    <p className={styles.login}>Log in</p>
                </a>
            </div>
        </div>
        <div className={styles.rightContainer}>
            <img 
                src = "/images/signup/b&w_logo.jpg"
                alt = "logo pic"
                className ={styles.logo}
                ></img>
            <p className={styles.description}>Subscribe to our membership and have 
                instant access to exclusive rewards, and savings!</p>
        </div>
    </div>
    
  );
}