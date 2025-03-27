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
        <div className={styles.requestEst}>
          <Image
            className={styles.logo}
            src="/images/logoBW.png"
            alt="stock photo for car"
            width={400}
            height={150}
          />
          <div className={styles.reqEstParagraph}>
            <h2>REQUEST AN ESTIMATE</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
            </p>
            <a href="">
              <button className={styles.button}>Estimate Page</button>
            </a>
          </div>
        </div>

        <div className={styles.ctas}></div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
