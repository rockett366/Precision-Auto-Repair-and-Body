import React from "react";
import styles from "../page.module.css";
import Image from "next/image";

import Link from "next/link";

export default function Nav() {
  return (
    <div className={styles.navigation}>
      <nav>
        <p>Contact Us: 916.333.2373</p>
        <ul>
          <li>
            <Link href="/loyalty-membership">Membership</Link>
          </li>
          <li>
            <Link href="/">Get Estimate</Link>
          </li>
          <li>
            <Link href="/select-service">Services</Link>
          </li>
          <li>
            <Link href="/">
              <Image
                className={styles.Mainlogo}
                src="/images/logoBW.png"
                alt="Company logo"
                width={112}
                height={35}
              />
            </Link>
          </li>
          <li>
            <Link href="/about">Contact us</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/">Login</Link>
          </li>
          <li>
            <Link href="/signup">Sign-up</Link>
          </li>
        </ul>
      </nav>{" "}
    </div>
  );
}
