import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";

import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("users");
  const [error, setError] = useState("");

  // Check admin role before fetching data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    setAuthChecked(true);
    setLoading(true);
    Promise.all([
      fetch("http://localhost:5000/api/admin/utilisateurs", {
        headers: { "x-access-token": localStorage.getItem("token") }
      }).then(r => r.json()),
      fetch("http://localhost:5000/api/admin/statistiques", {
        headers: { "x-access-token": localStorage.getItem("token") }
      }).then(r => r.json())
    ])
      .then(([usersRes, statsRes]) => {
        setUsers(usersRes.utilisateurs || []);
        setStats(statsRes || {});
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement des données administrateur.");
        setLoading(false);
      });
  }, []);

  const handleActivation = (userId, actif) => {
    fetch(`http://localhost:5000/api/admin/utilisateur/${userId}/${actif ? "desactiver" : "activer"}`, {
      method: "PUT",
      headers: { "x-access-token": localStorage.getItem("token") }
    })
      .then(r => r.json())
      .then(() => {
        setUsers(users =>
          users.map(u =>
            u.id === userId ? { ...u, actif: !actif } : u
          )
        );
      });
  };

  if (!authChecked) return <div className={styles.adminDashboard}>Chargement...</div>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={styles.adminDashboard}>
      <h1 style={{display: 'inline-block', margin: 0, marginBottom: '20px', color: '#1976d2'}}>Espace Administration
        <button 
          onClick={handleLogout} 
          style={{
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.4rem 1.1rem',
            fontSize: '0.98rem',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            marginLeft: '350px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(44,62,80,0.08)'
          }}
        >
          <svg style={{marginRight: '8px'}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M13.7 13.7a1 1 0 0 1-1.4 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.4 1.4L11.42 9H17a1 1 0 1 1 0 2h-5.58l2.28 2.3zM3 4a2 2 0 0 1 2-2h5a1 1 0 1 1 0 2H5v12h5a1 1 0 1 1 0 2H5a2 2 0 0 1-2-2V4z"/></svg>
          Déconnexion
        </button>
      </h1>
      <div className={styles.tabs}>
        <button className={tab==="users" ? styles.active : ""} onClick={() => setTab("users")}>Gestion des utilisateurs</button>
        <button className={tab==="stats" ? styles.active : ""} onClick={() => setTab("stats")}>Statistiques</button>
        {/* Optionnel: <button onClick={() => setTab("affectation")}>Affectation entreprises/étudiants</button> */}
      </div>
      {loading ? <div>Chargement...</div> : error ? <div className={styles.error}>{error}</div> : (
        <>
          {tab === "users" && (
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(user => user.role !== "admin").map(user => (
                  <tr key={user.id}>
                    <td>{user.nom} {user.prenom}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.actif ? "Actif" : "Inactif"}</td>
                    <td>
                      <button onClick={() => handleActivation(user.id, user.actif)}>
                        {user.actif ? "Désactiver" : "Activer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === "stats" && (
            <div className={styles.statsGrid} style={{display: 'flex', gap: '2rem', marginTop: '2rem', justifyContent: 'center', flexWrap: 'wrap'}}>
              <div style={{background: '#fff', borderRadius: '14px', boxShadow: '0 2px 16px #b9d6f7', padding: '2rem 2.5rem', minWidth: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <svg width="36" height="36" style={{marginBottom: '12px'}} viewBox="0 0 24 24">
  <defs>
    <linearGradient id="bluePurple1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#1976d2" />
      <stop offset="100%" stopColor="#7b1fa2" />
    </linearGradient>
  </defs>
  <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 17.93V20a1 1 0 0 1-2 0v-.07A8.006 8.006 0 0 1 4.07 13H5a1 1 0 0 1 0 2h-.93A8.006 8.006 0 0 1 11 19.93ZM12 4a8 8 0 0 1 8 8 8.009 8.009 0 0 1-7 7.93V20a1 1 0 0 1-2 0v-.07A8.009 8.009 0 0 1 4 12a8 8 0 0 1 8-8Zm0 2a6 6 0 1 0 6 6 6.006 6.006 0 0 0-6-6Zm0 10a4 4 0 1 1 4-4 4.005 4.005 0 0 1-4 4Z" fill="url(#bluePurple1)"/>
</svg>
                <span style={{fontSize: '2.2rem', fontWeight: 700, color: '#ffb300'}}>{stats.en_attente ?? 0}</span>
                <span style={{fontWeight: 500, color: '#888', marginTop: '6px'}}>Stages en attente</span>
              </div>
              <div style={{background: '#fff', borderRadius: '14px', boxShadow: '0 2px 16px #b9f7c5', padding: '2rem 2.5rem', minWidth: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <svg width="36" height="36" style={{marginBottom: '12px'}} viewBox="0 0 24 24">
  <defs>
    <linearGradient id="bluePurple2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#1976d2" />
      <stop offset="100%" stopColor="#7b1fa2" />
    </linearGradient>
  </defs>
  <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm5 11h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4h4a1 1 0 0 1 0 2Z" fill="url(#bluePurple2)"/>
</svg>
                <span style={{fontSize: '2.2rem', fontWeight: 700, color: '#43a047'}}>{stats.valide ?? 0}</span>
                <span style={{fontWeight: 500, color: '#888', marginTop: '6px'}}>Stages validés</span>
              </div>
              <div style={{background: '#fff', borderRadius: '14px', boxShadow: '0 2px 16px #f7b9b9', padding: '2rem 2.5rem', minWidth: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <svg width="36" height="36" style={{marginBottom: '12px'}} viewBox="0 0 24 24">
  <defs>
    <linearGradient id="bluePurple3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#1976d2" />
      <stop offset="100%" stopColor="#7b1fa2" />
    </linearGradient>
  </defs>
  <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 13.41V17a1 1 0 0 0 2 0v-1.59l3.29-3.3a1 1 0 0 0-1.42-1.42L13 13.59V7a1 1 0 0 0-2 0v6.59l-2.29-2.3a1 1 0 0 0-1.42 1.42Z" fill="url(#bluePurple3)"/>
</svg>
                <span style={{fontSize: '2.2rem', fontWeight: 700, color: '#e53935'}}>{stats.refuse ?? 0}</span>
                <span style={{fontWeight: 500, color: '#888', marginTop: '6px'}}>Stages refusés</span>
              </div>
            </div>
          )}
          {/* Optionnel: Affectation entreprises/étudiants */}
          {tab === "affectation" && (
            <div className={styles.affectationBox}>
              <h2>Affectation d'entreprises aux étudiants</h2>
              <p>À implémenter...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
