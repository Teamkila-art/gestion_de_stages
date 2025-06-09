import React, { useState, useEffect } from "react";
import styles from "./Etudiant.module.css";
import { createStageAndCandidature } from "../../services/candidatureService";
import { fetchEnterprises } from "../../services/enterpriseService";

const StageRequestForm = () => {
  const [enterprises, setEnterprises] = useState([]);
  const [enterprisesLoading, setEnterprisesLoading] = useState(true);
  const [enterprisesError, setEnterprisesError] = useState("");

  useEffect(() => {
    async function loadEnterprises() {
      setEnterprisesLoading(true);
      setEnterprisesError("");
      try {
        const data = await fetchEnterprises();
        setEnterprises(data);
      } catch (err) {
        setEnterprisesError(err.message);
      } finally {
        setEnterprisesLoading(false);
      }
    }
    loadEnterprises();
  }, []);
  const [form, setForm] = useState({
    titre: "",
    entrepriseId: "",
    dateDebut: "",
    dateFin: "",
    description: "",
    tuteurNom: "",
    tuteurFonction: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Validation: check all fields
    if (!form.titre || !form.entrepriseId || !form.dateDebut || !form.dateFin || !form.description || !form.tuteurNom || !form.tuteurFonction) {
      setError("Veuillez remplir tous les champs et choisir une entreprise.");
      return;
    }
    setLoading(true);
    try {
      await createStageAndCandidature({
        stageData: {
          titre: form.titre,
          entrepriseId: form.entrepriseId,
          dateDebut: form.dateDebut,
          dateFin: form.dateFin,
          description: form.description
        },
        tuteurNom: form.tuteurNom,
        tuteurFonction: form.tuteurFonction
      });
      setSuccess("Demande envoyée avec succès !");
      setForm({
        titre: "",
        entrepriseId: "",
        dateDebut: "",
        dateFin: "",
        description: "",
        tuteurNom: "",
        tuteurFonction: ""
      });
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la soumission du formulaire:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.formTitle}>Nouvelle demande de stage</div>
      {error && <div style={{color:'red',marginBottom:10}}>{error}</div>}
      {success && <div style={{color:'green',marginBottom:10}}>{success}</div>}
      <form onSubmit={handleSubmit} style={{maxWidth:500, margin:'0 auto'}}>
        <div className={styles.formGroup}>
          <label htmlFor="titre">Titre du stage</label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={form.titre}
            onChange={handleChange}
            placeholder="Ex: Développeur React"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="entrepriseId">Entreprise</label>
          {enterprisesLoading ? (
            <div>Chargement des entreprises...</div>
          ) : enterprisesError ? (
            <div style={{color: 'red'}}>Erreur: {enterprisesError}</div>
          ) : (
            <select
              id="entrepriseId"
              name="entrepriseId"
              value={form.entrepriseId}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une entreprise</option>
              {enterprises.map(ent => (
                <option key={ent.id} value={ent.id}>{ent.nom}</option>
              ))}
            </select>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="dateDebut">Date de début</label>
          <input
            type="date"
            id="dateDebut"
            name="dateDebut"
            value={form.dateDebut}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="dateFin">Date de fin</label>
          <input
            type="date"
            id="dateFin"
            name="dateFin"
            value={form.dateFin}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="tuteurNom">Nom du tuteur</label>
          <input
            type="text"
            id="tuteurNom"
            name="tuteurNom"
            value={form.tuteurNom}
            onChange={handleChange}
            placeholder="Nom du tuteur"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="tuteurFonction">Fonction du tuteur</label>
          <input
            type="text"
            id="tuteurFonction"
            name="tuteurFonction"
            value={form.tuteurFonction}
            onChange={handleChange}
            placeholder="Ex: Responsable IT"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Décrivez le stage..."
            rows={4}
            required
          />
        </div>
        <button className={styles.submitBtn} type="submit">
          Soumettre la demande
        </button>
      </form>
    </div>
  );
};

export default StageRequestForm;
