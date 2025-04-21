"use client"
import styles from "./page.module.css";
import Nav from "../constants/nav.js";
import { Inknut_Antiqua } from 'next/font/google';
import { useState } from "react";

const inknut = Inknut_Antiqua({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

export default function ScheduleServicePage() {
  const servicesColumn1 = [
    {
      title: "Vehicle Inspection",
      desc: "Maintenance, Safety, Compliance",
      image: "vehicle-inspection.png",
    },
    {
      title: "Oil Change",
      desc: "Oil Change, Filter, Lube",
      image: "oil-change.png",
    },
    {
      title: "Brakes",
      desc: "Maintenance, Safety, Compliance",
      image: "brakes.png",
    },
    {
      title: "Collision Inspection",
      desc: "Damage Assessment, Repair Quote",
      image: "collision-inspection.png",
    },
  ];

  const servicesColumn2 = [
    {
      title: "Tires",
      desc: "Replacement, Rotation, Alignment",
      image: "tires.png",
    },
    {
      title: "Heat or A/C",
      desc: "Climate Control & Related Issues",
      image: "heat-ac.png",
    },
    {
      title: "Battery",
      desc: "Replacement, Testing, Starting",
      image: "battery.png",
    },
    {
      title: "Other",
      desc: "A custom service request.",
      image: "other.png",
    },
  ];
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  
  const [vehicleInspection, setVehicleInspection] = useState(false);
  const [oilChange, setOilChange] = useState(false);
  const [brakes, setBrakes] = useState(false);
  const [collisionInspection, setCollisionInspection] = useState(false);
  const [tires, setTires] = useState(false);
  const [heatAc, setHeatAc] = useState(false);
  const [battery, setBattery] = useState(false);
  const [other, setOther] = useState(false);
  
const handleCheckboxChange = (serviceName) => {
  switch (serviceName) {
    case "Vehicle Inspection":
      setVehicleInspection(!vehicleInspection);
      break;
    case "Oil Change":
      setOilChange(!oilChange);
      break;
    case "Brakes":
      setBrakes(!brakes);
      break;
    case "Collision Inspection":
      setCollisionInspection(!collisionInspection);
      break;
    case "Tires":
      setTires(!tires);
      break;
    case "Heat or A/C":
      setHeatAc(!heatAc);
      break;
    case "Battery":
      setBattery(!battery);
      break;
    case "Other":
      setOther(!other);
      break;
    default:
      break;
  }
};
  
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

// When clicked, the 'submit' button calls this function.
const handleSubmit = () => {
	
  if (!firstName || !lastName || !email || !phone || !make || !model || !year || !vin) {
	setPopupMessage("Please fill out all fields.");
	setShowPopup(true);
    return;
  }
	
  if (!(vehicleInspection || oilChange || brakes || collisionInspection || tires || heatAc || battery || other)) {
	setPopupMessage("Please select at least one service.");
	setShowPopup(true);
    return;
  }
	
	// Submit information to the database
	
	// After all checks, can then proceed to whatever step is next.
  setPopupMessage("The request has been received.");
  setShowPopup(true);
};

  return (
    <div>
      <Nav />
      <div className={styles.container}>
        {/* Main Page Title */}
        <h1 className={`${styles.mainTitle} ${inknut.className}`}>Schedule a Service</h1>
        <div className={styles.mainTitleLine} />

        {/* User Information */}
        <div className={styles.sectionContainer}>
          <h2 className={`${styles.subTitle} ${inknut.className}`}>Your Information</h2>
          <div className={styles.subTitleLine} />
          <div className={styles.formContainer}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>First Name</label>
              <input type="text" placeholder="Enter your first name" className={styles.inputField} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Last Name</label>
              <input type="text" placeholder="Enter your last name" className={styles.inputField} value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Email</label>
              <input type="email" placeholder="Enter your email" className={styles.inputField} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Phone Number</label>
              <input type="tel" placeholder="Enter your phone number" className={styles.inputField} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className={styles.sectionContainer}>
          <h2 className={`${styles.subTitle} ${inknut.className}`}>Vehicle Information</h2>
          <div className={styles.subTitleLine} />
          <div className={styles.formContainer}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Make</label>
              <input type="text" placeholder="Enter vehicle make" className={styles.inputField} value={make} onChange={(e) => setMake(e.target.value)} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Model</label>
              <input type="text" placeholder="Enter vehicle model" className={styles.inputField} value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Year</label>
              <input type="number" placeholder="Enter vehicle year" className={styles.inputField} value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>VIN</label>
              <input type="text" placeholder="Enter vehicle VIN" className={styles.inputField} value={vin} onChange={(e) => setVin(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Popular Services Section */}
        <h1 className={`${styles.subTitle} ${inknut.className}`}>Popular Services</h1>
        <div className={styles.mainTitleLine} />
        <div className={styles.popularServicesGrid}>
          {/* Column 1 */}
          <div className={styles.column}>
            {servicesColumn1.map((service, index) => (
              <div key={index} className={styles.popularServiceBox}>
                <img
                  src={`/images/service-icons/${service.image}`}
                  alt={service.title}
                  className={styles.popularServiceImage}
                />
                <div className={styles.popularServiceDetails}>
                  <div className={styles.serviceTitle}>{service.title}</div>
                  <p className={styles.popularServiceDescription}>{service.desc}</p>
                </div>
				  <input
					type="checkbox"
					checked={
					  service.title === "Vehicle Inspection" ? vehicleInspection :
					  service.title === "Oil Change" ? oilChange :
					  service.title === "Brakes" ? brakes :
					  service.title === "Collision Inspection" ? collisionInspection : false
					}
					onChange={() => handleCheckboxChange(service.title)} // Simplify this line
					className={styles.popularServiceCheckbox}
				  />
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className={styles.column}>
            {servicesColumn2.map((service, index) => (
              <div key={index} className={styles.popularServiceBox}>
                <img
                  src={`/images/service-icons/${service.image}`}
                  alt={service.title}
                  className={styles.popularServiceImage}
                />
                <div className={styles.popularServiceDetails}>
                  <div className={styles.serviceTitle}>{service.title}</div>
                  <p className={styles.popularServiceDescription}>{service.desc}</p>
                </div>
				  <input
					type="checkbox"
					checked={
					  service.title === "Tires" ? tires :
					  service.title === "Heat or A/C" ? heatAc :
					  service.title === "Battery" ? battery :
					  service.title === "Other" ? other : false
					}
					onChange={() => handleCheckboxChange(service.title)} // Simplify this line
					className={styles.popularServiceCheckbox}
				  />
              </div>
            ))}
          </div>
        </div>
		
		{/* Submission button */}
			<div className={styles.mainTitleLine} />
			
			<button className={styles.button + " " + styles.signup_button}
            onClick={handleSubmit}>
			Submit
			</button>
      </div>
{showPopup && (
  <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
    <div className={styles.popupBox}>
      <p>{popupMessage}</p>
      <button onClick={() => setShowPopup(false)}>Close</button>
    </div>
  </div>
)}
    </div>
  );
}