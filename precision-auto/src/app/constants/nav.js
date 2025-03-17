import React from "react";
import styles from "../page.module.css";
import Image from "next/image";

import Link from "next/link";

export default function Nav() {
  return (
    <div className={styles.navigation}>
      <nav>
        <p>Contact Us: 916.111.1111</p>

        <ul>
          <li>
            <a href="">Rewards</a>
          </li>
          <li>
            <a href="">Get Estimate</a>
          </li>
          <li>
            <a href="">Services</a>
          </li>
          <li>
            <Image
              className={styles.Mainlogo}
              src="/images/logoBW.png"
              alt="Company logo"
              width={112}
              height={35}
            />
          </li>
          <li>
            <a href="">Contact us</a>
          </li>
          <li>
            <a href="">About</a>
          </li>
          <li>
            <a href="">Login</a>
          </li>
          <li>
            <a href="">Sign-up</a>
          </li>
        </ul>
      </nav>{" "}
    </div>
  );
}
