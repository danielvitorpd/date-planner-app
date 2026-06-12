"use client"

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    restaurant: "",
    vibe: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container">
      <h1>Date Planner ❤️</h1>

      <form onSubmit={handleSubmit}>
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>Time</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <label>Restaurant Type</label>
        <select
          name="restaurant"
          value={formData.restaurant}
          onChange={handleChange}
          required
        >
          <option value="">Select...</option>
          <option>Hamburger</option>
          <option>Sushi</option>
          <option>Pasta</option>
          <option>Mexican</option>
          <option>Italian</option>
          <option>Steakhouse</option>
          <option>Pizza</option>
          <option>Seafood</option>
        </select>

        <label>Date Vibe</label>
        <select
          name="vibe"
          value={formData.vibe}
          onChange={handleChange}
          required
        >
          <option value="">Select...</option>
          <option>Golf</option>
          <option>Walk</option>
          <option>Running</option>
          <option>Cinema</option>
          <option>Dance</option>
          <option>Beach</option>
          <option>Picnic</option>
          <option>Museum</option>
          <option>Bowling</option>
        </select>

        <button type="submit">Save Date</button>
      </form>

      {submitted && (
        <div className="result">
          <h2>Planned Date 🎉</h2>
          <p>
            <strong>Date:</strong> {formData.date}
          </p>
          <p>
            <strong>Time:</strong> {formData.time}
          </p>
          <p>
            <strong>Restaurant:</strong> {formData.restaurant}
          </p>
          <p>
            <strong>Vibe:</strong> {formData.vibe}
          </p>
        </div>
      )}
    </div>
  );
}