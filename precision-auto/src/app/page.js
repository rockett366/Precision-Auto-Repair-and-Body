import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
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
              Your one stop shop for service <br></br> and repairs
            </h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
            <Link href="">
              <button className={styles.button}>Estimate Page</button>
            </Link>
          </div>
        </div>

        <div className={styles.ctas}></div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
