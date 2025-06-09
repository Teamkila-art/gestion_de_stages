const API_URL = "http://localhost:5000/api/auth/";

export async function signup(data) {
  const response = await fetch(API_URL + "signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Erreur lors de l'inscription");
  return result;
}

export async function signin(data) {
  const response = await fetch(API_URL + "signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Erreur lors de la connexion");
  return result;
}
