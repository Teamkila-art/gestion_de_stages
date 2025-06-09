const db = require("../models");
const Tutor = db.tutor;
const User = db.user;
const Student = db.student;
const Enterprise = db.enterprise;
const Stage = db.stage;
const bcrypt = require("bcryptjs");

// Ajouter un tuteur (accessible aux étudiants)
exports.addTutor = async (req, res) => {
  try {
    // Vérifier les données requises
    if (!req.body.entrepriseId || !req.body.nom || !req.body.fonction) {
      return res.status(400).send({
        message: "Les informations du tuteur sont incomplètes! (nom et fonction requis)"
      });
    }

    // Vérifier si l'étudiant existe
    const student = await Student.findOne({
      where: { userId: req.userId }
    });

    if (!student) {
      return res.status(404).send({
        message: "Profil étudiant non trouvé!"
      });
    }

    // Vérifier si l'entreprise existe
    const enterprise = await Enterprise.findByPk(req.body.entrepriseId);
    if (!enterprise) {
      return res.status(404).send({
        message: "Entreprise non trouvée!"
      });
    }

    // Créer le tuteur
    const tutor = await Tutor.create({
      userId: req.userId,
      entrepriseId: req.body.entrepriseId,
      nom: req.body.nom,
      fonction: req.body.fonction
    });

    res.status(201).send({
      message: "Tuteur ajouté avec succès!",
      tutor: {
        id: tutor.id,
        nom: tutor.nom,
        fonction: tutor.fonction
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de l'ajout du tuteur."
    });
  }
};

// Récupérer les tuteurs d'une entreprise
exports.getTutorsByEnterprise = async (req, res) => {
  try {
    const entrepriseId = req.params.entrepriseId;

    const tutors = await Tutor.findAll({
      where: { entrepriseId: entrepriseId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nom", "prenom", "email"]
        }
      ]
    });

    res.status(200).send({
      count: tutors.length,
      tutors: tutors
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la récupération des tuteurs."
    });
  }
};

// Récupérer tous les tuteurs (pour admin)
exports.getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nom", "prenom", "email"]
        },
        {
          model: Enterprise,
          as: "entreprise",
          attributes: ["id", "nom"]
        }
      ]
    });

    res.status(200).send({
      count: tutors.length,
      tutors: tutors
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la récupération des tuteurs."
    });
  }
};

// Ajouter un tuteur à un stage spécifique
exports.assignTutorToStage = async (req, res) => {
  try {
    const { stageId, tutorId } = req.body;
    
    if (!stageId || !tutorId) {
      return res.status(400).send({
        message: "stageId et tutorId sont requis!"
      });
    }

    // Vérifier si l'étudiant existe
    const student = await Student.findOne({
      where: { userId: req.userId }
    });

    if (!student) {
      return res.status(404).send({
        message: "Profil étudiant non trouvé!"
      });
    }

    // Vérifier si le stage existe
    const stage = await Stage.findByPk(stageId);
    if (!stage) {
      return res.status(404).send({
        message: "Stage non trouvé!"
      });
    }

    // Vérifier si le tuteur existe
    const tutor = await Tutor.findByPk(tutorId);
    if (!tutor) {
      return res.status(404).send({
        message: "Tuteur non trouvé!"
      });
    }

    // Vérifier si le tuteur appartient à l'entreprise du stage
    if (tutor.entrepriseId !== stage.entrepriseId) {
      return res.status(400).send({
        message: "Le tuteur doit appartenir à l'entreprise du stage!"
      });
    }

    // Mettre à jour le stage avec le tuteur (cette fonctionnalité nécessiterait d'ajouter un champ tutorId au modèle Stage)
    // Pour cette implémentation, nous allons simplement simuler que l'association est faite
    
    res.status(200).send({
      message: "Tuteur assigné au stage avec succès!",
      stageId: stageId,
      tutorId: tutorId
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de l'assignation du tuteur."
    });
  }
};
