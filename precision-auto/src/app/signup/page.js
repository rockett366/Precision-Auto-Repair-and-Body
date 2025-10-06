"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import Nav from "../constants/nav";

// ---- One source of truth for the API base ----
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const api = (path) => `${BASE_URL}/api${path}`;

// Generic JSON fetch with good error messages
async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // ignore parse errors; we'll use status text
  }
  if (!res.ok) {
    const msg =
      (typeof data?.detail === "string" && data.detail) ||
      (Array.isArray(data?.detail) && data.detail[0]?.msg) ||
      `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export default function Home() {
  const router = useRouter();

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const isValidLength = formValues.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(formValues.password);
  const hasLowerCase = /[a-z]/.test(formValues.password);
  const hasNumber = /[0-9]/.test(formValues.password);
  const hasSpecialChar = /[\W_]/.test(formValues.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((v) => ({ ...v, [name]: value }));
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.firstname) errors.firstname = "First Name is required!";
    if (!values.lastname) errors.lastname = "Last Name is required!";
    if (!values.email) errors.email = "Email is required!";
    else if (!regex.test(values.email))
      errors.email = "This is not a valid email format!";
    if (!values.password) errors.password = "Password is required!";
    else if (values.password.length < 8)
      errors.password = "Password must be more than 8 characters!";
    if (!values.confirm_password)
      errors.confirm_password = "Confirm Password is required!";
    else if (values.password !== values.confirm_password)
      errors.confirm_password = "Passwords do not match!";
    if (!values.phone_number) errors.phone_number = "Phone Number is required!";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      // 1) SIGNUP
      await jsonFetch(api("/auth/signup"), {
        method: "POST",
        body: JSON.stringify({
          first_name: formValues.firstname,
          last_name: formValues.lastname,
          email: formValues.email,
          phone: formValues.phone_number,
          password: formValues.password,
          confirm_password: formValues.confirm_password,
        }),
      });

      // 2) LOGIN
      const login = await jsonFetch(api("/auth/login"), {
        method: "POST",
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
        }),
      });

      if (!login?.access_token) {
        throw new Error("No access token returned from login");
      }

      // 3) SAVE TOKEN + REDIRECT
      localStorage.setItem("token", login.access_token);
      router.push("/client-portal-profile");
    } catch (err) {
      setServerError(err?.message || "Network error");
      console.error("Auth error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Nav />

      <div className={styles.signupPage}>
        <form id="form" className={styles.leftContainer} onSubmit={handleSubmit}>
          <div className={styles.container}>
            <h1 className={styles.header1}>Create your Account</h1>
            <h4 className={styles.header2}>to continue your experience</h4>

            {serverError && <p className={styles.errors}>{serverError}</p>}

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
                  />
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
                  />
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
              />
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
                  />

                  {showPopup && (
                    <div className={styles.passwordPopup}>
                      <p>Password must contain:</p>
                      <ul>
                        <li style={{ color: isValidLength ? "green" : "red" }}>
                          At least 8 characters
                        </li>
                        <li style={{ color: hasUpperCase ? "green" : "red" }}>
                          One uppercase letter
                        </li>
                        <li style={{ color: hasLowerCase ? "green" : "red" }}>
                          One lowercase letter
                        </li>
                        <li style={{ color: hasNumber ? "green" : "red" }}>
                          One number
                        </li>
                        <li style={{ color: hasSpecialChar ? "green" : "red" }}>
                          One special character
                        </li>
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
                  />
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
              />
              <p className={styles.errors}>{formErrors.phone_number}</p>
            </div>

            <div className={styles.buttonContainer}>
              <button
                className={styles.button + " " + styles.signup_button}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>

              <button
                className={styles.button + " " + styles.google_button}
                type="button"
              >
                Sign in with Google
                <img
                  src="/images/signup/google-logo.jpg"
                  alt="google logo"
                  className={styles.google_logo}
                />
              </button>

              <div className={styles.loginContainer}>
                <p>Have an account already?</p>
                <a href="../clientSignIn">
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
          />
          <p className={styles.description}>
            Subscribe to our membership and have instant access to exclusive
            rewards, and savings!
          </p>
        </div>
      </div>
    </div>
  );
}
