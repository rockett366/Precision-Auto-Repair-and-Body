import styles from './page.module.css';

export default function ScheduleServicePage() {
  return (
    <div className={styles.container}>
      {/* Title */}
      <h1 className={styles.title}>Schedule a Service</h1>

      {/* Form Container */}
      <div className={styles.formContainer}>
        {/* First Name */}
        <div className={styles.inputWrapper}>
          <label className={styles.label}>First Name</label>
          <input
            type="text"
            placeholder="Enter your first name"
            className={styles.inputField}
          />
        </div>

        {/* Last Name */}
        <div className={styles.inputWrapper}>
          <label className={styles.label}>Last Name</label>
          <input
            type="text"
            placeholder="Enter your last name"
            className={styles.inputField}
          />
        </div>

        {/* Email */}
        <div className={styles.inputWrapper}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className={styles.inputField}
          />
        </div>

        {/* Phone Number */}
        <div className={styles.inputWrapper}>
          <label className={styles.label}>Phone Number</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            className={styles.inputField}
          />
        </div>
      </div>

      {/* Vehicle Information Section */}
      <h2 className={styles.sectionTitle}>Vehicle Information</h2> {/* Title added */}
      <div className={styles.formContainer}>
        {/* Make */}
        <div className={styles.inputWrapper}>
          <label className={styles.label}>Make</label>
          <input
            type="text"
            placeholder="Enter vehicle make"
            className={styles.inputField}
          />
        </div>

        {/* Model */}
        <div className={styles.inputWrapper}>
          <label className={styles.label}>Model</label>
          <input
            type="text"
            placeholder="Enter vehicle model"
            className={styles.inputField}
          />
        </div>

        {/* Year */}
        <div className={styles.inputWrapper}>
          <label className={styles.label}>Year</label>
          <input
            type="number"
            placeholder="Enter vehicle year"
            className={styles.inputField}
          />
        </div>

        {/* VIN */}
        <div className={styles.inputWrapper}>
          <label className={styles.label}>VIN</label>
          <input
            type="text"
            placeholder="Enter vehicle VIN"
            className={styles.inputField}
          />
        </div>
      </div>

      {/* Popular Services Section */}
      <div className={styles.popularServicesContainer}>
        {/* Title - Only the red large one */}
        <h2 className={styles.popularServicesTitle}>Popular Services</h2>

        {/* Vehicle Inspection */}
        <div className={styles.popularServiceBox}>
          <img
            src="https://via.placeholder.com/100"
            className={styles.popularServiceImage}
          />
          <div className={styles.popularServiceDetails}>
            <div className={styles.popularServiceTitle}>Vehicle Inspection</div>
            <p className={styles.popularServiceDescription}>
              Maintainance, Safety, Compliance
            </p>
          </div>
          <input type="checkbox" className={styles.popularServiceCheckbox} />
        </div>

        {/* Oil Change */}
        <div className={styles.popularServiceBox}>
          <img
            src="https://via.placeholder.com/100"
            className={styles.popularServiceImage}
          />
          <div className={styles.popularServiceDetails}>
            <div className={styles.popularServiceTitle}>Oil Change</div>
            <p className={styles.popularServiceDescription}>
              Oil Change, Filter, Lube
            </p>
          </div>
          <input type="checkbox" className={styles.popularServiceCheckbox} />
        </div>

        {/* Brakes */}
        <div className={styles.popularServiceBox}>
          <img
            src="https://via.placeholder.com/100"
            className={styles.popularServiceImage}
          />
          <div className={styles.popularServiceDetails}>
            <div className={styles.popularServiceTitle}>Brakes</div>
            <p className={styles.popularServiceDescription}>
              Maintainance, Safety, Compliance
            </p>
          </div>
          <input type="checkbox" className={styles.popularServiceCheckbox} />
        </div>

        {/* Collision Inspection */}
        <div className={styles.popularServiceBox}>
          <img
            src="https://via.placeholder.com/100"
            className={styles.popularServiceImage}
          />
          <div className={styles.popularServiceDetails}>
            <div className={styles.popularServiceTitle}>Collision Inspection</div>
            <p className={styles.popularServiceDescription}>
              Damage Assessment, Repair Quote
            </p>
          </div>
          <input type="checkbox" className={styles.popularServiceCheckbox} />
        </div>

        {/* Tires */}
        <div className={styles.popularServiceBox}>
          <img
            src="https://via.placeholder.com/100"
            className={styles.popularServiceImage}
          />
          <div className={styles.popularServiceDetails}>
            <div className={styles.popularServiceTitle}>Tires</div>
            <p className={styles.popularServiceDescription}>
              Replacement, Rotation, Alignment
            </p>
          </div>
          <input type="checkbox" className={styles.popularServiceCheckbox} />
        </div>

        {/* Heat or A/C */}
        <div className={styles.popularServiceBox}>
          <img
            src="https://via.placeholder.com/100"
            className={styles.popularServiceImage}
          />
          <div className={styles.popularServiceDetails}>
            <div className={styles.popularServiceTitle}>Heat or A/C</div>
            <p className={styles.popularServiceDescription}>
              Climate Control & Related Issues
            </p>
          </div>
          <input type="checkbox" className={styles.popularServiceCheckbox} />
        </div>

        {/* Battery */}
        <div className={styles.popularServiceBox}>
          <img
            src="https://via.placeholder.com/100"
            className={styles.popularServiceImage}
          />
          <div className={styles.popularServiceDetails}>
            <div className={styles.popularServiceTitle}>Battery</div>
            <p className={styles.popularServiceDescription}>
              Battery Replacement, Testing, Starter
            </p>
          </div>
          <input type="checkbox" className={styles.popularServiceCheckbox} />
        </div>

        {/* Other (Dropdown) */}
        <div className={styles.popularServiceBox}>
          <img
            src="https://via.placeholder.com/100"
            className={styles.popularServiceImage}
          />
          <div className={styles.popularServiceDetails}>
            <div className={styles.popularServiceTitle}>Other</div>
            <p className={styles.popularServiceDescription}>
              Add a custom service request if you need something special.
            </p>
          </div>
          <input type="checkbox" className={styles.popularServiceCheckbox} />
          <select className={styles.popularServiceSelect}>
            <option value="other">Enter custom service...</option>
            <option value="custom-service">Custom Service</option>
          </select>
        </div>
      </div>
    </div>
  );
}