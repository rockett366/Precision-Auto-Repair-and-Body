"use client";
import React from "react";
import styles from "./admin-sidebar.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
export default function Sidebar() {
    const pathname = usePathname();
    return (
        <div className={styles.sidebar}>
            <h1 className={styles.adminTitle}>Admin</h1>
            <ul className={styles.adminList}>
                <li className={pathname === "/admin-profile" ? styles.adminCurSelect : styles.adminItem}>
                    <a href="/admin-profile">Profile</a>
                </li>
                <li className={pathname === "/admin-inventory" ? styles.adminCurSelect : styles.adminItem}>
                    <a href="/admin-inventory">Inventory</a>
                </li>
                <li className={pathname === "/admin-appointments" ? styles.adminCurSelect : styles.adminItem}>
                    <a href="/admin-appointments">Appointments</a>
                </li>
                <li className={pathname === "/admin-estimates" ? styles.adminCurSelect : styles.adminItem}>
                    <a href="/admin-estimates">Review Estimates</a>
                </li>
                <li className={pathname === "/admin-records" ? styles.adminCurSelect : styles.adminItem}>
                    <a href="/admin-records">Past Records</a>
                </li>
                <li className={pathname === "/admin-change-photos" ? styles.adminCurSelect : styles.adminItem}>
                    <a href="/admin-change-photos">Change Photos</a>
                </li>
                <li className={pathname === "/admin-customer-vehicles" ? styles.adminCurSelect : styles.adminItem}>
                    <a href="/admin-customer-vehicles">Customer Vehicles</a>
                </li>
            </ul>
        </div>
    );
}