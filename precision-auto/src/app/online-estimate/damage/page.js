//scrum 51
"use client";
import { useState } from "react";
import React from "react";
import "../onlineEstimate.css";
import Nav from "../../constants/nav.js";
import Footer from "../../constants/footer";
import { useRouter } from "next/navigation";

// --- Hardcode backend endpoint here ---
const S3_BACKEND_URL = "http://localhost:8000/api/s3/online-estimates-put";

// Define API base URL and user ID (in real app, get from auth context)
const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const api = (path) => `${base}/api${path}`;

//helper methods for the page
//uploadImageViaApiPut will get the url needed to upload to the s3 bucket than PUT to the s3 bucket
async function uploadImageViaApiPut(file, label, first_name, last_name, vin) {
  if (!file) throw new Error("No file provided");

  const form = new FormData();
  form.append("file", file); // UploadFile in backend
  form.append("label", label); //label: front,rear,left,right,damage1,damage2,damage3
  form.append("full_name", `${first_name}_${last_name}`);
  form.append("vin", vin);

  let res;
  try {
    res = await fetch(`${S3_BACKEND_URL}`, {
      headers: { Accept: "multipart/form-data" },
      method: "PUT",
      body: form,
    });
  } catch {
    console.log("err");
  }
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`API upload failed: ${msg}`);
  }
  // Return { key, public_url, uploaded: true } might need for future sprints
  console.log("successful image upload");
  return await res.json();
}

export default function VehicleInfoPage() {
  const router = useRouter();

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

  //loading symbol for submitting
  const [isLoading, setIsLoading] = useState(false);

  // When clicked, the 'Next' button calls this function.
  const handleSubmit = async () => {
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

    //save the description
    sessionStorage.setItem("description", description);

    // Grab all the previously saved session data
    const first_name = sessionStorage.getItem("firstName");
    const last_name = sessionStorage.getItem("lastName");
    const email = sessionStorage.getItem("email");
    const phone = sessionStorage.getItem("phoneNumber");
    const make = sessionStorage.getItem("make");
    const model = sessionStorage.getItem("model");
    const year = parseInt(sessionStorage.getItem("year"), 10);
    const vin = sessionStorage.getItem("vin");
    const color = sessionStorage.getItem("color");
    const descriptionFromSession = sessionStorage.getItem("description");

    // Build the payload for the database
    const payload = {
      first_name,
      last_name,
      email,
      phone,
      make,
      model,
      year,
      vin,
      color,
      description: descriptionFromSession,
    };

    //save to the database
    try {
      setIsLoading(true);
      const res = await fetch(api(`/online-estimates/create/`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
    } catch (err) {
      console.error(err);
      alert("Failed to submit estimate.");
      setIsLoading(false);

      return;
    }

    //save the images into s3 bucket
    try {
      //set loading true
      setIsLoading(true);

      const files = [file1, file2, file3, file4, file5, file6, file7];
      const label = [
        "front_right",
        "front_left",
        "rear_left",
        "rear_right",
        "damage1",
        "damage2",
        "damage3",
      ];
      const queue = [...files];
      const results = [];
      let q_len = queue.length;

      //upload all images
      for (let i = 0; i < 7; i++) {
        const f = queue.shift();
        const { key, public_url, uploaded } = await uploadImageViaApiPut(
          f,
          label[i],
          first_name,
          last_name,
          vin
        );
        results.push({ key, public_url, uploaded });
        console.log(results);
        q_len -= 1;
      }
      //stop loading symbol
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setPopupMessage(err?.message ?? "Upload failed.");
      setShowPopup(true);
      return;
    }
    router.push("/online-estimate/confirmation");
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
            Upload a four photos of your car, one of each corner of the car:
          </strong>
        </p>

        {/* Form */}
        <form className="form">
          {/* Row 1: Four courners of the car */}
          <div className="formRow">
            <div className="field">
              <label htmlFor="photo1">Front Left (Driver Front)</label>
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
              <label htmlFor="photo2">Front Right (Passenger Front)</label>
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
              <label htmlFor="photo3">Rear Left (Driver Rear)</label>
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
              <label htmlFor="photo4">Rear Right (Passenger Rear)</label>
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
              <label htmlFor="photo5">Damage 1</label>
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
              <label htmlFor="photo6">Damage 2</label>
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
              <label htmlFor="photo7">Damage 3</label>
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
          {/* Comfirm upload --loading symbol*/}
          <div>
            {isLoading ? (
              <div className="loader-container">
                <div className="loader"></div>
                <p>Uploading Form</p>
              </div>
            ) : (
              <button className="nextButton" onClick={handleSubmit}>
                Complete
              </button>
            )}
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
