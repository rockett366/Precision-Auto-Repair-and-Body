"use client";

import styles from "./page.module.css";
import Nav from "../constants/nav.js";
import { useState } from "react";

export default function TOS() {

	const [isChecked, setIsChecked] = useState(false);
	
	// When the checkbox is active, pressing the 'continue' button will call this function.
	function continueClicked() {
      console.log('Mm yes button');
    }

	const GoBack = () => {
		history.back()
	};

	const handleChange = (event) => {
		setIsChecked(event.target.checked);
	};
	return (
		<div className={styles.wholePage}>
			<Nav />
			<div className={styles.container}>
				<h1 className={styles.header}>
					<span className={styles.line}></span>
					Terms Of Service
					<span className={styles.line}></span>
				</h1>
				<div className={styles.TOSframe}>
				<embed className={styles.fill} type="text/html" src="tos.html"></embed>
				</div>
				
				<table className={styles.table}>
					<tbody>
						<tr>
							<th className={styles.buttontable}>
								<button onClick={GoBack} className={styles.button}>
								Go Back
								</button>
							</th>
							<th className={styles.texttable}>
								<span className={styles.agreetext}>I have read and agree to the Terms of Service</span>
							</th>
							<th>
								<input type="checkbox" className={styles.checkbox}
								checked={isChecked}
								onChange={handleChange} />
							</th>
							<th className={styles.buttontable}>
								<button disabled={!isChecked} onClick={continueClicked} className={styles.button}>
								Continue
								</button>
							</th>
						</tr>
					</tbody>
				</table>
				
			</div>
		</div>
	);
}
