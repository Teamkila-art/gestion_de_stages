// Service to fetch all enterprises for students
export async function fetchEnterprises() {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5000/api/enterprises", {
    headers: {
      "x-access-token": token
    }
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des entreprises");
  return result.enterprises;
}
