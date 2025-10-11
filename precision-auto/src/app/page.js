"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../app/constants/nav";
import Footer from "../app/constants/footer";
import Link from "next/link";
import { useState, useEffect } from "react";

// Define API base URL and user ID (in real app, get from auth context)
const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const api = (path) => `${base}/api${path}`;

export default function Home() {
  const [landingImages, setLandingImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(api(`/landing-page/load-images/`));
        const data = await res.json();
        setLandingImages(data.images);
      } catch (err) {
        console.error("Failed to fetch images:", err);
      }
    }

    fetchImages();
  }, []);
  return (
    <div className={styles.page}>
      <Nav />
      <main className={styles.main}>
        <div className={styles.landing}>
          {landingImages[0] ? (
            <Image
              className={styles.logo}
              src={landingImages[0]}
              alt="Landing hero"
              fill
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className={styles.logoPlaceholder}>Loading...</div>
          )}

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

        {/* grid images */}
        <div className={styles.gridPhoto}>
          <div className={styles.gridLayer}>
            <div>
              {landingImages[1] ? (
                <Image
                  src={landingImages[1]}
                  alt="stock photo for car"
                  width={300}
                  height={200}
                />
              ) : (
                <div className={styles.logoPlaceholder}>Loading...</div>
              )}
            </div>
            <div>
              {landingImages[2] ? (
                <Image
                  src={landingImages[2]}
                  alt="stock photo for car"
                  width={300}
                  height={200}
                />
              ) : (
                <div className={styles.logoPlaceholder}>Loading...</div>
              )}
            </div>
            <div>
              {landingImages[3] ? (
                <Image
                  src={landingImages[3]}
                  alt="stock photo for car"
                  width={300}
                  height={200}
                />
              ) : (
                <div className={styles.logoPlaceholder}>Loading...</div>
              )}
            </div>

            <div>
              {landingImages[4] ? (
                <Image
                  src={landingImages[4]}
                  alt="stock photo for car"
                  width={300}
                  height={200}
                />
              ) : (
                <div className={styles.logoPlaceholder}>Loading...</div>
              )}
            </div>
            <div>
              {landingImages[3] ? (
                <Image
                  src={landingImages[3]}
                  alt="stock photo for car"
                  width={300}
                  height={200}
                />
              ) : (
                <div className={styles.logoPlaceholder}>Loading...</div>
              )}
            </div>
            <div>
              {landingImages[2] ? (
                <Image
                  src={landingImages[2]}
                  alt="stock photo for car"
                  width={300}
                  height={200}
                />
              ) : (
                <div className={styles.logoPlaceholder}>Loading...</div>
              )}
            </div>
          </div>
        </div>
        {/* request an estimate */}
        <div className={styles.fullDividerBar}> </div>

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
        {/* make an apointment */}
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

        <div className={styles.divider}>
          <div className={styles.fullDividerBar}> </div>
          <div className={styles.rotateBolt}>
            <Image
              src="/images/landing-page/bolt.png"
              alt="bolt"
              width={50}
              height={50}
            />
          </div>

          <div className={styles.fullDividerBar}> </div>
        </div>

        {/* learn our story section */}
        <div className={styles.infoSection}>
          <div className={styles.infoParagraph}>
            <h2>Learn our story</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim{" "}
            </p>
            <button className={styles.button}>
              {" "}
              <Link href="/about">About Us</Link>
            </button>
          </div>
          <div className={styles.photoGroup}>
            {landingImages[0] ? (
              <Image
                src={landingImages[0]}
                alt="stock photo for car"
                width={300}
                height={200}
              />
            ) : (
              <div className={styles.logoPlaceholder}>Loading...</div>
            )}
            {landingImages[1] ? (
              <Image
                src={landingImages[1]}
                alt="stock photo for car"
                width={300}
                height={200}
              />
            ) : (
              <div className={styles.logoPlaceholder}>Loading...</div>
            )}
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
        {/* yelp reviews */}
        <div className={styles.reviews}>
          <div>
            <span
              className="yelp-review"
              data-review-id="r64tSD1tqGWzHzs6XMKQSg"
              data-hostname="www.yelp.com"
            >
              Read{" "}
              <a
                href="https://www.yelp.com/user_details?userid=AmyIHMi1P1zyGOhCWMjfPw"
                rel="nofollow noopener"
              >
                Lucia M.
              </a>
              's{" "}
              <a
                href="https://www.yelp.com/biz/precision-auto-repair-and-body-sacramento?hrid=r64tSD1tqGWzHzs6XMKQSg"
                rel="nofollow noopener"
              >
                review
              </a>{" "}
              of{" "}
              <a
                href="https://www.yelp.com/biz/XNgbRk52GjGXPlRvlNTD3Q"
                rel="nofollow noopener"
              >
                Precision Auto Repair & Body
              </a>{" "}
              on{" "}
              <a href="https://www.yelp.com" rel="nofollow noopener">
                Yelp
              </a>
              <script
                src="https://www.yelp.com/embed/widgets.js"
                type="text/javascript"
                async
              ></script>
            </span>
          </div>

          <div>
            <span
              className="yelp-review"
              data-review-id="RyN4d-2BIGKyIhKwoImpZg"
              data-hostname="www.yelp.com"
            >
              Read{" "}
              <a
                href="https://www.yelp.com/user_details?userid=chBGSA6tVMzTZUTIXc-3Uw"
                rel="nofollow noopener"
              >
                Evelyn C.
              </a>
              's{" "}
              <a
                href="https://www.yelp.com/biz/precision-auto-repair-and-body-sacramento?hrid=RyN4d-2BIGKyIhKwoImpZg"
                rel="nofollow noopener"
              >
                review
              </a>{" "}
              of{" "}
              <a
                href="https://www.yelp.com/biz/XNgbRk52GjGXPlRvlNTD3Q"
                rel="nofollow noopener"
              >
                Precision Auto Repair & Body
              </a>{" "}
              on{" "}
              <a href="https://www.yelp.com" rel="nofollow noopener">
                Yelp
              </a>
              <script
                src="https://www.yelp.com/embed/widgets.js"
                type="text/javascript"
                async
              ></script>
            </span>
          </div>
          <div>
            <span
              className="yelp-review"
              data-review-id="MCWaUBsDFBFMFnLnPSTB-w"
              data-hostname="www.yelp.com"
            >
              Read{" "}
              <a
                href="https://www.yelp.com/user_details?userid=57uwPNBXe6sXp22Zp0CYoQ"
                rel="nofollow noopener"
              >
                SacKathy K.
              </a>
              's{" "}
              <a
                href="https://www.yelp.com/biz/precision-auto-repair-and-body-sacramento?hrid=MCWaUBsDFBFMFnLnPSTB-w"
                rel="nofollow noopener"
              >
                review
              </a>{" "}
              of{" "}
              <a
                href="https://www.yelp.com/biz/XNgbRk52GjGXPlRvlNTD3Q"
                rel="nofollow noopener"
              >
                Precision Auto Repair & Body
              </a>{" "}
              on{" "}
              <a href="https://www.yelp.com" rel="nofollow noopener">
                Yelp
              </a>
              <script
                src="https://www.yelp.com/embed/widgets.js"
                type="text/javascript"
                async
              ></script>
            </span>
          </div>
          <div>
            <span
              className="yelp-review"
              data-review-id="8hST1ToKi5PnLRBoyN8OUA"
              data-hostname="www.yelp.com"
            >
              Read{" "}
              <a
                href="https://www.yelp.com/user_details?userid=cWh9jMEswVq1wBnICdqVUg"
                rel="nofollow noopener"
              >
                Cyrus N.
              </a>
              's{" "}
              <a
                href="https://www.yelp.com/biz/precision-auto-repair-and-body-sacramento?hrid=8hST1ToKi5PnLRBoyN8OUA"
                rel="nofollow noopener"
              >
                review
              </a>{" "}
              of{" "}
              <a
                href="https://www.yelp.com/biz/XNgbRk52GjGXPlRvlNTD3Q"
                rel="nofollow noopener"
              >
                Precision Auto Repair & Body
              </a>{" "}
              on{" "}
              <a href="https://www.yelp.com" rel="nofollow noopener">
                Yelp
              </a>
              <script
                src="https://www.yelp.com/embed/widgets.js"
                type="text/javascript"
                async
              ></script>
            </span>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
