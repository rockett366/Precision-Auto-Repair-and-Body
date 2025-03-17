import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../app/constants/nav";

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
