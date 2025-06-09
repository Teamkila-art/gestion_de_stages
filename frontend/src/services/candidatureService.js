const API_URL = "http://localhost:5000/api/candidatures/etudiant";
const ENTREPRISE_API_URL = "http://localhost:5000/api/candidatures/entreprise";

export async function getStudentCandidatures() {
  const token = localStorage.getItem("token");
  const response = await fetch(API_URL, {
    headers: {
      "x-access-token": token
    }
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des candidatures");
  return result.candidatures;
}

export async function saveEntrepriseComment(candidatureId, commentaire) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5000/api/candidatures/${candidatureId}/commentaire`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token
    },
    body: JSON.stringify({ commentaire })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Erreur lors de la sauvegarde du commentaire");
  return result.candidature;
}

export async function updateCandidatureStatus(candidatureId, status) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5000/api/candidatures/${candidatureId}/statut`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token
    },
    body: JSON.stringify({ status })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Erreur lors de la mise à jour du statut");
  return result.candidature;
}

export async function getEntrepriseCandidatures() {
  const token = localStorage.getItem("token");
  const response = await fetch(ENTREPRISE_API_URL, {
    headers: {
      "x-access-token": token
    }
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des candidatures");
  return result.candidatures;
}

// Create a stage, then a tutor, then a candidature for that stage, in one click
export async function createStageAndCandidature({ stageData, tuteurNom, tuteurFonction }) {
  const token = localStorage.getItem("token");

  // 1. Create the stage
  const stageRes = await fetch("http://localhost:5000/api/stages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token
    },
    body: JSON.stringify(stageData)
  });
  const stageResult = await stageRes.json();
  if (!stageRes.ok) throw new Error(stageResult.message || "Erreur lors de la création du stage");

  // 2. Get the new stageId and entrepriseId
  const stageId = stageResult.stage?.id || stageResult.id;
  const entrepriseId = stageResult.stage?.entrepriseId || stageResult.entrepriseId || stageData.entrepriseId;

  // 3. Create the tutor
  const tutorRes = await fetch("http://localhost:5000/api/tutors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token
    },
    body: JSON.stringify({
      entrepriseId,
      nom: tuteurNom,
      fonction: tuteurFonction
    })
  });
  const tutorResult = await tutorRes.json();
  if (!tutorRes.ok) throw new Error(tutorResult.message || "Erreur lors de la création du tuteur");
  const tutorId = tutorResult.tutor?.id || tutorResult.id;

  // 4. Create the candidature
  const candidatureRes = await fetch("http://localhost:5000/api/candidatures", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token
    },
    body: JSON.stringify({ stageId, tutorId })
  });
  const candidatureResult = await candidatureRes.json();
  if (!candidatureRes.ok) throw new Error(candidatureResult.message || "Erreur lors de la création de la candidature");

  return candidatureResult;
}

