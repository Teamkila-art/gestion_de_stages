import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { signup } from "../../services/authService";

const Signup = () => {
  const [role, setRole] = useState("etudiant");
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    motdepasse: "",
    niveau: "",
    filiere: "",
    nomEntreprise: "",
    secteur: "",
    adresse: "",
    siteWeb: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      let payload = {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        motdepasse: form.motdepasse,
        role: role
      };
      if (role === "etudiant") {
        payload.niveau = form.niveau;
        payload.filiere = form.filiere;
      } else if (role === "entreprise") {
        payload.nomEntreprise = form.nomEntreprise;
        payload.secteur = form.secteur;
        payload.adresse = form.adresse;
        payload.siteWeb = form.siteWeb;
        payload.description = form.description;
      }
      await signup(payload);
      setSuccess("Inscription réussie !");
      setTimeout(() => {
        if (role === "entreprise") {
          navigate("/entreprise");
        } else {
          navigate("/login");
        }
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
        <h2 className={styles.title}>Créer un compte</h2>
        {error && <div style={{color:'#e74c3c', textAlign:'center', marginBottom:8}}>{error}</div>}
        {success && <div style={{color:'#27ae60', textAlign:'center', marginBottom:8}}>{success}</div>}
        <div className={styles.toggleGroup}>
          <button
            type="button"
            className={role === "etudiant" ? styles.activeToggle : styles.toggleBtn}
            onClick={() => setRole("etudiant")}
          >
            Étudiant
          </button>
          <button
            type="button"
            className={role === "entreprise" ? styles.activeToggle : styles.toggleBtn}
            onClick={() => setRole("entreprise")}
          >
            Entreprise
          </button>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            placeholder="Nom"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="prenom">Prénom</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            placeholder="Prénom"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Votre email"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="motdepasse">Mot de passe</label>
          <input
            type="password"
            id="motdepasse"
            name="motdepasse"
            value={form.motdepasse}
            onChange={handleChange}
            placeholder="Mot de passe"
            required
          />
        </div>
        {role === "etudiant" && (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="niveau">Niveau</label>
              <input
                type="text"
                id="niveau"
                name="niveau"
                value={form.niveau}
                onChange={handleChange}
                placeholder="Ex: Master 2"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="filiere">Filière</label>
              <input
                type="text"
                id="filiere"
                name="filiere"
                value={form.filiere}
                onChange={handleChange}
                placeholder="Ex: Informatique"
              />
            </div>
          </>
        )}
        {role === "entreprise" && (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="nomEntreprise">Nom de l'entreprise</label>
              <input
                type="text"
                id="nomEntreprise"
                name="nomEntreprise"
                value={form.nomEntreprise}
                onChange={handleChange}
                placeholder="Nom de l'entreprise"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="secteur">Secteur</label>
              <input
                type="text"
                id="secteur"
                name="secteur"
                value={form.secteur}
                onChange={handleChange}
                placeholder="Secteur d'activité"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="adresse">Adresse</label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                placeholder="Adresse de l'entreprise"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="siteWeb">Site Web</label>
              <input
                type="text"
                id="siteWeb"
                name="siteWeb"
                value={form.siteWeb}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Décrivez l'entreprise"
                rows={3}
              />
            </div>
          </>
        )}
        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer le compte"}
        </button>
        <div className={styles.switchLink}>
          Déjà un compte ? <a href="/login">Se connecter</a>
        </div>
      </form>
    </div>
  );
};

export default Signup;
