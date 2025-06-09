import React from "react";
import styles from "./StudentProfile.module.css";
import { FaUserGraduate } from "react-icons/fa";

export default function StudentProfile({ student }) {
  if (!student) return null;
  return (
    <div className={styles.profileCard}>
      <div className={styles.profileAvatar}><FaUserGraduate /></div>
      <div className={styles.profileTitle}>{student.nom}</div>
      <div className={styles.profileField}>
        <span className={styles.profileLabel}>Email</span>
        <span className={styles.profileValue}>{student.email || <span style={{color:'#bbb'}}>Non renseigné</span>}</span>
      </div>
      <div className={styles.profileField}>
        <span className={styles.profileLabel}>Filière</span>
        <span className={styles.profileValue}>{student.filiere || <span style={{color:'#bbb'}}>Non renseignée</span>}</span>
      </div>
      <div className={styles.profileField}>
        <span className={styles.profileLabel}>Niveau</span>
        <span className={styles.profileValue}>{student.niveau || <span style={{color:'#bbb'}}>Non renseigné</span>}</span>
      </div>
      {student.description && (
        <div className={styles.profileDesc}>{student.description}</div>
      )}
    </div>
  );
}
