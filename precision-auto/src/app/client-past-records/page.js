"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Nav from "../constants/nav";

export default function Home() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  {
    /* Get records from the database */
  }
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        {
          /* Option 1: */
        }
        {
          /* For testing on other computers */
        }
        const res = await fetch("/api/client_records_seed", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch records from mock API");
        const data = await res.json();

        {
          /* Option 2: */
        }
        {
          /* For testing on local 
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        const res = await fetch(`${base}/api/client-records/`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch records");
        const data = await res.json();
        */
        }

        setRecords(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  // Filter and sort records based on search and sort state
  let filteredRecords = records.filter(
    (rec) =>
      rec.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      rec.description.toLowerCase().includes(search.toLowerCase())
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
          {/* Show that the program is loading records */}
          {/* If it fails, show that it couldn't load records from db */}
          {loading ? (
            <p>Loading records...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
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
                        <td>{rec.description}</td>
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
          )}
        </div>
      </div>
    </div>
  );
}
