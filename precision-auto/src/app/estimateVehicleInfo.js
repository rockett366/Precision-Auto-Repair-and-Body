"use client";
import React from "react";
import "./onlineEstimate.css";

export default function VehicleInfoPage() {
  return (
    <div className="pageContainer">
      {/* Header: top nav on first line, "Online estimate" on second line */}
      <header className="header">
        <nav className="topNav">
          <a href="#" className="navLink">About</a>
          <a href="#" className="navLink">Get Estimate</a>
          <a href="#" className="navLink">Sign-up</a>
        </nav>
        <h1 className="pageTitle">Online estimate</h1>
      </header>

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
              <select id="make">
                <option value="">Select</option>
                <option>Toyota</option>
                <option>Ford</option>
                <option>Honda</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="model">Model</label>
              <input id="model" placeholder="e.g. Camry" />
            </div>

            <div className="field">
              <label htmlFor="year">Year</label>
              <select id="year">
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
              <input id="vin" placeholder="Value" />
            </div>

            <div className="field">
              <label htmlFor="color">Color</label>
              <select id="color">
                <option value="">Select</option>
                <option>Red</option>
                <option>Black</option>
                <option>Silver</option>
              </select>
            </div>
          </div>

          {/* Bottom-right button */}
          <div className="buttonRow">
            <button
              type="button"
              className="nextButton"
              onClick={() => alert("Proceed to next step")}
            >
              Next →
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
