import React, { useState } from "react";
import styles from "./Entreprise.module.css";

const EntrepriseDashboard = () => {
  const [activeTab, setActiveTab] = useState("demandes");

  // Dummy data for demonstration
  const demandes = [
    {
      id: 1,
      etudiant: "Amine Benali",
      titre: "Stage Développement Web",
      dateDebut: "2025-06-01",
      dateFin: "2025-07-15",
      commentaire: "",
      status: "en attente"
    },
    {
      id: 2,
      etudiant: "Sara Toumi",
      titre: "Stage Marketing Digital",
      dateDebut: "2025-07-01",
      dateFin: "2025-08-01",
      commentaire: "",
      status: "acceptée"
    }
  ];

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.navBar}>
        <span>Espace Entreprise</span>
        <button className={styles.logoutBtn}>Déconnexion</button>
      </nav>
      <div className={styles.mainContent}>
        <div className={styles.tabs}>
          <button
            className={activeTab === "demandes" ? styles.activeTab : styles.tabBtn}
            onClick={() => setActiveTab("demandes")}
          >
            Demandes reçues
          </button>
        </div>
        {activeTab === "demandes" && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Demandes de stage reçues</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Stage</th>
                  <th>Dates</th>
                  <th>Statut</th>
                  <th>Commentaire</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {demandes.map((d) => (
                  <tr key={d.id}>
                    <td>{d.etudiant}</td>
                    <td>{d.titre}</td>
                    <td>{d.dateDebut} au {d.dateFin}</td>
                    <td>
                      <span className={
                        d.status === "acceptée"
                          ? styles.statusAccepted
                          : d.status === "refusée"
                          ? styles.statusRejected
                          : styles.statusPending
                      }>
                        {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <textarea
                        className={styles.commentInput}
                        placeholder="Ajouter un commentaire..."
                        value={d.commentaire}
                        readOnly
                      />
                    </td>
                    <td>
                      <button className={styles.acceptBtn}>Accepter</button>
                      <button className={styles.rejectBtn}>Refuser</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntrepriseDashboard;
