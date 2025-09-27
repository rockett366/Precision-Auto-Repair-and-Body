"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Nav from "../constants/nav.js";
import Sidebar from "@/app/constants/admin-sidebar";
import SidebarStyles from "@/app/constants/admin-sidebar.module.css";

export default function AdminInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState([]);

  // Function to handle input changes
  const handleChange = (index, field, value) => {
    setInventory((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Function to toggle edit mode
  const toggleEdit = (index) => {
    setInventory((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  // Function to save changes
  const saveChanges = (index) => {
    setInventory((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isEditing: false } : item
      )
    );
  };

  async function handleSearch() {
    try {
      const res = await fetch(
        `http://localhost:8000/api/inventory/search?name=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error(err);
      setInventory([]);
    }
  }

  return (
    <div>
      <Nav />
      <div className={SidebarStyles.container}>
        <Sidebar />
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Inventory Section */}
          <div className={styles.inventoryContainer}>
            <h1 className={styles.title}>Inventory</h1>

            <div className={styles.controlsContainer}>
              <input
                type="text"
                placeholder="Search Item Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button className={styles.searchBarButton} onClick={handleSearch}>
                Search
              </button>
              <button className={styles.searchBarButton}>+</button>
              <button className={styles.searchBarButton}>Filter</button>
            </div>

            {/* Scrollable Inventory Table */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ITEM NAME</th>
                    <th>DESCRIPTION</th>
                    <th>Inventory</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {item.isEditing ? (
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleChange(index, "name", e.target.value)
                            }
                            className={styles.editInput}
                          />
                        ) : (
                          item.name
                        )}
                      </td>
                      <td>
                        {item.isEditing ? (
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              handleChange(index, "description", e.target.value)
                            }
                            className={styles.editInput}
                          />
                        ) : (
                          item.description
                        )}
                      </td>
                      <td>
                        {item.isEditing ? (
                          <input
                            type="number"
                            value={item.count}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "count",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className={styles.editInput}
                          />
                        ) : (
                          item.quantity
                        )}
                      </td>
                      <td className={styles.inventoryActions}>
                        {item.isEditing ? (
                          <>
                            <button
                              className={styles.saveButton}
                              onClick={() => saveChanges(index)}
                            >
                              Save
                            </button>
                            <button
                              className={styles.cancelButton}
                              onClick={() => toggleEdit(index)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={styles.actionButton}
                              onClick={() => toggleEdit(index)}
                            >
                              Edit
                            </button>
                            <button
                              className={styles.actionButton}
                              onClick={() =>
                                handleChange(
                                  index,
                                  "count",
                                  Math.max(item.count - 1, 0)
                                )
                              }
                            >
                              -
                            </button>
                            <button
                              className={styles.actionButton}
                              onClick={() =>
                                handleChange(
                                  index,
                                  "count",
                                  Math.min(item.count + 1, item.max)
                                )
                              }
                            >
                              +
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
