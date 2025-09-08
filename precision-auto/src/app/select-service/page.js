//SELECT SERVICE PAGE 
"use client";

import styles from "./page.module.css";
import Nav from "../constants/nav.js";
import { Inknut_Antiqua } from 'next/font/google';
import { useState, useEffect } from "react";

const inknut = Inknut_Antiqua({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

const currentYear = new Date().getFullYear();

//Visual & Descriptive list of services
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

  //VARIABLES FOR API AND BACKEND
  //USER FORM DATA
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [vehicleInfo, setVehicleInfo] = useState({ make: '', model: '', year: currentYear, vin: '' });
  const [selectedService, setSelectedService] = useState('');
  //VARIABLES GOOGLE CALENDAR API INTEGRATION
  const [selectedDate, setSelectedDate] = useState((getTodayDate()));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  //CONFIRMATION PAGE
  const [showReview, setShowReview] = useState(false);

  //GOOGLE CALENDAR UI & FORMATING METHODS
  useEffect(() => {
    if (!selectedDate) return;
    const day = new Date(selectedDate).getDay();
    const weekdaySlots = ["08:30", "09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30"];
    const weekendSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
    setAvailableSlots(day === 0 || day === 6 ? weekendSlots : weekdaySlots);

    // Make sure your /api/calendar/booked endpoint returns booked slots
    fetch(`/api/calendar/booked?date=${selectedDate}`)
      .then(res => res.json())
      .then(data => setBookedSlots(data.booked || []))
      .catch(() => setBookedSlots([]));
  }, [selectedDate]);
  
  // RETURN today's date
  function getTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Format buttons to show 12-hour time
  function format12Hour(time24) {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }

  // Handle the confirmation of the appointment

  async function handleConfirm() {
    const name = `${userInfo.firstName} ${userInfo.lastName}`;
    const body = {
      name,
      email: userInfo.email,
      date: selectedDate,
      time: selectedSlot,
      service: selectedService,
      vehicle: vehicleInfo,
    };
  
    try {
      const res = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      const data = await res.json();
      if (data.success) {
        alert('Appointment confirmed!');
        setShowReview(false);
      } else {
        alert('Failed to confirm appointment.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while booking.');
    }
  }

  return (

    //PAGE FORMATTING
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
            <div className={styles.inputWrapper}><label className={styles.label}>First Name</label><input type="text" placeholder="Enter your first name" className={styles.inputField}
              value={userInfo.firstName} 
              onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}/></div>
            <div className={styles.inputWrapper}><label className={styles.label}>Last Name</label><input type="text" placeholder="Enter your last name" className={styles.inputField} 
              value={userInfo.lastName}
              onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}/></div>
            <div className={styles.inputWrapper}><label className={styles.label}>Email</label><input type="email" placeholder="Enter your email" className={styles.inputField} 
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}/></div>
            <div className={styles.inputWrapper}><label className={styles.label}>Phone Number</label><input type="tel" placeholder="Enter your phone number" className={styles.inputField} 
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}/></div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className={styles.sectionContainer}>
          <h2 className={`${styles.subTitle} ${inknut.className}`}>Vehicle Information</h2>
          <div className={styles.subTitleLine} />
          <div className={styles.formContainer}>

            {/* Vehicle Make with Datalist for common makes */}
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Make</label>
              <input
                type="text"
                list="car-makes"
                className={styles.inputField}
                value={vehicleInfo.make}
                onChange={(e) => setVehicleInfo({ ...vehicleInfo, make: e.target.value })}  />
            </div>
            {/* Datalist for common car makes */}
            <datalist id="car-makes">
              <option value="Acura" />
              <option value="Alfa Romeo" />
              <option value="Audi" />
              <option value="BMW" />
              <option value="Buick" />
              <option value="Cadillac" />
              <option value="Chevrolet" />
              <option value="Chrysler" />
              <option value="Citroën" />
              <option value="Dodge" />
              <option value="Ferrari" />
              <option value="Fiat" />
              <option value="Ford" />
              <option value="Genesis" />
              <option value="GMC" />
              <option value="Honda" />
              <option value="Hyundai" />
              <option value="Infiniti" />
              <option value="Jaguar" />
              <option value="Jeep" />
              <option value="Kia" />
              <option value="Lamborghini" />
              <option value="Land Rover" />
              <option value="Lexus" />
              <option value="Lincoln" />
              <option value="Maserati" />
              <option value="Mazda" />
              <option value="McLaren" />
              <option value="Mercedes-Benz" />
              <option value="Mini" />
              <option value="Mitsubishi" />
              <option value="Nissan" />
              <option value="Peugeot" />
              <option value="Porsche" />
              <option value="Ram" />
              <option value="Renault" />
              <option value="Rolls-Royce" />
              <option value="Saab" />
              <option value="Subaru" />
              <option value="Suzuki" />
              <option value="Tesla" />
              <option value="Toyota" />
              <option value="Volkswagen" />
              <option value="Volvo" />
            </datalist>

            {/* Vehicle Model */}
            <div className={styles.inputWrapper}><label className={styles.label}>Model</label><input type="text" placeholder="Enter vehicle model" className={styles.inputField} 
              value={vehicleInfo.model}
              onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })}/></div>

            {/* Drop Down For Vehicle Year */}
            <div className={styles.inputWrapper}>
              <label className={styles.label}>Year</label>
              <input
                type="number"
                placeholder="Enter vehicle year"
                className={styles.inputField}
                value={vehicleInfo.year}
                min="1900"
                max={currentYear + 1}  // allow next-year models
                step="1"
                onChange={(e) =>
                  setVehicleInfo({
                    ...vehicleInfo,
                    year: e.target.value === '' ? '' : Math.max(1900, Math.min(currentYear + 1, parseInt(e.target.value, 10)))
                  })
                }  />
            </div>
            {/* Vehicle VIN */}
            <div className={styles.inputWrapper}><label className={styles.label}>VIN</label><input type="text" placeholder="Enter vehicle VIN" className={styles.inputField} 
             value={vehicleInfo.vin}
             onChange={(e) => setVehicleInfo({ ...vehicleInfo, vin: e.target.value })}/></div>
          </div>
        </div>

        {/* Popular Services Section */}
        
        <h1 className={`${styles.subTitle} ${inknut.className}`} style={{ marginTop: '10px', marginBottom: '10px', fontSize: '36px' }} >Popular Services</h1>
        <div className={styles.mainTitleLine} />
        <div className={styles.popularServicesGrid}>
          
          {/* Column 1 */}
          <div className={styles.column} style={{ marginTop: '30px' }} > 
            {servicesColumn1.map((service, index) => (
              <div key={index} className={styles.popularServiceBox}>
                <img src={`/images/service-icons/${service.image}`} alt={service.title} className={styles.popularServiceImage} />
                <div className={styles.popularServiceDetails}>
                  <div className={styles.serviceTitle}>{service.title}</div>
                  <p className={styles.popularServiceDescription}>{service.desc}</p>
                </div>
                <input type="checkbox" className={styles.popularServiceCheckbox} 
                checked={selectedService === service.title}
                onChange={() => setSelectedService(service.title)}
                />
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className={styles.column} style={{ marginTop: '30px' }}>
            {servicesColumn2.map((service, index) => (
              <div key={index} className={styles.popularServiceBox}>
                <img src={`/images/service-icons/${service.image}`} alt={service.title} className={styles.popularServiceImage} />
                <div className={styles.popularServiceDetails}>
                  <div className={styles.serviceTitle}>{service.title}</div>
                  <p className={styles.popularServiceDescription}>{service.desc}</p>
                </div>
                <input type="checkbox" className={styles.popularServiceCheckbox} 
                checked={selectedService === service.title}
                onChange={() => setSelectedService(service.title)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Booking Section */}
        <hr className={styles.mainTitleLine} style={{ marginTop: '30px' }}/>
        <h2 className={`${styles.subTitle} ${inknut.className}`}>Book an Appointment</h2>
        <div className={styles.sectionContainer}>
          <label className={styles.label}>Select a Date</label>
          <input type="date" className={styles.inputField} 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
          min={getTodayDate()}/>
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {availableSlots.map((slot, index) => (
              <button
              key={index}
              onClick={() => setSelectedSlot(slot)}
              disabled={bookedSlots.includes(slot)}
              onMouseEnter={(e) => {
                if (!bookedSlots.includes(slot) && selectedSlot !== slot) {
                  e.target.style.backgroundColor = '#b52a38';
                }
              }}
              onMouseLeave={(e) => {
                if (!bookedSlots.includes(slot)) {
                  e.target.style.backgroundColor = selectedSlot === slot ? '#7a1120' : '#931621';
                }
              }}
              style={{
                width: '120px',
                height: '48px',
                margin: '5px',
                backgroundColor: bookedSlots.includes(slot)
                  ? '#ccc'
                  : selectedSlot === slot
                  ? '#7a1120'
                  : '#931621',
                border: selectedSlot === slot ? '1px solid black' : 'none',
                color: 'white',
                borderRadius: '4px',
                cursor: bookedSlots.includes(slot) ? 'not-allowed' : 'pointer',
                transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
                boxShadow: selectedSlot === slot ? '0 0 0 2px black' : 'none',
              }}
            >
              {format12Hour(slot)}
            </button>
            ))}
          </div>
        </div>

        {/* Embedded Google Calendar */}
        <div className={styles.sectionContainer} style={{ marginTop: '-30px' }}>
          <h2 className={`${styles.subTitle} ${inknut.className}`}>Currently Booked Calendar</h2>
          <iframe
            src="https://calendar.google.com/calendar/embed?src=223a18315a9653a0813a56da51a2d30bfdab0f4876ca369ba62ad9b88c3820a0@group.calendar.google.com&ctz=America%2FLos_Angeles&mode=WEEK"
            style={{ border: 0, width: '100%', height: '600px' }}
            frameBorder="0"
            scrolling="no"
            title="Google Calendar"
          ></iframe>
        </div>

        {/* Bottom Next Step Button */}
        <div style={{ marginTop: '-20px', textAlign: 'center' }}>
          <button
            onClick={() => setShowReview(true)}
            style={{
              padding: '24px 128px',
              backgroundColor: '#931621', // default deep red
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '40px',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#b52a38'; // brighter red on hover
              e.target.style.boxShadow = '0 0 12px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#931621'; // revert
              e.target.style.boxShadow = 'none';
            }}
          >
            Next Step
          </button>
        </div>

        {/* Confirmation Modal */}
        {showReview && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              padding: '30px',
              width: '90%',
              maxWidth: '600px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            }}>
              <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Review Your Appointment</h2>
              <p><strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Phone:</strong> {userInfo.phone}</p>
              <p><strong>Vehicle:</strong> {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} (VIN: {vehicleInfo.vin})</p>
              <p><strong>Selected Service:</strong> {selectedService || "None"}</p>
              <p><strong>Appointment Date:</strong> {selectedDate || "Not selected"}</p>
              <p><strong>Appointment Time:</strong> {selectedSlot ? format12Hour(selectedSlot) : "Not selected"}</p>

              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                  onClick={handleConfirm}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#931621',
                    color: 'white',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '6px',
                    marginRight: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Confirm Appointment
                </button>
                <button
                  onClick={() => setShowReview(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#ccc',
                    color: '#333',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

  );
}