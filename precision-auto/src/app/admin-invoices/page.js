"use client";

import { useState } from "react";

import Nav from "../constants/nav";
import Sidebar from "@/app/constants/admin-sidebar";
import SidebarStyles from "@/app/constants/admin-sidebar.module.css";

// Reuse the Records CSS (same look/feel)
import styles from "../admin-records/page.module.css";

import useInvoicesHistory from "./hooks/useInvoicesHistory";

export default function AdminInvoices() {
  // Upload modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formFile, setFormFile] = useState(null);

  // Search (by name)
  const [searchQuery, setSearchQuery] = useState("");

  // UI-only filter controls (can be wired to backend later)
  const [rangePreset, setRangePreset] = useState("all"); // 'all' | '7d' | '30d' | 'year' | 'custom'
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // (Optional) sort UI (not wired to backend)
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Data (currently only using searchQuery; filters/sort can be added later)
  const { invoices, isLoading, isError, error, refetch } = useInvoicesHistory(searchQuery);

  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    setModalVisible(false);
    setFormName("");
    setFormDescription("");
    setFormDate("");
    setFormFile(null);
  };
  const handleFileSelect = (e) => setFormFile(e.target.files[0]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // TODO: implement real upload to backend
    closeModal();
    // await refetch();
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className={SidebarStyles.container}>
      <Nav />
      <Sidebar />

      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.landing}>
            <h1>Review Invoices</h1>
            <p>Manage and review customer repair invoices.</p>

            {/* Controls */}
            <div className={styles.controlsContainer}>
              {/* Search */}
              <input
                type="text"
                placeholder="Search by customer name"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Upload */}
              <button className={styles.uploadBtn} onClick={openModal}>
                Upload
              </button>

              {/* Sort */}
              <select
                className={styles.sortDropdown}
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                title="Sort By"
              >
                <option value="">Sort By</option>
                <option value="name">Name</option>
                <option value="date">Date</option>
                <option value="description">Description</option>
              </select>
              <button
                type="button"
                className={styles.sortOrderBtn}
                onClick={toggleSortOrder}
                title={sortOrder === "asc" ? "Ascending" : "Descending"}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>

              {/* Date Range Filter (UI-only) */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Date Range:</label>
                <select
                  className={styles.filterSelect}
                  value={rangePreset}
                  onChange={(e) => setRangePreset(e.target.value)}
                >
                  <option value="all">All time</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="year">This year</option>
                  <option value="custom">Custom…</option>
                </select>

                {rangePreset === "custom" && (
                  <>
                    <input
                      type="date"
                      className={styles.filterDate}
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                    <span className={styles.filterDash}>—</span>
                    <input
                      type="date"
                      className={styles.filterDate}
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Loading / Error */}
            {isLoading && <p>Loading…</p>}

            {isError && (
              <div className={styles.tableContainer}>
                <div className={styles.tableEmpty}>
                  Could not load invoices.
                  <br />
                  <small style={{ opacity: 0.7 }}>{String(error?.message || "")}</small>
                  <div style={{ marginTop: 8 }}>
                    <button className={styles.uploadBtn} onClick={refetch}>
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            {!isLoading && !isError && (
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
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={4}>
                          {searchQuery
                            ? <>No matches for “{searchQuery}”.</>
                            : <>No records yet. Use Upload to add one.</>}
                        </td>
                      </tr>
                    ) : (
                      invoices.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.description}</td>
                          <td>{item.date}</td>
                          <td>
                            <button className={styles.reviewBtn}>View</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Upload Modal */}
            {modalVisible && (
              <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                  <h2>New Invoice</h2>
                  <form onSubmit={handleFormSubmit} className={styles.modalForm}>
                    <label>
                      Name:
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        required
                      />
                    </label>

                    <label>
                      Description:
                      <input
                        type="text"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        required
                      />
                    </label>

                    <label>
                      Date:
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        required
                      />
                    </label>

                    <label>
                      File:
                      <input type="file" onChange={handleFileSelect} />
                    </label>

                    <div className={styles.formButtons}>
                      <button type="submit">Add</button>
                      <button type="button" onClick={closeModal}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
