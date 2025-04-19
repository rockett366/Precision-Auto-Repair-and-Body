import React from "react";
import styles from "../page.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/">Contact us</Link>
        </li>
        <li>
          <Link href="/">Rewards</Link>
        </li>
        <li>
          <Link href="/select-service">Get Estimate</Link>
        </li>
        <li>
          <Link href="/">Services</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/">Login</Link>
        </li>
      </ul>{" "}
      <p>
        Copyright © 2025 Precision Auto Repair and Body. All Rights Reserved.
      </p>
    </div>
  );
}
