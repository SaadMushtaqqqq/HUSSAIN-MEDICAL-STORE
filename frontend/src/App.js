import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AccessDenied from "./pages/AccessDenied";
import UserDashboard from "./pages/UserDashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import TrackStatus from "./pages/TrackStatus";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageComplaints from "./pages/ManageComplaints";

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* User routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute role="user">
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/submit-complaint"
            element={
              <PrivateRoute role="user">
                <SubmitComplaint />
              </PrivateRoute>
            }
          />
          <Route
            path="/track-status"
            element={
              <PrivateRoute role="user">
                <TrackStatus />
              </PrivateRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute role="admin">
                <ManageUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <PrivateRoute role="admin">
                <ManageComplaints />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
