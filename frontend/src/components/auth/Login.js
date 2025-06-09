import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { signin } from "../../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signin({ email, motdepasse });
      localStorage.setItem("token", result.accessToken);
      localStorage.setItem("user", JSON.stringify(result));
      if (result.role === "admin") {
        navigate("/admin");
      } else if (result.role === "entreprise") {
        navigate("/entreprise");
      } else {
        navigate("/etudiant");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
        <h2 className={styles.title}>Se connecter</h2>
        {error && <div style={{color:'#e74c3c', textAlign:'center', marginBottom:8}}>{error}</div>}
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Votre email"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="motdepasse">Mot de passe</label>
          <input
            type="password"
            id="motdepasse"
            value={motdepasse}
            onChange={e => setMotdepasse(e.target.value)}
            placeholder="Votre mot de passe"
            required
          />
        </div>
        <button className={styles.submitBtn} type="submit">
          Connexion
        </button>
        <div className={styles.switchLink}>
          Pas encore de compte ? <a href="/signup">Créer un compte</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
