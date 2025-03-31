import styles from "./page.module.css";
import Nav from "../constants/nav.js";
import { Inknut_Antiqua } from 'next/font/google';

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
              <input type="text" placeholder="Enter your first name" className={styles.inputField} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Last Name</label>
              <input type="text" placeholder="Enter your last name" className={styles.inputField} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Email</label>
              <input type="email" placeholder="Enter your email" className={styles.inputField} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Phone Number</label>
              <input type="tel" placeholder="Enter your phone number" className={styles.inputField} />
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
              <input type="text" placeholder="Enter vehicle make" className={styles.inputField} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Model</label>
              <input type="text" placeholder="Enter vehicle model" className={styles.inputField} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Year</label>
              <input type="number" placeholder="Enter vehicle year" className={styles.inputField} />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>VIN</label>
              <input type="text" placeholder="Enter vehicle VIN" className={styles.inputField} />
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
                <input type="checkbox" className={styles.popularServiceCheckbox} />
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
                <input type="checkbox" className={styles.popularServiceCheckbox} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}