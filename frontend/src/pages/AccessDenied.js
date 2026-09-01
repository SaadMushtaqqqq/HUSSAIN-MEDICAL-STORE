import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = () => (
  <div className="center-page">
    <h1>ACCESS DENIED</h1>
    <p>You do not have permission to view this page.</p>
    <Link className="btn btn-primary" to="/login">
      Back to Login
    </Link>
  </div>
);

export default AccessDenied;
