//scrum 51
"use client";
import { useState } from "react";
import React from "react";
import "../onlineEstimate.css";
import Nav from "../../constants/nav.js";
import Footer from "../../constants/footer";
import { useRouter } from "next/navigation";

export default function VehicleInfoPage() {
  const router = useRouter();

  // Information from the page
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [color, setColor] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  // When clicked, the 'Next' button calls this function.
  const handleSubmit = () => {
    if (!make || !model || !year || !vin || !color) {
      setPopupMessage("Please fill in all fields.");
      setShowPopup(true);
      return;
    }

    // Additional data checking would be here but
    // The two text fields that can be inputted into can't really have any?
    // Why are there only three colors of car that exist? Only three makes?

    // Probably need another story to touch this page up.

    // And then whatever the 'next step' is can be implemented here.
    router.push("/onlineEstimate/damage");
  };
  return (
    <div className="pageContainer">
      <Nav />

      {/* 4-step progress bar (all circles #ddd, with lines between) */}
      <div className="steps">
        <div className="step">
          <div className="circle">1</div>
          <span>Your info</span>
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

      {/* Main content */}
      <main className="mainSection">
        {/* Red, centered subheading */}
        <h2 className="redHeading centerText">
          Step 1/2: Tell us about your vehicle
        </h2>
        <p className="subText centerText">
          Please enter your vehicle’s make, model, year, and color or VIN
        </p>

        {/* Form */}
        <form className="form">
          {/* Row 1: Make / Model / Year */}
          <div className="formRow">
            <div className="field">
              <label htmlFor="make">Make</label>
              <select
                id="make"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              >
                <option value="">Select</option>
                <option>Toyota</option>
                <option>Ford</option>
                <option>Honda</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="model">Model</label>
              <input
                id="model"
                placeholder="e.g. Camry"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="year">Year</label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">Select</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
              </select>
            </div>
          </div>

          {/* Row 2: VIN / Color */}
          <div className="formRow">
            <div className="field">
              <label htmlFor="vin">VIN</label>
              <input
                id="vin"
                placeholder="Value"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="color">Color</label>
              <select
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="">Select</option>
                <option>Red</option>
                <option>Black</option>
                <option>Silver</option>
              </select>
            </div>
          </div>

          {/* Bottom-right button */}
          <div className="buttonRow">
            <button type="button" className="nextButton" onClick={handleSubmit}>
              Next →
            </button>
          </div>
        </form>
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
} //complete
