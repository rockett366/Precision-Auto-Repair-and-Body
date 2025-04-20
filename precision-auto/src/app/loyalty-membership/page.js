// src/app/about/page.js
import styles from "./page.module.css"; // Import the CSS module
import Nav from "../constants/nav.js";
import Footer from "../constants/footer";
import Image from "next/image";

export default function Loyalty() {
  return (
    <div className={styles.page}>
      <Nav />
      <div className={styles.wholepage}>
        <div className={styles.title}>
          <Image
            className={styles.logo}
            src="/images/logoBW.png"
            alt="stock photo for car"
            width={600}
            height={200}
          />
          <h1 className={styles.header}>Customer Loyalty Membership</h1>
        </div>
        {/* info cards */}
        <div className={styles.titleCard}>
          <div className={styles.cardName}>
            <Image
              className={styles.logo}
              src="/images/loyalty-page/percent.svg"
              alt="stock photo for car"
              width={100}
              height={100}
            />
            <h3>Discounted Services</h3>
          </div>
          <div className={styles.cardName}>
            <Image
              className={styles.logo}
              src="/images/loyalty-page/handshake.svg"
              alt="stock photo for car"
              width={100}
              height={100}
            />
            <h3>Free Services</h3>
          </div>
          <div className={styles.cardName}>
            <Image
              className={styles.logo}
              src="/images/loyalty-page/tiers.svg"
              alt="stock photo for car"
              width={100}
              height={100}
            />
            <h3>Different Membership Plans</h3>
          </div>
        </div>

        {/* info about the membership */}
        <div className={styles.sectionInfo}>
          <div className={styles.sectionTitle}>
            <h2>Our Membership</h2>
            <div className={styles.fullDividerBar}> </div>
          </div>
          <p>
            We are proudly introducing our Customer Loyalty Member Program.
            Being the only repair facility in the area to offer the opportunity
            for our customers to join a membership that works and saves you
            money in most of your automotive needs. No hassle of looking for
            fake coupon sales. <br></br>
            <br></br> That is right! There is no need for coupons and no waiting
            for sales of any kind. You get the best low pricing possible for
            honest good service and quality guaranteed products for your vehicle
            all the time! You can review here and choose from some of the
            discounted services you will benefit from when you become a member
            of Precision Auto Repair & Body.
          </p>
        </div>

        {/* free and discounted services */}
        <div className={styles.discounts}>
          <div className={styles.discountCategory}>
            <h2>Free Services</h2>
            <br></br>
            <ul>
              <li>Free multipoint vehicle inspections</li>
              <li>Free tire rotations / pressure checks</li>
              <li>Free battery / charging system check</li>
              <li>Free monitor / DTC code check & clear</li>
              <li>Free mechanical / collision estimates</li>
              <li>Free VIN verifications (3 per year)</li>
              <li>Free notary public (3 per year)</li>
            </ul>
          </div>
          <div className={styles.discountCategory}>
            <h2>Discounted Services</h2>
            <br></br>
            <ul>
              <li>50% OFF any oil service</li>
              <li>50% off wiper blade replacements</li>
              <li>50% off diagnostics</li>
              <li>50% off Pre-Purchase/ overall inspections</li>
              <li>50% AC service</li>
              <li>30% off any other repair/ service</li>
              <li>25% off our ebay part store wide</li>
              <li>25% off our store merchandise</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
