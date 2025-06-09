import React, { useEffect, useState } from "react";
import styles from "./Etudiant.module.css";
import { getStudentCandidatures } from "../../services/candidatureService";

const getStatusBadge = (statut) => {
  if (statut === "acceptée" || statut === "validé" || statut === "valide") return <span className={`${styles.statusBadge} ${styles.statusAccepted}`}>Validé</span>;
  if (statut === "refusée" || statut === "refusé") return <span className={`${styles.statusBadge} ${styles.statusRejected}`}>Refusé</span>;
  return <span className={`${styles.statusBadge} ${styles.statusPending}`}>En attente</span>;
};

const StageRequestsList = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStudentCandidatures()
      .then(data => setCandidatures(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={{fontWeight:700, color:'#3358d4', marginBottom:'1.5rem'}}>Mes demandes de stage</h2>
      {loading && <div>Chargement...</div>}
      {error && <div style={{color:'#e74c3c', marginBottom:12}}>{error}</div>}
      {!loading && !error && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Entreprise</th>
              <th>Durée</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {candidatures.length === 0 ? (
              <tr><td colSpan={4} style={{textAlign:'center', color:'#64748b'}}>Aucune demande</td></tr>
            ) : (
              candidatures.map(req => (
                <tr key={req.id}>
                  <td>{req.stage?.titre || "-"}</td>
                  <td>{req.stage?.entreprise?.nom || "-"}</td>
                  <td>{(() => {
                    if (req.stage?.dateDebut && req.stage?.dateFin) {
                      const debut = new Date(req.stage.dateDebut);
                      const fin = new Date(req.stage.dateFin);
                      const diffTime = Math.abs(fin - debut);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return `${diffDays} jours`;
                    }
                    return "-";
                  })()}</td>
                  <td>{getStatusBadge(req.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StageRequestsList;
