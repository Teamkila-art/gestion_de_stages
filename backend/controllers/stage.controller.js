const db = require("../models");
const Stage = db.stage;
const Enterprise = db.enterprise;

// Créer un stage (accessible aux étudiants)
exports.createStage = async (req, res) => {
  try {
    const { titre, entrepriseId, dateDebut, dateFin, description } = req.body;

    if (!titre || !entrepriseId || !dateDebut || !dateFin || !description) {
      return res.status(400).send({ message: "Tous les champs sont requis (incluant les dates)." });
    }

    // Vérifier que l'entreprise existe
    const entreprise = await Enterprise.findByPk(entrepriseId);
    if (!entreprise) {
      return res.status(404).send({ message: "Entreprise non trouvée." });
    }

    // Créer le stage
    const stage = await Stage.create({
      titre,
      entrepriseId,
      dateDebut,
      dateFin,
      description,
      status: "ouvert"
    });

    res.status(201).send({
      message: "Stage créé avec succès!",
      stage
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Erreur lors de la création du stage."
    });
  }
};
