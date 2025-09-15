//scrum 51
"use client";
import { useState } from "react";
import React from "react";
import "../onlineEstimate.css";
import Nav from "../../constants/nav.js";
import Footer from "../../constants/footer";

export default function VehicleInfoPage() {
  // Information from the page
  const [file1, setFile1] = useState(null);
  const [preview1, setPreview1] = useState(null);

  const [file2, setFile2] = useState(null);
  const [preview2, setPreview2] = useState(null);

  const [file3, setFile3] = useState(null);
  const [preview3, setPreview3] = useState(null);

  const [file4, setFile4] = useState(null);
  const [preview4, setPreview4] = useState(null);

  const [file5, setFile5] = useState(null);
  const [preview5, setPreview5] = useState(null);

  const [file6, setFile6] = useState(null);
  const [preview6, setPreview6] = useState(null);

  const [file7, setFile7] = useState(null);
  const [preview7, setPreview7] = useState(null);

  const [description, setDescription] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // When clicked, the 'Next' button calls this function.
  const handleSubmit = () => {
    if (
      !file1 ||
      !file2 ||
      !file3 ||
      !file4 ||
      !file5 ||
      !file6 ||
      !file7 ||
      !description
    ) {
      setPopupMessage("Please fill in all fields.");
      setShowPopup(true);
      return;
    }
    if (description.length > 150) {
      setPopupMessage("Description is to long.");
      setShowPopup(true);
      return;
    }

    setPopupMessage("Proceed to next step!");
    setShowPopup(true);
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
          Step 2/2: Tell us about your vehicle damage
        </h2>
        <p className="subText centerText">
          <strong>
            Upload a four photos of your car, one of eacch corner of the car:
          </strong>
        </p>

        {/* Form */}
        <form className="form">
          {/* Row 1: Four courners of the car */}
          <div className="formRow">
            <div className="field">
              <label htmlFor="photo1">Image 1</label>
              <input
                id="photo1"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files[0]; // get the actual file
                  if (!selected) return;
                  setFile1(selected); // store file in state 7
                  setPreview1(URL.createObjectURL(selected));
                }}
              />
              {preview1 && (
                <div>
                  <p>Preview:</p>
                  <img src={preview1} alt="Preview" className="w-h" />
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="photo2">Image 2</label>
              <input
                id="photo2"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files[0]; // get the actual file
                  if (!selected) return;
                  setFile2(selected); // store file in state 7
                  setPreview2(URL.createObjectURL(selected));
                }}
              />
              {preview2 && (
                <div>
                  <p>Preview:</p>
                  <img src={preview2} alt="Preview" className="w-h" />
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="photo3">Image 3</label>
              <input
                id="photo3"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files[0]; // get the actual file
                  if (!selected) return;
                  setFile3(selected); // store file in state 3
                  setPreview3(URL.createObjectURL(selected));
                }}
              />
              {preview3 && (
                <div>
                  <p>Preview:</p>
                  <img src={preview3} alt="Preview" className="w-h" />
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="photo4">Image 4</label>
              <input
                id="photo4"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files[0]; // get the actual file
                  if (!selected) return;
                  setFile4(selected); // store file in state 4
                  setPreview4(URL.createObjectURL(selected));
                }}
              />
              {preview4 && (
                <div>
                  <p>Preview:</p>
                  <img src={preview4} alt="Preview" className="w-h" />
                </div>
              )}
            </div>
          </div>

          {/* Row 2: four images of the damage */}
          <br></br>
          <p className="subText centerText">
            <strong>Upload three images of the damaged area</strong>
          </p>
          <div className="formRow">
            <div className="field">
              <label htmlFor="photo5">Image 5</label>
              <input
                id="photo5"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files[0]; // get the actual file
                  if (!selected) return;
                  setFile5(selected); // store file in state 7
                  setPreview5(URL.createObjectURL(selected));
                }}
              />
              {preview5 && (
                <div>
                  <p>Preview:</p>
                  <img src={preview5} alt="Preview" className="w-h" />
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="photo6">Image 6</label>
              <input
                id="photo6"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files[0]; // get the actual file
                  if (!selected) return;
                  setFile6(selected); // store file in state 6
                  setPreview6(URL.createObjectURL(selected));
                }}
              />
              {preview6 && (
                <div>
                  <p>Preview:</p>
                  <img src={preview6} alt="Preview" className="w-h" />
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="photo7">Image 7</label>
              <input
                id="photo7"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files[0]; // get the actual file
                  if (!selected) return;
                  setFile7(selected); // store file in state 7
                  setPreview7(URL.createObjectURL(selected));
                }}
              />
              {preview7 && (
                <div>
                  <p>Preview:</p>
                  <img src={preview7} alt="Preview" className="w-h" />
                </div>
              )}
            </div>
          </div>
          {/* Row 3: description of the damage */}
          <br></br>
          <div className="formRow">
            <div className="field">
              <label htmlFor="description">
                Leave a brief description of the damage:
              </label>
              <textarea
                id="description"
                placeholder="Max 150 characters"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
