"use client";
import React, { useState } from "react";
import styles from "./review.module.css";
import Nav from "../constants/nav";

const REVIEWS_URL = "http://localhost:8000/api/auth/reviews";
const GOOGLE_URL = "";
const YELP_URL = "";
const NAV_HEIGHT = 20;
const BODY_TOP_MARGIN_FIX = -8;

function StarRating({ value, onChange }) {
  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${styles.star} ${star <= value ? styles.filled : ""}`}
          onClick={() => onChange(star)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onChange(star)}
          role="button"
          tabIndex={0}
          aria-label={`Set rating to ${star}`}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("info"); // "info" | "error" | "success"

  const typeClass =
    popupType === "error" ? styles.error : popupType === "success" ? styles.success : styles.info;

  const resetForm = () => {
    setRating(0);
    setReviewText("");
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setPopupType("error");
      setPopupMessage("Please select a star rating (1–5).");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(REVIEWS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, content: reviewText }),
        credentials: "include",
      });

      if (!res.ok) {
        const ct = res.headers?.get?.("content-type") || "";
        let msg = `HTTP ${res.status} ${res.statusText || ""}`.trim();

        if (ct.includes("application/json")) {
          const data = await res.json().catch(() => null);
          const d = data?.detail;
          if (Array.isArray(d) && d[0]?.msg) msg = d[0].msg;
          else if (typeof d === "string") msg = d;
        } else {
          const text = await res.text().catch(() => "");
          if (text) msg = text;
        }
        throw new Error(msg);
      }

      if (rating >= 4) {
        setPopupType("success");
        setPopupMessage("Thanks for the great rating! Please consider leaving a public review as well 🙂");
        if (GOOGLE_URL) window.open(GOOGLE_URL, "_blank", "noopener,noreferrer");
        if (YELP_URL) window.open(YELP_URL, "_blank", "noopener,noreferrer");
      } else {
        setPopupType("info");
        setPopupMessage("Thanks for your feedback. A team member may follow up to make things right.");
      }

      resetForm();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Review submit failed:", err);
      setPopupType("error");
      setPopupMessage("Something went wrong submitting your review. " + (err?.message || ""));
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          marginTop: BODY_TOP_MARGIN_FIX,
        }}
      >
        <Nav />
      </div>

      <div style={{ height: NAV_HEIGHT - BODY_TOP_MARGIN_FIX }} aria-hidden="true" />

      <div className={styles.reviewContainer}>
        <h1 className={styles.reviewTitle}>Leave a Review</h1>
        <h2 className={styles.subHeading}>How would you like to rate your experience with us?</h2>

        <StarRating value={rating} onChange={setRating} />

        <form className={styles.reviewForm} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="review-textarea">
            <i>Review</i> <span className={styles.required}>*</span>
          </label>
          <textarea
            id="review-textarea"
            className={styles.textarea}
            placeholder="ex. You guys are Awesome..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <button type="submit" className={styles.submitButton} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {popupMessage && (
        <div
          className={styles.overlay}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999999,
          }}
        >
          <div
            className={`${styles.popup} ${typeClass}`}
            style={{
              background: "#fff",
              padding: "1.5rem",
              borderRadius: "12px",
              minWidth: 300,
              maxWidth: 400,
              textAlign: "center",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
              borderTop: "5px solid transparent",
            }}
          >
            <p>{popupMessage}</p>
            <button
              onClick={() => setPopupMessage("")}
              className={styles.closeButton}
              style={{
                marginTop: "1rem",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}