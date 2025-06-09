import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import StudentDashboard from "./components/etudiant/StudentDashboard";
import EnterpriseThemedDashboard from "./components/entreprise/EnterpriseThemedDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/etudiant" element={<StudentDashboard />} />
          <Route path="/entreprise" element={<EnterpriseThemedDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
