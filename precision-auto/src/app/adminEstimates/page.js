// src/app/adminEstiamtes/page.js
import Image from "next/image";
import styles from "./page.module.css";

export default function AdminEstiamtes() {
  return (
    <div className={styles.page}>
        <main className={styles.main}>
            <div className={styles.landing}>
                <h1>Review Estiamtes</h1>
                <p>Manage and review customer repair estimates.</p>

            {/* Search Bar & Filter */}
            <div className={styles.searchContainer}>
                <input
                type="text"
                placeholder="Search Item Name"
                className={styles.searchInput}
                />
                <button className={styles.filterBtn}>Filter</button>
            </div>

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
                    {[...Array(10)].map((_, index) => (
                    <tr key={index}>
                        <td>NAME</td>
                        <td>DESCRIPTION</td>
                        <td>01 / 01 / 1001</td>
                        <td>
                        <a href="#" className={styles.reviewBtn}>
                            Review
                        </a>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
        </main>
    </div>
  );
}