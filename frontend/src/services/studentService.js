// Service to fetch student profile
export async function fetchStudentProfile() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/student/profile", {
    headers: {
      "x-access-token": token
    }
  });
  if (!res.ok) throw new Error("Erreur lors du chargement du profil étudiant");
  return (await res.json()).student;
}
