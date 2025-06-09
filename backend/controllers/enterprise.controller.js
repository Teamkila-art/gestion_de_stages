const db = require("../models");
const Enterprise = db.enterprise;

// Récupérer toutes les entreprises (accessible aux étudiants)
exports.getAllEnterprises = async (req, res) => {
  try {
    const enterprises = await Enterprise.findAll({
      attributes: ["id", "nom", "secteur", "adresse", "siteWeb", "description"]
    });
    res.status(200).send({
      count: enterprises.length,
      enterprises: enterprises
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la récupération des entreprises."
    });
  }
};

// Récupérer le profil de l'entreprise connectée
exports.getProfile = async (req, res) => {
  try {
    const entreprise = await Enterprise.findOne({
      where: { userId: req.userId },
      attributes: ["id", "nom", "secteur", "adresse", "siteWeb", "description"]
    });
    if (!entreprise) {
      return res.status(404).send({ message: "Profil entreprise non trouvé!" });
    }
    res.status(200).send({ entreprise });
  } catch (error) {
    res.status(500).send({ message: error.message || "Erreur lors de la récupération du profil entreprise." });
  }
};
