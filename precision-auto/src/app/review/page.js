"use client";
import React, { useState } from "react";
import styles from "./review.module.css";
import Nav from "../constants/nav";

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Rating: ${rating}\nReview: ${reviewText}`);
    setRating(0);
    setReviewText("");
  };

  return (
    <div className={styles.page}>
      <Nav />
      <div className={styles.reviewContainer}>
        <h1 className={styles.reviewTitle}>Leave a Review</h1>
        <h2 className={styles.subHeading}>
          How would you like to rate your experience with us?
        </h2>
        
        <div className={styles.starRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`${styles.star} ${star <= rating ? styles.filled : ""}`}
              onClick={() => handleRating(star)}
            >
              &#9733;
            </span>
          ))}
        </div>

        <form className={styles.reviewForm} onSubmit={handleSubmit}>
          <label className={styles.label}>
           <i>Review</i>  <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="ex. You guys are Awesome..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
          <button type="submit" className={styles.submitButton}>
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
