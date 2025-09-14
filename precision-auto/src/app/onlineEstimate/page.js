//scrum 51
"use client";

import { React, useState } from "react";
import "./onlineEstimate.css";
import Nav from "../constants/nav.js";
import Footer from "../constants/footer";
import { useRouter } from "next/navigation";

export default function OnlineEstimate() {
  const router = useRouter();

  //user input from form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleClick = () => {
    //Missing field check
    if (!firstName || !lastName || !email || !phoneNumber) {
      setPopupMessage("Please fill in all fields.");
      setShowPopup(true);
      return;
    }

    //Checking if phone number is 10 digits after removing nondigit char
    const phoneNums = phoneNumber.replace(/\D/g, "");
    if (phoneNums.length != 10) {
      setPopupMessage("Please enter a valid phone number.");
      setShowPopup(true);
      return;
    }

    //Checking if the email is valid
    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailCheck.test(email)) {
      setPopupMessage("Please enter a valid email.");
      setShowPopup(true);
      return;
    }

    //Passes the validation-> next page
    router.push("/onlineEstimate/vehicle");
  };

  return (
    <div className="pageContainer">
      <Nav />
      {/* Steps (progress indicator) */}
      <div className="steps">
        <div className="step">
          <div className="circle">1</div>
          <span>Your Info</span>
        </div>
        <div className="step">
          <div className="circle">2</div>
          <span>Vehicle Info</span>
        </div>
        <div className="step">
          <div className="circle">3</div>
          <span>Vehicle Damage</span>
        </div>
        <div className="step">
          <div className="circle">4</div>
          <span>Done</span>
        </div>
      </div>

      {/* Main section */}
      <main className="mainSection">
        <div className="questionSection">
          {/* Red, centered heading */}
          <h2 className="redHeading">
            Who are we speaking to and how should we follow up?
          </h2>

          {/* Center-aligned paragraph */}
          <p className="center-text">
            We know getting your car repaired can be a big decision, and we want
            to equip you with the information you need. Please tell us who you
            are and how we can best reach you—but don’t worry, your data is safe
            with us and we won’t send you anything unsolicited without your
            consent.
          </p>

          {/* Form */}
          <form className="form">
            <div className="formRow">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="formRow">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="formRow">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="formRow">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                placeholder="(012)345-6789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            {/* Next button (no real submission, just an alert) */}
            <button type="button" className="nextButton" onClick={handleClick}>
              Next →
            </button>
          </form>
        </div>
      </main>
      {showPopup && (
        <div className="popupOverlay" onClick={() => setShowPopup(false)}>
          <div className="popupBox" onClick={(e) => e.stopPropagation()}>
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
