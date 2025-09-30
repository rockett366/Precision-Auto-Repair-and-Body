"use client";

import styles from "./page.module.css";
import Nav from "../constants/nav.js";
import { useState } from "react";
import useInvoicesHistory from "./hooks/useInvoicesHistory";
import PlaceholderJSON from "./components/placeholderJSON";
import InvoicesTable from "./components/invoicesTable";

export default function AdminInvoices() {
  const [modalVisible, setModalVisible] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formFile, setFormFile] = useState(null);

  const { invoices, isLoading, isError, error, refetch } = useInvoicesHistory();

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
    // TODO: implement real upload
    closeModal();
    // await refetch();
  };

  return (
    <div>
      <Nav />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.landing}>
            <h1>Review Invoices</h1>
            <p>Manage and review customer repair invoices.</p>

            {/* Controls: Search Bar, Upload Button, and Sort Dropdown */}
            <div className={styles.controlsContainer}>
              <input
                type="text"
                placeholder="Search Item Name"
                className={styles.searchInput}
              />
              <button className={styles.uploadBtn} onClick={openModal}>
                Upload
              </button>

              {/* Sort Dropdown */}
              <select className={styles.sortDropdown}>
                <option value="">Sort By</option>
                <option value="name">Name</option>
                <option value="date">Date</option>
                <option value="description">Description</option>
              </select>
            </div>

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

            {/* Loading state */}
            {isLoading && <p>Loading invoices…</p>}

            {/* Error state (show message + placeholder data ONLY on error) */}
            {isError && (
              <div className={styles.errorBox}>
                <p>Could not load invoices.</p>
                <pre className={styles.errorPre}>{error?.message}</pre>
                <button onClick={refetch} className={styles.retryBtn}>
                  Retry
                </button>

                {/* Placeholder JSON renders ONLY on error */}
                <PlaceholderJSON
                  data={[
                    {
                      id: 0,
                      name: "Example Invoice",
                      description: "Placeholder item (shown on error)",
                      date: "2025-09-01",
                    },
                  ]}
                />
              </div>
            )}

            {/* Success state: render ONLY real backend data */}
            {!isLoading && !isError && (
              <div className={styles.tableContainer}>
                <InvoicesTable items={invoices} />
                {(!invoices || invoices.length === 0) && (
                  <p style={{ textAlign: "center", marginTop: 12 }}>
                    No invoices found.
                  </p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}