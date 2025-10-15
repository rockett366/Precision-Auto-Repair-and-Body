"use client";
import styles from "../page.module.css";

export default function InvoicesTable({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span>Name</span>
          <span>DESCRIPTION</span>
          <span>Date</span>
          <span />
        </div>
        <div className={styles.emptyState}>
          No records yet. Use Upload to add one.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <span>Name</span>
        <span>DESCRIPTION</span>
        <span>Date</span>
        <span />
      </div>

      <ul className={styles.rows}>
        {items.map((e) => (
          <li key={e.id} className={styles.rowPill}>
            <div className={styles.cellName} title={e.name}>{e.name}</div>
            <div className={styles.cellDesc} title={e.description}>{e.description}</div>
            <div className={styles.cellDate}>{e.date}</div>
            <div className={styles.cellAction}>
              <a className={styles.viewBtn} href="#">View</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}