// src/app/about/page.js
import styles from './page.module.css'; // Import the CSS module

export default function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>
        OUR FACILITY
        <span className={styles.line}></span>
      </h1>

      <div className={styles.photoGrid}>
        <div className={styles.photoContainer}>
          <img 
            src="/images/about/placeholderimagecar.jpg"  
            alt="Facility 1" 
            className={styles.photo} 
          />
        </div>
        <div className={styles.photoContainer}>
          <img 
            src="/images/about/placeholderimagecar.jpg"  
            alt="Facility 2" 
            className={styles.photo} 
          />
        </div>
        <div className={styles.photoContainer}>
          <img 
            src="/images/about/placeholderimagecar.jpg"  
            alt="Facility 3" 
            className={styles.photo} 
          />
        </div>

        {/* Row 2 */}
        <div className={styles.photoContainer}>
          <img 
            src="/images/about/placeholderimagecar.jpg"  
            alt="Facility 4" 
            className={styles.photo} 
          />
        </div>
        <div className={styles.photoContainer}>
          <img 
            src="/images/about/placeholderimagecar.jpg" 
            alt="Facility 5" 
            className={styles.photo} 
          />
        </div>
        <div className={styles.photoContainer}>
          <img 
            src="/images/about/placeholderimagecar.jpg"  
            alt="Facility 6" 
            className={styles.photo} 
          />
        </div>
      </div>
    </div>
  );
}
