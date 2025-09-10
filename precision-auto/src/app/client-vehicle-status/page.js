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
            <a href="./client-vehicle-status" className={styles.inactiveTab}>
              View Vehicle Status
            </a>
          </div>
          <div>
            <a href="./select-service" className={styles.inactiveTab}>
              Request New Service
            </a>
          </div>
          <div>
            <a href="./review" className={styles.inactiveTab}>
              Leave a Review
            </a>
          </div>
          <div>
            <a href="./client-vehicle-status" className={styles.inactiveTab}>
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
                <p className={styles.profileHeader}>Vehicle Status</p>
              </div>
            </div>
            <div className={styles.smallContainer}>
              <div className={styles.inputWrapper}>
                <p>Status Overview:</p>
                <div className={styles.statusOverview}>
                  <div className={styles.inputWrapper2}>
                  <span className={styles.circle}></span>
                  <p>In Service</p>
                </div>
                  <p className={styles.line}></p>
                <div className={styles.inputWrapper2}>
                  <span className={styles.circle}></span>
                  <p>Repairing</p>
                </div>
                  <p className={styles.line}></p>
                <div className={styles.inputWrapper2}>
                  <span className={styles.circle}></span>
                  <p>Ready for</p>
                  <p>Pickup</p>
                </div>
                </div>
              </div>
              <div className={styles.inputWrapper}>
                <p>Vehicle Info:</p>
                <p className={styles.info}>Make: Toyota</p>
                <p className={styles.info}>Model: Camry</p>
                <p className={styles.info}>Year: 2012</p>
                <p className={styles.info}>VIN: 12345678</p>
              </div>
              <div className={styles.inputWrapper}>
                <p>Design Consideration:</p>
                <p className={styles.info}>Color: Red</p>
                <p className={styles.info}>Design: Yes</p>
              </div>
              <div className={styles.inputWrapper}>
                <p>Additional Details:</p>
                <p className={styles.info}>notes from technician</p>
                <p className={styles.info}>upgrades</p>
                <p className={styles.info}>...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
