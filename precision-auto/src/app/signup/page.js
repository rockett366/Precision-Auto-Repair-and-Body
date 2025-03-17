import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
        <main className={styles.main}>
            <div className={styles.signup}>
                <h1 className = {styles.header}>Create Your Account <img className = {styles.testing} src="/images/logo.jpg" alt="logo pic"></img></h1>
                <h4 className = {styles.header}>to continue your experience</h4>


                <label htmlFor="email"><b>Email</b></label>
                <input className = {styles.inputtest} type="text" placeholder="Enter Email" name="email" required></input>

                <label htmlFor="first name"><b>First Name</b></label>
                <input className = {styles.inputtest} type="text" placeholder="Enter First Name" required></input>

                <label htmlFor="last name"><b>Last Name</b></label>
                <input className = {styles.inputtest} type="text" placeholder="Enter Last Name" required></input>

                <label htmlFor="last name"><b>Password</b></label>
                <input className = {styles.inputtest} type="text" placeholder="Enter Password" required></input>
                
                <label htmlFor="last name"><b>Confirm Password</b></label>
                <input className = {styles.inputtest} type="text" placeholder="Confirm Password" required></input>

                <label htmlFor="last name"><b>Phone Number</b></label>
                <input className = {styles.inputtest} type="text" placeholder="Enter Phone Number" required></input>

                <a href="../">
                    <button className={styles.button}>Sign Up</button>
                </a>

                <a href="../">
                    <button className={styles.google_button}>Sign in with Google</button>
                </a>

                

            </div>
        </main>
    </div>
  );
}