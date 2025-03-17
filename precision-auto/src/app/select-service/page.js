import styles from './page.module.css';

export default function ScheduleServicePage() {
  return (
    <div className={styles.container}>
      {/* Title for the first form */}
      <h1 className={styles.title}>Schedule a Service</h1>

      {/* Form Container for scheduling a service */}
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

      {/* New Section for "Select a Vehicle to Service" */}
      <div className={styles.formSection}>
        {/* Title for the second form */}
        <h1 className={styles.title}>Select a Vehicle to Service</h1>

        {/* Form Container for vehicle selection */}
        <div className={styles.formContainer}>
          {/* Vehicle Make */}
          <div className={styles.inputWrapper}>
            <label className={styles.label}>Make</label>
            <input
              type="text"
              placeholder="Enter the vehicle make"
              className={styles.inputField}
            />
          </div>

          {/* Vehicle Model */}
          <div className={styles.inputWrapper}>
            <label className={styles.label}>Model</label>
            <input
              type="text"
              placeholder="Enter the vehicle model"
              className={styles.inputField}
            />
          </div>

          {/* Vehicle Year */}
          <div className={styles.inputWrapper}>
            <label className={styles.label}>Year</label>
            <input
              type="text"
              placeholder="Enter the vehicle year"
              className={styles.inputField}
            />
          </div>

          {/* Vehicle VIN */}
          <div className={styles.inputWrapper}>
            <label className={styles.label}>VIN</label>
            <input
              type="text"
              placeholder="Enter the vehicle VIN"
              className={styles.inputField}
            />
          </div>
        </div>
      </div>
    </div>
  );
}