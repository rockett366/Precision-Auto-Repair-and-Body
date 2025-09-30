"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../constants/nav";

export default function VehicleStatus() {
  const stages = ["In Service", "Repairing", "Ready"];
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        {
          /* Option 1
            For testing on other computers
        */}

        
        const res = await fetch("api/vehicle-status-seed", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch records from mock API");
        const data = await res.json();

        

        {
          /* Option 2
          For testing on local db

        const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        const res = await fetch(`${base}/api/vehicle-status/`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch records");
        const data = await res.json();
        */}

        setStatus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const vehicle = status[0] // In the future, add a dropdown menu so user can pick which car to see vehicle status of

  return (
    <div>
      <Nav />
      <div className={styles.profilePage}>
        <div className={styles.leftContainer}>
          <div>
            <a href="./client-portal-profile" className={styles.activeTab}>
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
            <a href="./client-vehicle-status" className={styles.inactiveTab}>
              Past Records
            </a>
          </div>
          <div>
            <a href="../" className={styles.inactiveTab}>
              Sign-Out
            </a>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <p className={styles.header}>Your Service Dashboard</p>
          <div className={styles.bigContainer}>
            <div className={styles.topContainer}>
              <div className={styles.topLeftContainer}>
                <p className={styles.profileHeader}>Vehicle Status</p>
              </div>
            </div>

            {loading ? (
              <p>Loading status...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : vehicle ? (
              <div className={styles.smallContainer}>
                <div className={styles.inputWrapper}>
                  <p>Status Overview:</p>
                  <div className={styles.statusOverview}>
                    {stages.map((stage, index) => (
                      <div key={index} className={styles.stageWrapper}>
                        <div className={styles.inputWrapper2}>
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
                          <p className={styles.line}></p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.inputWrapper}>
                  <p>Vehicle Info:</p>
                  <p className={styles.info}>Make: {vehicle.make}</p>
                  <p className={styles.info}>Model: {vehicle.model}</p>
                  <p className={styles.info}>Year: {vehicle.year}</p>
                  <p className={styles.info}>VIN: {vehicle.vin}</p>
                </div>

                <div className={styles.inputWrapper}>
                  <p>Design Consideration:</p>
                  <p className={styles.info}>Color: {vehicle.color}</p>
                  <p className={styles.info}>Design: {vehicle.design}</p>
                </div>

                <div className={styles.inputWrapper}>
                  <p>Additional Details:</p>
                  <p className={styles.info}>{vehicle.additional_details}</p>
                </div>
                </div>
                ) : (
                  <p>No vehicle found.</p>
                  )}
          </div>
        </div>
      </div>
    </div>
  );
}
