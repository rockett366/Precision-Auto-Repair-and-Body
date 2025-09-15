'use client';
import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../constants/nav.js";
import { useEffect, useState } from 'react';
import Sidebar from "@/app/constants/admin-sidebar";
import SidebarStyles from "@/app/constants/admin-sidebar.module.css";

export default function AdminRecords() {
  
  const [estimates, setEstimates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formFile, setFormFile] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const getComparator = (key, order = 'asc') => (a, b) => {
    if (!key) return 0;
    const av = (a?.[key] ?? '').toString();
    const bv = (b?.[key] ?? '').toString();
    let cmp = 0;
    if (key === 'date') {
      cmp = av.localeCompare(bv);
    } else {
      cmp = av.localeCompare(bv, undefined, { sensitivity: 'base' });
    }
    return order === 'desc' ? -cmp : cmp;
  };

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
    setEstimates((prev) => {
      const next = [...prev, newEstimate];
      return sortKey ? next.sort(getComparator(sortKey, sortOrder)) : next;
    });
    closeModal();
  };

  const openViewModal = (record) => {
    setSelectedRecord(record);
    if (record?.file) {
      const url = URL.createObjectURL(record.file);
      setFileUrl(url);
    } else {
      setFileUrl(null);
    }
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl(null);
    setSelectedRecord(null);
  };
  
  const handleSortChange = (e) => {
    const key = e.target.value;
    setSortKey(key);
    if (key) {
      setEstimates((prev) => [...prev].sort(getComparator(key, sortOrder)));
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => {
      const next = prev === 'asc' ? 'desc' : 'asc';
      if (sortKey) {
        setEstimates((list) => [...list].sort(getComparator(sortKey, next)));
      }
      return next;
    });
  };
  
  const filteredEstimates = searchQuery
    ? estimates.filter((item) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return (
          item.name?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.date?.toString().toLowerCase().includes(q)
        );
      })
    : estimates;
  
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className={styles.uploadBtn} onClick={openModal}>
                Upload
              </button>

              {/* Sort Dropdown */}
              <select className={styles.sortDropdown} value={sortKey} onChange={handleSortChange}>
                <option value="">Sort By</option>
                <option value="name">Name</option>
                <option value="date">Date</option>
                <option value="description">Description</option>
              </select>
              <button
                type="button"
                className={styles.sortOrderBtn}
                onClick={toggleSortOrder}
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
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
                  {estimates.length === 0 ? (
                    <tr>
                      <td colSpan="4">No records yet. Use Upload to add one.</td>
                    </tr>
                  ) : filteredEstimates.length === 0 ? (
                    <tr>
                      <td colSpan="4">No matching records.</td>
                    </tr>
                  ) : (
                    filteredEstimates.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.date}</td>
                        <td>
                          <button
                            className={styles.reviewBtn}
                            onClick={() => openViewModal(item)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {viewModalVisible && selectedRecord && (
              <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                  <h2>Record Details</h2>
                  <div style={{ textAlign: 'left', marginTop: 10 }}>
                    <p><strong>Name:</strong> {selectedRecord.name}</p>
                    <p><strong>Description:</strong> {selectedRecord.description}</p>
                    <p><strong>Date:</strong> {selectedRecord.date}</p>
                    <div style={{ marginTop: 15 }}>
                      <p style={{ marginBottom: 8 }}><strong>Attachment:</strong></p>
                      {selectedRecord.file ? (
                        selectedRecord.file.type?.startsWith('image/') ? (
                          <img
                            src={fileUrl}
                            alt="Attachment preview"
                            style={{ maxWidth: '100%', borderRadius: 6, border: '1px solid #eee' }}
                          />
                        ) : selectedRecord.file.type === 'application/pdf' ? (
                          <iframe
                            src={fileUrl}
                            title="PDF Preview"
                            style={{ width: '100%', height: 400, border: '1px solid #eee', borderRadius: 6 }}
                          />
                        ) : (
                          <a href={fileUrl} download={selectedRecord.file.name} className={styles.reviewBtn}>
                            Download {selectedRecord.file.name}
                          </a>
                        )
                      ) : (
                        <em>No file attached</em>
                      )}
                    </div>
                  </div>
                  <div className={styles.formButtons} style={{ marginTop: 16 }}>
                    <button type="button" onClick={closeViewModal}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
