import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CATEGORIES = [
  "Medicine Availability",
  "Billing Issue",
  "Staff Behavior",
  "Product Quality",
  "Delivery Delay",
  "Other",
];

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api.post("/complaints", form);
      setSuccess("Complaint submitted successfully. Status = PENDING.");
      setTimeout(() => navigate("/track-status"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1>Submit Complaint</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <label>Title</label>
        <input type="text" name="title" value={form.title} onChange={handleChange} required />

        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Description</label>
        <textarea
          name="description"
          rows={6}
          value={form.description}
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default SubmitComplaint;
