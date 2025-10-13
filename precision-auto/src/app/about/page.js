// src/app/about/page.js
import styles from "./page.module.css"; // Import the CSS module
import Nav from "../constants/nav.js";

export default function About() {
  return (
    <div className={styles.wholePage}>
      <Nav />
      <div className={styles.container}>

        <h1 className={styles.header}>
          CONTACT US
          <span className={styles.line}></span>
        </h1>

        {/* ---ADDING CONTACT US--- */}

        <div className={styles.bottomSection}>
          {/* Left column (now filled with map) */}
          <div className={styles.leftColumn}>
            {/* ‼ HERE IS THE ONLY ADDED BLOCK ‼ */}
            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1332.064621112172!2d-121.43439870658518!3d38.607761127638554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ad9f0ab912def%3A0x11dbc3652556b601!2sPrecision%20Auto%20Repair%20%26%20Body!5e0!3m2!1sen!2sus!4v1743292844222!5m2!1sen!2sus"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
                className={styles.mapIframe}
              />
            </div>
          </div>

          {/* Right column (contact info) */}
          <div className={styles.rightColumn}>
            <h3><u>Contact Us</u></h3>

            {/* Address Block */}
            <div className={styles.contactBlock}>
              <p>📍1234 Main Street, Anytown, USA 12345</p>
            </div>

            {/* Phone & Email Block */}
            <div className={styles.contactBlock}>
              <p>📞(916) - 123 - 4567</p>

              <br></br>
              <p>
                ✉{" "}
                <i>
                  <a href="mailto:support@collisionrepair.com">
                    support@collisionrepair.com
                  </a>
                </i>
              </p>
            </div>

            {/* Operating Hours Block */}
            <div className={styles.contactBlock}>
              <p>⏰Monday: 9AM - 5PM</p>
              <p>⏰Tuesday: 9AM - 5PM</p>
              <p>⏰Wednesday: 9AM - 5PM</p>
              <p>⏰Thursday: 9AM - 5PM</p>
              <p>⏰Friday: 9AM - 5PM</p>
            </div>
          </div>
        </div>
        {/* END OF CONTACT US */}

      </div>

      <section className={styles.mapSection}>
        <div className={styles.mapGrid}>
          <div className={styles.mapWrapper}>
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
          </div>
          <div className={styles.rightBlock}></div>
        </div>
      </section>
    </div>
  );
}
