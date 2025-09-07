import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../constants/nav";

export default function Home() {
  return (
    <div>
      <Nav />
      <div className={styles.profilePage}>
        <div className={styles.leftContainer}>
          <div>
            <a href="./client-portal-profile" className={styles.activeTab}>
              Profile
            </a>
          </div>
          <div>
            <a href="./client-portal-profile" className={styles.inactiveTab}>
              View Vehicle Status
            </a>
          </div>
          <div>
            <a href="./client-portal-profile" className={styles.inactiveTab}>
              Request New Service
            </a>
          </div>
          <div>
            <a href="./client-portal-profile" className={styles.inactiveTab}>
              Leave a Review
            </a>
          </div>
          <div>
            <a href="./client-portal-profile" className={styles.inactiveTab}>
              Past Records
            </a>
          </div>
          <div>
            <a href="../" className={styles.inactiveTab}>
              Sign-Out
            </a>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <p className={styles.header}>Your Service Dashboard</p>
          <div className={styles.bigContainer}>
            <div className={styles.topContainer}>
              <div className={styles.topLeftContainer}>
                <p className={styles.profileHeader}>Profile</p>
              </div>
              <div className={styles.topRightContainer}>
                <button className={styles.editButton}>Edit</button>
              </div>
            </div>
            <div className={styles.smallContainer}>
              <div className={styles.inputWrapper}>
                <p>Name:</p>
                <p>Tobey Maguire</p>
              </div>
              <div className={styles.inputWrapper}>
                <p>Phone Number:</p>
                <p>(012) 345-6789</p>
              </div>
              <div className={styles.inputWrapper}>
                <p>Email:</p>
                <p>example@gmail.com</p>
              </div>
              <div className={styles.inputWrapper}>
                <p>User Since:</p>
                <p>01/01/0001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
