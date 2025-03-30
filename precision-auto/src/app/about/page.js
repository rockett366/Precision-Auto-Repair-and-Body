// src/app/about/page.js
import styles from "./page.module.css"; // Import the CSS module
import Nav from "../constants/nav.js";

export default function About() {
  return (
    <div className={styles.wholePage}>
      <Nav />
      <div className={styles.container}>
        <h1 className={styles.header}>
          OUR FACILITY
          <span className={styles.line}></span>
        </h1>

        <div className={styles.photoGrid}>
          <div className={styles.photoContainer}>
            <img
              src="/images/about/placeholderimagecar.jpg"
              alt="Facility 1"
              className={styles.photo}
            />
          </div>
          <div className={styles.photoContainer}>
            <img
              src="/images/about/placeholderimagecar.jpg"
              alt="Facility 2"
              className={styles.photo}
            />
          </div>
          <div className={styles.photoContainer}>
            <img
              src="/images/about/placeholderimagecar.jpg"
              alt="Facility 3"
              className={styles.photo}
            />
          </div>

          {/* Row 2 */}
          <div className={styles.photoContainer}>
            <img
              src="/images/about/placeholderimagecar.jpg"
              alt="Facility 4"
              className={styles.photo}
            />
          </div>
          <div className={styles.photoContainer}>
            <img
              src="/images/about/placeholderimagecar.jpg"
              alt="Facility 5"
              className={styles.photo}
            />
          </div>
          <div className={styles.photoContainer}>
            <img
              src="/images/about/placeholderimagecar.jpg"
              alt="Facility 6"
              className={styles.photo}
            />
          </div>
        </div>

        <div className={styles.storyContainer}>
          <div className={styles.storyHeader}>
            <span className={styles.storyLine}></span>
            <h2>OUR STORY</h2>
          </div>

          <p className={styles.storyParagraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac
            erat sed elit aliquet bibendum. Integer lacinia odio non libero
            tristique, sit amet tempor arcu cursus. Mauris dictum libero et orci
            euismod, vitae eleifend enim facilisis. Curabitur vulputate nulla ut
            felis placerat, ac suscipit lectus vulputate. Suspendisse potenti.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac
            erat sed elit aliquet bibendum. Integer lacinia odio non libero
            tristique, sit amet tempor arcu cursus. Mauris dictum libero et orci
            euismod, vitae eleifend enim facilisis. Curabitur vulputate nulla ut
            felis placerat, ac suscipit lectus vulputate. Suspendisse potenti.
          </p>
        </div>

        <div className={styles.imageSection}>
          <div className={styles.imageHeader}>
            <span className={styles.imageLine}></span>
            <h2>CERTIFICATIONS</h2>
          </div>

          <img
            src="/images/about/placeholderimagecar.jpg"
            alt="Certificaiton Photo"
            className={styles.image}
          />
        </div>
      </div>
      <section className={styles.mapSection}>
        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1332.064621112172!2d-121.43439870658518!3d38.607761127638554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ad9f0ab912def%3A0x11dbc3652556b601!2sPrecision%20Auto%20Repair%20%26%20Body!5e0!3m2!1sen!2sus!4v1743292844222!5m2!1sen!2sus&style=feature:all|element:labels|visibility:off&style=feature:all|element:geometry.fill|color:0x2d2d2d&style=feature:road|color:0xffffff&style=feature:poi|visibility:off"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
            className={styles.mapIframe}
          />
        </div>
      </section>
    </div>
  );
}
