//scrum 51
"use client";

import React from "react";
import "./onlineEstimate.css";
import Nav from "../constants/nav.js";
import Footer from "../constants/footer";
import { useRouter } from "next/navigation";

export default function OnlineEstimate() {
  const router = useRouter();

  const handleClick = () => {
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
              <input id="firstName" name="firstName" placeholder="Value" />
            </div>

            <div className="formRow">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" name="lastName" placeholder="Value" />
            </div>

            <div className="formRow">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" placeholder="Value" />
            </div>

            <div className="formRow">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" placeholder="Value" />
            </div>

            {/* Next button (no real submission, just an alert) */}
            <button type="button" className="nextButton" onClick={handleClick}>
              Next →
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
