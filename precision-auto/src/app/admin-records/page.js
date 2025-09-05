// src/app/admin-records/page.js
import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../constants/nav.js";
import Sidebar from "@/app/constants/admin-sidebar";
import SidebarStyles from "@/app/constants/admin-sidebar.module.css";

export default function AdminRecords() {
  return (
    <div className={SidebarStyles.container}>
      <Nav />
      <Sidebar />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.landing}>
            <h1>View Records</h1>
            <p>Manage and view customer repair records.</p>

            {/* Controls: Search Bar, Upload Button, and Sort Dropdown */}
            <div className={styles.controlsContainer}>
              <input
                type="text"
                placeholder="Search Item Name"
                className={styles.searchInput}
              />
              <button className={styles.uploadBtn}>Upload</button>

              {/* Sort Dropdown */}
              <select className={styles.sortDropdown}>
                <option value="">Sort By</option>
                <option value="name">Name</option>
                <option value="date">Date</option>
                <option value="description">Description</option>
              </select>
            </div>

            {/* Table */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>DESCRIPTION</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, index) => (
                    <tr key={index}>
                      <td>NAME</td>
                      <td>DESCRIPTION</td>
                      <td>01 / 01 / 1001</td>
                      <td>
                        <a href="#" className={styles.reviewBtn}>
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}