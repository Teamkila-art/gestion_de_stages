// Service to fetch entreprise profile
export async function fetchEntrepriseProfile() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/entreprise/profile", {
    headers: {
      "x-access-token": token
    }
  });
  if (!res.ok) throw new Error("Erreur lors du chargement du profil entreprise");
  return (await res.json()).entreprise;
}
