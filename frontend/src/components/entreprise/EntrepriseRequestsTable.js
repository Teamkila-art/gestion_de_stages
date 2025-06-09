import React, { useState, useEffect } from "react";
import styles from "./EntrepriseRequestsTable.module.css";
import { getEntrepriseCandidatures, saveEntrepriseComment, updateCandidatureStatus } from "../../services/candidatureService";

export default function EntrepriseRequestsTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEntrepriseCandidatures()
      .then(candidatures => {
        setRows(
          candidatures.map(c => ({
            id: c.id,
            etudiant: c.etudiant?.user ? `${c.etudiant.user.nom} ${c.etudiant.user.prenom}` : "",
            stage: c.stage?.titre || "",
            dateDebut: c.stage?.dateDebut ? new Date(c.stage.dateDebut).toLocaleDateString() : "",
            statut: c.status,
            commentaire: c.commentaireEntreprise || ""
          }))
        );
        setLoading(false);
      })
      .catch(err => {
        setError("Erreur lors du chargement des demandes");
        setLoading(false);
      });
  }, []);

  const [actionLoading, setActionLoading] = useState({}); // { [id]: true/false }
  const [actionError, setActionError] = useState({}); // { [id]: errorMsg }

  const handleCommentChange = (id, value) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, commentaire: value } : r));
  };

  const handleSave = async (id) => {
    setActionLoading(al => ({ ...al, [id]: true }));
    setActionError(ae => ({ ...ae, [id]: "" }));
    const row = rows.find(r => r.id === id);
    try {
      await saveEntrepriseComment(id, row.commentaire);
      // Clear the comment field after successful save
      setRows(prev => prev.map(r => r.id === id ? { ...r, commentaire: "" } : r));
      setActionLoading(al => ({ ...al, [id]: false }));
    } catch (e) {
      setActionError(ae => ({ ...ae, [id]: e.message }));
      setActionLoading(al => ({ ...al, [id]: false }));
    }
  };

  const handleStatus = async (id, status) => {
    setActionLoading(al => ({ ...al, [id]: true }));
    setActionError(ae => ({ ...ae, [id]: "" }));
    try {
      await updateCandidatureStatus(id, status);
      setRows(prev => prev.map(r => r.id === id ? { ...r, statut: status } : r));
      setActionLoading(al => ({ ...al, [id]: false }));
    } catch (e) {
      setActionError(ae => ({ ...ae, [id]: e.message }));
      setActionLoading(al => ({ ...al, [id]: false }));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.blueHeader}>Demandes reçues</div>
      {loading ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>Chargement...</div>
      ) : error ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#e53935" }}>{error}</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Stage</th>
              <th>Date de début</th>
              <th>Statut</th>
              <th>Commentaire</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.etudiant}</td>
                <td>{row.stage}</td>
                <td>{row.dateDebut}</td>
                <td>
                  <button className={styles.proBtn} disabled>{row.statut}</button>
                </td>
                <td>
                  <textarea
                    className={styles.textarea}
                    value={row.commentaire}
                    onChange={e => handleCommentChange(row.id, e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    rows={2}
                    disabled={row.statut === "acceptée"}
                  />
                  <div>
                    <button
                      className={styles.saveBtn}
                      onClick={() => handleSave(row.id)}
                      disabled={actionLoading[row.id] || row.statut === "acceptée"}
                    >
                      {actionLoading[row.id] ? "..." : "Sauvegarder"}
                    </button>
                    {actionError[row.id] && (
                      <div style={{ color: "#e53935", fontSize: "0.95em" }}>{actionError[row.id]}</div>
                    )}
                  </div>
                </td>
                <td>
                  {row.statut === "acceptée" ? (
                    <span style={{ color: '#1db954', fontWeight: 700 }}>Demande acceptée</span>
                  ) : (
                    <>
                      <button
                        className={styles.acceptBtn}
                        onClick={() => handleStatus(row.id, "acceptée")}
                        disabled={actionLoading[row.id] || row.statut === "acceptée"}
                      >
                        {actionLoading[row.id] && row.statut !== "acceptée" ? "..." : "Accepter"}
                      </button>
                      <button
                        className={styles.rejectBtn}
                        onClick={() => handleStatus(row.id, "refusée")}
                        disabled={actionLoading[row.id] || row.statut === "refusée"}
                      >
                        {actionLoading[row.id] && row.statut !== "refusée" ? "..." : "Refuser"}
                      </button>
                      {actionError[row.id] && (
                        <div style={{ color: "#e53935", fontSize: "0.95em" }}>{actionError[row.id]}</div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
