"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import Nav from "../constants/nav";

export default function VehicleStatus() {
  const menu = [
    { key: "profile", label: "Profile", href: "/client-portal-profile" },
    {
      key: "vehicle",
      label: "View Vehicle Status",
      href: "/client-vehicle-status",
    },
    {
      key: "request",
      label: "Create New Service Request",
      href: "/select-service",
    },
    { key: "review", label: "Leave a Review", href: "/review" },
    { key: "records", label: "Past Records", href: "/client-past-records" },
    { key: "signout", label: "Sign Out", href: "/client-signout" },
  ];

  const pathname = usePathname();

  const stages = ["In Service", "Repairing", "Ready"];
  const [status, setStatus] = useState([]);
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get Vehicle Statuses from the Database
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        const res = await fetch(`${base}/api/vehicle-status/`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch records");
        const data = await res.json();

        setStatus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const vehicle = status[selectedVehicleIndex];

  return (
    <div className={styles.page}>
      <Nav />
      <div className={styles.container}>
        <h1 className={styles.title}>Your Service Dashboard</h1>

        <div className={styles.content}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <ul className={styles.menu}>
              {menu.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.key !== "profile" && pathname?.startsWith(item.href));
                return (
                  <li
                    key={item.key}
                    className={`${styles.menuItem} ${
                      isActive ? styles.active : ""
                    }`}
                  >
                    <Link href={item.href} className={styles.menuLink}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Main Panel */}
          <main className={styles.main}>
            <div className={`${styles.card} ${styles.statusCard}`}>
              <h2 className={styles.header}>Vehicle Status</h2>
              
              {/* Dropdown for vehicle selection */}
              {!loading && !error && status.length > 0 && (
                <div className={styles.dropdownWrapper}>
                  <label htmlFor="vehicleSelect" className={styles.label}>
                    Select Vehicle:
                  </label>
                  <select
                    id="vehicleSelect"
                    className={styles.dropdown}
                    value={selectedVehicleIndex}
                    onChange={(e) => setSelectedVehicleIndex(Number(e.target.value))}
                  >
                    {status.map((v, i) => (
                      <option key={i} value={i}>
                        {v.make} {v.model} ({v.year})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {loading ? (
                <p>Loading vehicle status...</p>
              ) : error ? (
                <p className={styles.alertError}>{error}</p>
              ) : vehicle ? (
                <div className={styles.detailsGrid}>
                  {/* Vehicle Info */}
                  <section className={styles.section}>
                    <p className={styles.label}>Vehicle Information</p>
                    <p>Make: {vehicle.make}</p>
                    <p>Model: {vehicle.model}</p>
                    <p>Year: {vehicle.year}</p>
                    <p>VIN: {vehicle.vin}</p>
                  </section>

                  {/* Design */}
                  <section className={styles.section}>
                    <p className={styles.label}>Design Consideration</p>
                    <p>Color: {vehicle.color}</p>
                    <p>Design: {vehicle.design}</p>
                  </section>

                  {/* Additional Details */}
                  <section className={styles.section}>
                    <p className={styles.label}>Additional Details</p>
                    <p>{vehicle.additional_details}</p>
                  </section>

                  {/* Status Overview */}
                  <section className={styles.section}>
                    <p className={styles.label}>Status Overview</p>
                    <div className={styles.statusOverview}>
                      {stages.map((stage, index) => (
                        <div key={index} className={styles.stageWrapper}>
                          <div className={styles.stage}>
                            <span
                              className={`${styles.circle} ${
                                vehicle.status >= index + 1
                                  ? styles.activeCircle
                                  : ""
                              }`}
                            ></span>
                            <p>{stage}</p>
                          </div>
                          {index < stages.length - 1 && (
                            <div className={styles.line}></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              ) : (
                <p>No vehicle data found.</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
