import React, { useState, useEffect } from "react";
import styles from "./EnterpriseTheme.module.css";
import { FaListAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import EntrepriseRequestsTable from "./EntrepriseRequestsTable";
import { fetchEntrepriseProfile } from "../../services/entrepriseService";
import { useNavigate } from "react-router-dom";
import profileStyles from "./EntrepriseProfile.module.css";
import { FaBuilding } from "react-icons/fa";

function EntrepriseProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntrepriseProfile()
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement du profil entreprise");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Chargement du profil...</div>;
  if (error) return <div style={{ color: "#e53935", padding: "2rem" }}>{error}</div>;
  if (!profile) return null;

  return (
    <div className={profileStyles.profileCard}>
      <div className={profileStyles.profileAvatar}><FaBuilding /></div>
      <div className={profileStyles.profileTitle}>{profile.nom}</div>
      <div className={profileStyles.profileField}>
        <span className={profileStyles.profileLabel}>Secteur</span>
        <span className={profileStyles.profileValue}>{profile.secteur || <span style={{color:'#bbb'}}>Non renseigné</span>}</span>
      </div>
      <div className={profileStyles.profileField}>
        <span className={profileStyles.profileLabel}>Adresse</span>
        <span className={profileStyles.profileValue}>{profile.adresse || <span style={{color:'#bbb'}}>Non renseignée</span>}</span>
      </div>
      <div className={profileStyles.profileField}>
        <span className={profileStyles.profileLabel}>Site web</span>
        {profile.siteWeb ? (
          <a href={profile.siteWeb} target="_blank" rel="noopener noreferrer" className={profileStyles.profileSite}>{profile.siteWeb}</a>
        ) : (
          <span className={profileStyles.profileValue} style={{color:'#bbb'}}>Non renseigné</span>
        )}
      </div>
      {profile.description && (
        <div className={profileStyles.profileDesc}>{profile.description}</div>
      )}
    </div>
  );
}


const initialRequests = [
  {
    id: 1,
    etudiant: "Marie Dubois",
    dateDebut: "1 juillet",
    dateFin: "31 août",
    description: "Développement d'une application web pour la gestion des stocks.",
    status: "en attente",
    comment: ""
  },
  {
    id: 2,
    etudiant: "Marie Dubois",
    dateDebut: "1 juillet",
    dateFin: "31 août",
    description: "Développement d'une application mobile pour la gestion des tâches.",
    status: "acceptée",
    comment: ""
  },
  {
    id: 3,
    etudiant: "Marie Dubois",
    dateDebut: "1 juillet",
    dateFin: "31 août",
    description: "Refonte du site vitrine de l'entreprise.",
    status: "refusée",
    comment: ""
  }
];

const EnterpriseThemedDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("demandes");
  const [requests, setRequests] = useState(initialRequests);

  const handleCommentChange = (id, value) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, comment: value } : r))
    );
  };

  const handleSaveComment = (id) => {
    // Placeholder: Here you would send the comment to the backend
    // For now, just show an alert or do nothing
    // alert('Commentaire enregistré !');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={styles.enterpriseLayout}>
      <div className={styles.navBar}></div>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Entreprise</div>
        <nav className={styles.sidebarNav}>
          <button
            className={activeTab === "demandes" ? `${styles.sidebarNavItem} ${styles.active}` : styles.sidebarNavItem}
            onClick={() => setActiveTab("demandes")}
          >
            <FaListAlt /> Demandes
          </button>
          <button
            className={activeTab === "profil" ? `${styles.sidebarNavItem} ${styles.active}` : styles.sidebarNavItem}
            onClick={() => setActiveTab("profil")}
          >
            <FaUser /> Profil
          </button>
          <button className={styles.sidebarNavItem} onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}>
            <FaSignOutAlt /> Déconnexion
          </button>
        </nav>
      </aside>
      <main className={styles.mainSection}>
        {activeTab === "demandes" && (
  <EntrepriseRequestsTable />
)}
        {activeTab === "profil" && (
  <EntrepriseProfile />
)}
      </main>
    </div>
  );
};

export default EnterpriseThemedDashboard;
