'use client';
import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../constants/nav.js";
import { useState } from 'react';
import Sidebar from "@/app/constants/admin-sidebar";
import SidebarStyles from "@/app/constants/admin-sidebar.module.css";

export default function AdminEstiamtes() {
  const [estimates, setEstimates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formFile, setFormFile] = useState(null);

  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    setModalVisible(false);
    setFormName('');
    setFormDescription('');
    setFormDate('');
    setFormFile(null);
  };
  const handleFileSelect = (e) => setFormFile(e.target.files[0]);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newEstimate = {
      name: formName,
      description: formDescription,
      date: formDate,
      file: formFile,
    };
    setEstimates([...estimates, newEstimate]);
    closeModal();
  };

  return (
    <div className={SidebarStyles.container}>
      <Nav />
      <Sidebar />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.landing}>
            <h1>Review Estiamtes</h1>
            <p>Manage and review customer repair estimates.</p>

            {/* Controls: Search Bar, Upload Button, and Sort Dropdown */}
            <div className={styles.controlsContainer}>
              <input
                type="text"
                placeholder="Search Item Name"
                className={styles.searchInput}
              />
              <button
                className={styles.uploadBtn}
                onClick={openModal}
              >
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
                  <h2>New Estimate</h2>
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
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        required
                      />
                    </label>
                    <div className={styles.formButtons}>
                      <button type="submit">Add</button>
                      <button type="button" onClick={closeModal}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

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
                  {estimates.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>{item.date}</td>
                      <td>
                        <a href="#" className={styles.reviewBtn}>View</a>
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
