import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../app/constants/nav";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <Nav />
      <main className={styles.main}>
        <div className={styles.landing}>
          <Image
            className={styles.logo}
            src="/images/stockPhoto1.jpg"
            alt="stock photo for car"
            fill
            style={{ objectFit: "cover" }}
          />
          <div className={styles.paragraph}>
            <h1>
              <span>Precision auto repair and body </span> <br></br>
              <i>Your one stop shop for service</i> <br></br>
              <i>and repairs</i>
            </h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
            <button className={styles.button}>
              <Link href="./select-service">Get Estimate</Link>
            </button>
          </div>
        </div>
        <div className={styles.infoSection}>
          <Image
            className={styles.logo}
            src="/images/logoBW.png"
            alt="stock photo for car"
            width={400}
            height={150}
          />
          <div className={styles.infoParagraph}>
            <h2>REQUEST AN ESTIMATE</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
            </p>
            <button className={styles.button}>
              {" "}
              <Link href="./select-service">Estimate Page</Link>
            </button>
          </div>
        </div>
        <div className={styles.infoSectionWords}>
          <div className={styles.infoParagraph}>
            <div className={styles.title}>
              <h2>Make an Appointment</h2>
              <div className={styles.dividerBar}> </div>
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
            </p>
            <button className={styles.button}>
              {" "}
              <Link href="/">Book now</Link>
            </button>
          </div>
        </div>

        {/* become a member for free section */}
        <div className={styles.infoBanner}>
          <div className={styles.bannerTitle}>
            <div className={styles.dividerBar}> </div>

            <h2>Become a Member for free</h2>
            <div className={styles.dividerBar}> </div>
          </div>
          <div className={styles.infoSectionWords}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
            </p>
            <button className={styles.button}>
              {" "}
              <Link href="./signup">SIGN UP NOW!</Link>
            </button>
          </div>
        </div>
        <div className={styles.ctas}></div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
