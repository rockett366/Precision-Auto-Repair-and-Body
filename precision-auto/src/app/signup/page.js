"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Nav from "../constants/nav";
import api from "../../lib/api"; // API connection



export default function Home() {
  // Router Init
  const router = useRouter();

  const initialValues = { firstname: "", lastname: "", email: "", password: "", confirm_password: "", phone_number: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [backendError, setBackendError] = useState("");   // Backend error handling 
  const [isSubmit, setIsSubmit] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Password validation helpers
  const isValidLength = formValues.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(formValues.password);
  const hasLowerCase = /[a-z]/.test(formValues.password);
  const hasNumber = /[0-9]/.test(formValues.password);
  const hasSpecialChar = /[\W_]/.test(formValues.password);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues)
    setFormErrors(errors);
    setIsSubmit(true);
    setBackendError("");

    if (Object.keys(errors).length === 0) {
      try {
        console.log("Submitting form data:", {
          email: formValues.email,
          password: formValues.password,
          firstname: formValues.firstname,
          lastname: formValues.lastname,
          phone_number: formValues.phone_number
        });
        
        // Use the custom registration endpoint
        const response = await api.post('/auth/custom-register', {
          email: formValues.email,
          password: formValues.password,
          firstname: formValues.firstname,
          lastname: formValues.lastname,
          phone_number: formValues.phone_number
        });

        console.log("Registration response:", response);

        if (response.status === 201 || response.status === 200) {
          setShowPopup(false);
          router.push("/login");
        }
      } catch (error) {
        console.error("Registration error:", error);
        let errorMessage = "Registration failed. Please try again.";
        
        if (error.response) {
          console.log("Error response:", error.response);
          
          // Handle validation errors
          if (error.response.data?.detail) {
            if (typeof error.response.data.detail === 'object') {
              // Format validation errors
              errorMessage = Object.values(error.response.data.detail)
                .map(err => typeof err === 'string' ? err : JSON.stringify(err))
                .join(', ');
            } else {
              errorMessage = error.response.data.detail;
            }
          } else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          }
        }
        
        setBackendError(errorMessage);
      }
    }
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format

    if (!values.firstname) errors.firstname = "First Name is required!";
    if (!values.lastname) errors.lastname = "Last Name is required!";

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email format!";
    }

    if (!values.password) {
      errors.password = "Password is required!";
    } else {
      if (values.password.length < 8) errors.password = "Minimum 8 characters!";
      if (!hasUpperCase) errors.password = "Need at least one uppercase letter!";
      if (!hasLowerCase) errors.password = "Need at least one lowercase letter!";
      if (!hasNumber) errors.password = "Need at least one number!";
      if (!hasSpecialChar) errors.password = "Need at least one special character!";
    }

    if (!values.confirm_password) {
      errors.confirm_password = "Confirm Password is required!";
    } else if (values.password !== values.confirm_password) {
      errors.confirm_password = "Passwords don't match!";
    }

    if (!values.phone_number) {
      errors.phone_number = "Phone Number is required!";
    } else if (!phoneRegex.test(values.phone_number)) {
      errors.phone_number = "Invalid phone number format!";
    }

    return errors;
  };

  return (
    <div>
      <Nav />
      <div className={styles.signupPage}>
        <form id="form" className={styles.leftContainer} onSubmit={handleSubmit}>
          {backendError && <div className={styles.backendError}>{backendError}</div>}
          <div className={styles.container}>
            <h1 className={styles.header1}>Create your Account</h1>
            <h4 className={styles.header2}>to continue your experience</h4>
            <div className={styles.formContainer}>
              <div className={styles.inputWrapper}>
                <div>
                  <label htmlFor="firstname">
                    <b>First Name</b>
                  </label>
                  <input
                    className={styles.inputBox}
                    id="firstname"
                    type="text"
                    name="firstname"
                    placeholder="Enter First Name"
                    value={formValues.firstname}
                    onChange={handleChange}
                  ></input>
                  <p className={styles.errors}>{formErrors.firstname}</p>
                </div>
              </div>

              <div className={styles.inputWrapper}>
                <div>
                  <label htmlFor="lastname">
                    <b>Last Name</b>
                  </label>
                  <input
                    className={styles.inputBox}
                    id="lastname"
                    type="text"
                    name="lastname"
                    placeholder="Enter Last Name"
                    value={formValues.lastname}
                    onChange={handleChange}
                  ></input>
                  <p className={styles.errors}>{formErrors.lastname}</p>
                </div>
              </div>
            </div>

            <div className={styles.emailContainer}>
              <label htmlFor="email">
                <b>Email</b>
              </label>
              <input
                className={styles.inputBox}
                id="email"
                type="text"
                placeholder="Enter Email"
                name="email"
                autoComplete="on"
                value={formValues.email}
                onChange={handleChange}
              ></input>
              <p className={styles.errors}>{formErrors.email}</p>
            </div>

            <div className={styles.formContainer}>
              <div className={styles.inputWrapper}>
                <div>
                  <label htmlFor="password">
                    <b>Password</b>
                  </label>
                  <input
                    className={styles.inputBox}
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formValues.password}
                    onChange={handleChange}
                    onFocus={() => setShowPopup(true)}
                    onBlur={() => setShowPopup(false)}
                  ></input>

                  {showPopup && (
                    <div className={styles.passwordPopup}>
                      <p>Password must contain:</p>
                      <ul>
                        <li style={{ color: isValidLength ? "green" : "red" }}>At least 8 characters</li>
                        <li style={{ color: hasUpperCase ? "green" : "red" }}>One uppercase letter</li>
                        <li style={{ color: hasNumber ? "green" : "red" }}>One number</li>
                        <li style={{ color: hasSpecialChar ? "green" : "red" }}>One special character</li>

                      </ul>
                    </div>
                  )}


                  <p className={styles.errors}>{formErrors.password}</p>
                </div>
              </div>

              <div className={styles.inputWrapper}>
                <div>
                  <label htmlFor="confirm_password">
                    <b>Confirm Password</b>
                  </label>
                  <input
                    className={styles.inputBox}
                    id="confirm_password"
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formValues.confirm_password}
                    onChange={handleChange}
                  ></input>
                  <p className={styles.errors}>{formErrors.confirm_password}</p>
                </div>
              </div>
            </div>

            <div className={styles.phoneContainer}>
              <label htmlFor="phone_number">
                <b>Phone Number</b>
              </label>
              <input
                className={styles.inputBox}
                id="phone_number"
                type="tel"
                name="phone_number"
                placeholder="Enter Phone Number"
                value={formValues.phone_number}
                onChange={handleChange}
              ></input>
              <p className={styles.errors}>{formErrors.phone_number}</p>
            </div>
            <div className={styles.buttonContainer}>
              <button
                className={styles.button + " " + styles.signup_button}
                type="submit"
              >
                Sign Up
              </button>
              <button className={styles.button + " " + styles.google_button}>
                Sign in with Google
                <img
                  src="/images/signup/google-logo.jpg"
                  alt="google logo"
                  className={styles.google_logo}
                ></img>
              </button>
              <div className={styles.loginContainer}>
                <p>Have an account already?</p>
                <a href="../">
                  <p className={styles.login}>Log in</p>
                </a>
              </div>
            </div>
          </div>
        </form>
        <div className={styles.rightContainer}>
          <img
            src="/images/signup/b&w_logo.jpg"
            alt="logo pic"
            className={styles.logo}
          ></img>
          <p className={styles.description}>
            Subscribe to our membership and have instant access to exclusive
            rewards, and savings!
          </p>
        </div>
      </div>
    </div>
  );
}
