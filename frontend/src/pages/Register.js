import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    const result = await register(form.name, form.email, form.password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }
    setSuccess(result.message + " Redirecting to login...");
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p className="auth-subtext">User / Student Registration</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <label>Full Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input
          type="password"
          name="password"
          minLength={6}
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Register"}
        </button>

        <p className="auth-note">
          Status = PENDING after registration. You must wait for admin approval before you can log in.
        </p>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
