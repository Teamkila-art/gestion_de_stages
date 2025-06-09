import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Etudiant.module.css";
import StageRequestForm from "./StageRequestForm";
import StageRequestsList from "./StageRequestsList";
import StudentProfile from "./StudentProfile";
import { fetchStudentProfile } from "../../services/studentService";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  // Dummy user name for demo
  const userName = "Jean Dupont";
  // Student profile state
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load profile data when tab changes to profile
  useEffect(() => {
    if (activeTab === "profil") {
      setLoading(true);
      fetchStudentProfile()
        .then(data => {
          setStudent(data);
          setLoading(false);
          setError("");
        })
        .catch(() => {
          setError("Erreur lors du chargement du profil étudiant");
          setLoading(false);
        });
    }
  }, [activeTab]);

  // Déconnexion handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.navBar} style={{background: 'var(--sidebar-bg)', color: 'var(--sidebar-text)'}}>
        <span className={styles.logo}>Espace Étudiant</span>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.tabs} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', gap: '15px'}}>
            <button
              className={activeTab !== "list" ? styles.tabBtn : ""}
              onClick={() => setActiveTab("list")}
              style={{
                marginRight: '10px',
                ...(activeTab === "list" ? {
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1.6rem',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(44,62,80,0.08)'
                } : {})
              }}
            >
              Mes demandes
            </button>
            <button
              className={activeTab !== "form" ? styles.tabBtn : ""}
              onClick={() => setActiveTab("form")}
              style={{
                marginRight: '10px',
                ...(activeTab === "form" ? {
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1.6rem',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(44,62,80,0.08)'
                } : {})
              }}
            >
              Nouvelle demande
            </button>
            <button
              className={activeTab !== "profil" ? styles.tabBtn : ""}
              onClick={() => setActiveTab("profil")}
              style={{
                ...(activeTab === "profil" ? {
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1.6rem',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(44,62,80,0.08)'
                } : {})
              }}
            >
              Profil
            </button>
          </div>

          <button 
            onClick={handleLogout} 
            style={{
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.4rem 1.1rem',
              fontSize: '0.9rem',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(44,62,80,0.08)',
            }}
          >
            <svg style={{marginRight: '8px'}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path d="M13.7 13.7a1 1 0 0 1-1.4 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.4 1.4L11.42 9H17a1 1 0 1 1 0 2h-5.58l2.28 2.3zM3 4a2 2 0 0 1 2-2h5a1 1 0 1 1 0 2H5v12h5a1 1 0 1 1 0 2H5a2 2 0 0 1-2-2V4z"/></svg>
            Déconnexion
          </button>
        </div>
        {activeTab === "list" && <StageRequestsList />}
        {activeTab === "form" && <StageRequestForm />}
        {activeTab === "profil" && (
          loading ? <div style={{padding:'2rem',textAlign:'center'}}>Chargement du profil...</div>
          : error ? <div style={{color:'#e53935',padding:'2rem'}}>{error}</div>
          : <StudentProfile student={student} />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
