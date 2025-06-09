import React, { useState } from "react";
import styles from "./Enterprise2.module.css";

const EnterpriseDashboard2 = () => {
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
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Espace Entreprise</h1>
          <button className={styles.logoutButton}>
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.tabContainer}>
          <button
            className={activeTab === "demandes" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("demandes")}
          >
            Demandes reçues
          </button>
        </div>

        {activeTab === "demandes" && (
          <div className={styles.contentCard}>
            <h2 className={styles.cardTitle}>Demandes de stage reçues</h2>
            
            <div className={styles.tableContainer}>
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
                  {demandes.map((demande) => (
                    <tr key={demande.id}>
                      <td data-label="Étudiant">{demande.etudiant}</td>
                      <td data-label="Stage">{demande.titre}</td>
                      <td data-label="Dates">
                        <div className={styles.dateRange}>
                          <span className={styles.date}>{demande.dateDebut}</span>
                          <span className={styles.dateSeparator}>au</span>
                          <span className={styles.date}>{demande.dateFin}</span>
                        </div>
                      </td>
                      <td data-label="Statut">
                        <span
                          className={
                            demande.status === "acceptée"
                              ? styles.statusAccepted
                              : demande.status === "refusée"
                              ? styles.statusRejected
                              : styles.statusPending
                          }
                        >
                          {demande.status.charAt(0).toUpperCase() + demande.status.slice(1)}
                        </span>
                      </td>
                      <td data-label="Commentaire">
                        <textarea
                          className={styles.commentText}
                          placeholder="Ajouter un commentaire..."
                          defaultValue={demande.commentaire}
                        />
                      </td>
                      <td data-label="Actions">
                        <div className={styles.actionButtons}>
                          <button className={styles.acceptButton}>Accepter</button>
                          <button className={styles.rejectButton}>Refuser</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EnterpriseDashboard2;
