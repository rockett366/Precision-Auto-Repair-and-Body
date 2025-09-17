"use client"; 

import { useState } from "react";
import styles from "./page.module.css";
import Nav from "../constants/nav";

export default function Home() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  // Example records
  const records = [
    { vehicle: "Civic", desc: "Fix Bumper", date: "2025-01-01" },
    { vehicle: "Outback", desc: "Oil Change", date: "2024-12-15" },
    { vehicle: "Corolla", desc: "Replace Tires", date: "2023-06-05" },
    { vehicle: "CR-V", desc: "Engine Repair", date: "2025-02-10" },
    { vehicle: "NAME", desc: "DESCRIPTION", date: "1001-01-01" },
  ];

  // Filter and sort records based on search and sort state
  let filteredRecords = records.filter(
    (rec) =>
      rec.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      rec.desc.toLowerCase().includes(search.toLowerCase())
  );

  // Sort records
  filteredRecords = [...filteredRecords].sort((a, b) => {
    switch (sort) {
      case "latest":
        return new Date(b.date) - new Date(a.date);
      case "oldest":
        return new Date(a.date) - new Date(b.date);
      case "a-z":
        return a.vehicle.localeCompare(b.vehicle);
      case "z-a":
        return b.vehicle.localeCompare(a.vehicle);
      default:
        return 0;
    }
  });

  return (
    <div>
      <Nav />
      <div className={styles.mainPage}>
        {/* Left Navigation Tabs */}
        <div className={styles.leftContainer}>
          <div>
            <a href="./client-portal-profile" className={styles.inactiveTab}>
              Profile
            </a>
          </div>
          <div>
            <a href="./client-vehicle-status" className={styles.inactiveTab}>
              View Vehicle Status
            </a>
          </div>
          <div>
            <a href="./select-service" className={styles.inactiveTab}>
              Request New Service
            </a>
          </div>
          <div>
            <a href="./review" className={styles.inactiveTab}>
              Leave a Review
            </a>
          </div>
          <div>
            <a href="./client-past-records" className={styles.activeTab}>
              Past Records
            </a>
          </div>
          <div>
            <a href="../" className={styles.inactiveTab}>
              Sign-Out
            </a>
          </div>
        </div>

        {/* Right Content Area */}
        <div className={styles.rightContainer}>
          <div className={styles.container}>
            <p className={styles.header}>Past Services/Records</p>
            <div className={styles.controlsContainer}>
              {/* Search and Sort Dropdown */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by vehicle or description"
                className={styles.searchInput}
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={styles.sortDropdown}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>

            {/* Records Table */}
            <div className={styles.tableContainer}>
              <table id="myTable" className={styles.table}>
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Description of Service/Repair</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((rec, idx) => (
                    <tr key={idx}>
                      <td>{rec.vehicle}</td>
                      <td>{rec.desc}</td>
                      <td>
                        {new Date(rec.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                  {/* Show message if no records found */}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center" }}>
                        No matching records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
