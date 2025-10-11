"use client";
import React from "react";
import "../onlineEstimate.css";
import Nav from "../../constants/nav.js";
import Footer from "../../constants/footer";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VehicleInfoPage() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(true);

  // When clicked, the 'Home' button calls this function.
  const handleSubmit = () => {
    router.push("/");
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
        {showPopup && (
          <div className="popupOverlay" onClick={() => setShowPopup(false)}>
            <div className="popupBox" onClick={(e) => e.stopPropagation()}>
              <p>Submission Successfully Sent!</p>
              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}
        <div>
          {/* Red, centered subheading */}
          <h2 className="redHeading centerText">
            Your Estimate Form is Complete!
          </h2>
          <p className="subText centerText">
            The form has been submitted to our team, we will reach out to you
            with your estimate via email or phone!
            <br></br>
            <button type="button" className="nextButton" onClick={handleSubmit}>
              Home
            </button>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
