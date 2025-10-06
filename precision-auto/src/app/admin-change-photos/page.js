'use client';
import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../constants/nav.js";
import { useEffect, useState } from 'react';
import Sidebar from "@/app/constants/admin-sidebar";
import SidebarStyles from "@/app/constants/admin-sidebar.module.css";

export default function AdminRecords() {

// An array of arrays containing information for each image the admins should be able to change
// pageImages[i] is an array of strings, starting with the title of the title (preferably being the title of the page the images are on)
const pageImages = [
["Landing Page","mechanic-stock1","mechanic-stock2","mechanic-stock3","mechanic-stock4"],
["PageName2","Example2"]
];

// constructs the insides of each table
function GetTable(PageIndex) {
const table = [];
	for (let i = 1; i < pageImages[PageIndex].length; i++){
		table[table.length+1]=(
		<tr className={styles.tableRow}>
			<td className={styles.tableCell}>
			<img className={styles.tableImg} src={"images/"+pageImages[PageIndex][i]+".jpg"}></img>
			</td>
			<td className={styles.tableCell}>
			Placeholder for: Name, Description, Date, Upload button
			</td>
		</tr>
		)
	}
	return(table);
}

// constructs the table of images
function GetImageTable(){
	const table = [];
	for (let i = 0; i < pageImages.length; i++){
		table[table.length+1]=(<p className={styles.tableP} key={i}>{pageImages[i][0]}</p>)
		table[table.length+1]=(<table className={styles.imgTable}>{GetTable(i)}</table>)
	}
	return (table);
}

return (
  <div className={SidebarStyles.container}>
    <Nav />
    <Sidebar />
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.landing}>
        <h1>Change Photos</h1>
        <p>View and manage photos displayed on various pages.</p>
		
			<GetImageTable />

        </div>
      </main>
    </div>
  </div>
);
}
