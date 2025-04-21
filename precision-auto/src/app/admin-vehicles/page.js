// src/app/admin-vehicles/page.js
import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../constants/nav.js";

export default function AdminVehicles() {
  return (
    <div>
      <Nav />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.landing}>
            <h1>Customer Vehicles</h1>
            <p>Manage vehicle status and view customer vehicles.</p>

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
                    <th>Date Arrived</th>
                    <th>Service</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                {[...Array(10)].map((_, index) => (
                  <tr key={index}>
                    <td>NAME</td>
                    <td>DESCRIPTION</td>
                    <td>01 / 01 / 1001</td>
                    <td>Collision Repair</td>
                    <td>
                      <select className={styles.statusDropdown}>
                        <option value="in-service">In Service</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                      </select>
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
