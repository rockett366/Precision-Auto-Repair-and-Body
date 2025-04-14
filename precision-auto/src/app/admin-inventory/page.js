"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Nav from "../constants/nav.js";

export default function AdminInventory() {
  // Sample Inventory Data
  const [inventory, setInventory] = useState(
    Array.from({ length: 10 }).map(() => ({
      name: "ITEM NAME",
      description: "DESCRIPTION",
      count: 1,
      max: 100,
      isEditing: false, // Tracks if the item is being edited
    }))
  );

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

  return (
    <div>
      <Nav />
      <div className={styles.layoutContainer}>
  
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <h1 className={styles.adminTitle}>Admin</h1>
          <ul className={styles.adminList}>
            <li className={styles.adminItem}><a href="/admin-profile">Profile</a></li>
            <li className={styles.adminCurSelect}><a href="/admin-inventory">Inventory</a></li>
            <li className={styles.adminItem}><a href="/admin-appointments">Appointments</a></li>
            <li className={styles.adminItem}><a href="/adminEstimates">Review Estimates</a></li>
            <li className={styles.adminItem}><a href="/admin-pastRecords">Past Records</a></li>
            <li className={styles.adminItem}><a href="/admin-changePhotos">Change Photos</a></li>
            <li className={styles.adminItem}><a href="/admin-customerVehicles">Customer Vehicles</a></li>
          </ul>
        </div>
  
        {/* Inventory Section */}
        <div className={styles.inventoryContainer}>
          <h1 className={styles.title}>Inventory</h1>
  
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search Item Name"
              className={styles.searchInput}
            />
            <button className={styles.searchBarButton}>+</button>
            <button className={styles.searchBarButton}>Filter</button>
          </div>
  
          {/* Scrollable Inventory Table */}
          <div className={styles.inventoryScrollContainer}>
            <table className={styles.inventoryTable}>
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
                        `${item.count} / ${item.max}`
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
  );
}
