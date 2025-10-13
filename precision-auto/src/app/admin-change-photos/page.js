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

async function handleFileChange(e, imageName) {
  const file = e.target.files[0];
  if (!file) return;

  try {
	console.log("file handler!");
    // Ask your backend for a presigned S3 URL
    const res = await fetch('/api/s3url?filename=' + encodeURIComponent(imageName), {
      method: 'GET',
    });
    const { url } = await res.json();

    // Upload the file directly to S3
    const uploadRes = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!uploadRes.ok) throw new Error('Upload failed');

    alert(`Uploaded ${imageName} successfully!`);
  } catch (err) {
    console.error(err);
    alert('Error uploading image.');
  }
}

// constructs the insides of each table
function GetTable(PageIndex) {
const table = [];
	for (let i = 1; i < pageImages[PageIndex].length; i++){
		const imageName = pageImages[PageIndex][i];
		table[table.length+1]=(
	  <tr className={styles.tableRow} key={imageName}>
		<td className={styles.tableCell}>
		  <img className={styles.tableImg} src={"images/"+pageImages[PageIndex][i]+".jpg"} alt={imageName}/>
		</td>
		<td className={styles.tableCell}>
		  <input
			type="file"
			accept="image/*"
			id={"file-${imageName}"}
			style={{ display: 'none' }}
			onChange={(e) => handleFileChange(e, imageName)}
		  />
		  <button
			onClick={() => document.getElementById("file-${imageName}").click()}
		  >
			Upload
		  </button>
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
