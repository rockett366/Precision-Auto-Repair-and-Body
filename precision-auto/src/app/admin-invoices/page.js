"use client";

import Nav from "../constants/nav";
import Sidebar from "@/app/constants/admin-sidebar";
import SidebarStyles from "@/app/constants/admin-sidebar.module.css";
import styles from "../admin-records/page.module.css";

import { useEffect, useState } from "react";
import useInvoicesHistory from "./hooks/useInvoicesHistory";

export default function AdminInvoices() {
  const [modalVisible, setModalVisible] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formFile, setFormFile] = useState(null);

  // search + debounce (so we don't spam the API)
  const [searchQuery, setSearchQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchQuery.trim()), 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // sort
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const toggleSortOrder = () => setSortOrder((p) => (p === "asc" ? "desc" : "asc"));

  // fetch (now backend-driven)
  const { invoices, isLoading, isError, error, refetch } =
    useInvoicesHistory(debounced, sortKey, sortOrder);

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
    // TODO: real upload
    closeModal();
    // await refetch();
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

            <div className={styles.controlsContainer}>
              <input
                type="text"
                placeholder="Search by customer name"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <button className={styles.uploadBtn} onClick={openModal}>Upload</button>

              <select
                className={styles.sortDropdown}
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
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
            </div>

            {isLoading && <p>Loading…</p>}

            {isError && (
              <div className={styles.tableContainer}>
                <div className={styles.tableEmpty}>
                  Could not load invoices. <button onClick={refetch}>Retry</button>
                  <pre style={{ whiteSpace: "pre-wrap" }}>{error?.message}</pre>
                </div>
              </div>
            )}

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
                          {debounced
                            ? <>No matches for “{debounced}”.</>
                            : <>No records yet. Use Upload to add one.</>}
                        </td>
                      </tr>
                    ) : (
                      invoices.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.description}</td>
                          <td>{item.date}</td>
                          <td><button className={styles.reviewBtn}>View</button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* your upload modal JSX stays the same */}
          </div>
        </main>
      </div>
    </div>
  );
}