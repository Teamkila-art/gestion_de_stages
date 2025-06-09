const db = require("../models");
const Candidature = db.candidature;
const Stage = db.stage;
const Student = db.student;
const Enterprise = db.enterprise;
const User = db.user;
const Op = db.Sequelize.Op;

// Créer une nouvelle candidature - Étudiant
exports.createCandidature = async (req, res) => {
  try {
    // Vérifier si stageId est fourni
    if (!req.body.stageId) {
      return res.status(400).send({
        message: "Le stageId est requis!"
      });
    }

    // Récupérer l'ID de l'étudiant à partir de req.userId
    const student = await Student.findOne({
      where: { userId: req.userId }
    });

    if (!student) {
      return res.status(404).send({
        message: "Profil étudiant non trouvé!"
      });
    }

    // Récupérer le stage
    const stage = await Stage.findByPk(req.body.stageId);
    if (!stage) {
      return res.status(404).send({
        message: "Stage non trouvé!"
      });
    }

    // Vérifier si l'étudiant a déjà candidaté à ce stage
    const existingCandidature = await Candidature.findOne({
      where: {
        stageId: req.body.stageId,
        etudiantId: student.id
      }
    });

    if (existingCandidature) {
      return res.status(400).send({
        message: "Vous avez déjà postulé à ce stage!"
      });
    }

    // Créer la candidature
    const candidature = {
      stageId: req.body.stageId,
      etudiantId: student.id,
      entrepriseId: stage.entrepriseId,
      status: "en attente",
      datePostulation: new Date()
    };

    // Sauvegarder la candidature
    const newCandidature = await Candidature.create(candidature);

    res.status(201).send({
      message: "Candidature soumise avec succès!",
      candidature: {
        id: newCandidature.id,
        stageId: newCandidature.stageId,
        datePostulation: newCandidature.datePostulation,
        status: newCandidature.status
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la création de la candidature."
    });
  }
};

// Récupérer toutes les candidatures d'un étudiant
exports.getEtudiantCandidatures = async (req, res) => {
  try {
    // Récupérer l'ID de l'étudiant
    const student = await Student.findOne({
      where: { userId: req.userId }
    });

    if (!student) {
      return res.status(404).send({
        message: "Profil étudiant non trouvé!"
      });
    }

    // Récupérer les candidatures
    const candidatures = await Candidature.findAll({
      where: { etudiantId: student.id },
      include: [
        {
          model: Stage,
          as: "stage",
          include: [
            {
              model: Enterprise,
              as: "entreprise",
              attributes: ["id", "nom", "secteur"]
            }
          ]
        }
      ],
      order: [["datePostulation", "DESC"]]
    });

    res.status(200).send({
      count: candidatures.length,
      candidatures: candidatures
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la récupération des candidatures."
    });
  }
};

// Récupérer les candidatures pour une entreprise
exports.getEntrepriseCandidatures = async (req, res) => {
  try {
    // Récupérer l'ID de l'entreprise
    const enterprise = await Enterprise.findOne({
      where: { userId: req.userId }
    });

    if (!enterprise) {
      return res.status(404).send({
        message: "Profil entreprise non trouvé!"
      });
    }

    // Récupérer les candidatures pour les stages de cette entreprise
    const candidatures = await Candidature.findAll({
      where: { entrepriseId: enterprise.id },
      include: [
        {
          model: Stage,
          as: "stage"
        },
        {
          model: Student,
          as: "etudiant",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["nom", "prenom", "email"]
            }
          ],
          attributes: ["id", "niveau", "filiere", "cv", "lettreMotivation"]
        }
      ],
      order: [["datePostulation", "DESC"]]
    });

    res.status(200).send({
      count: candidatures.length,
      candidatures: candidatures
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la récupération des candidatures."
    });
  }
};

// Valider une candidature - Entreprise
exports.validerCandidature = async (req, res) => {
  try {
    const candidatureId = req.params.id;

    // Récupérer l'ID de l'entreprise
    const enterprise = await Enterprise.findOne({
      where: { userId: req.userId }
    });

    if (!enterprise) {
      return res.status(404).send({
        message: "Profil entreprise non trouvé!"
      });
    }

    // Vérifier si la candidature existe et appartient à l'entreprise
    const candidature = await Candidature.findOne({
      where: { 
        id: candidatureId,
        entrepriseId: enterprise.id
      }
    });

    if (!candidature) {
      return res.status(404).send({
        message: "Candidature non trouvée ou vous n'avez pas les droits pour la modifier!"
      });
    }

    // Mettre à jour le statut
    candidature.status = "acceptée";
    await candidature.save();

    res.status(200).send({
      message: "Candidature acceptée avec succès!",
      candidature: {
        id: candidature.id,
        status: candidature.status,
        dateModification: candidature.updatedAt
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la validation de la candidature."
    });
  }
};

// Refuser une candidature - Entreprise
exports.refuserCandidature = async (req, res) => {
  try {
    const candidatureId = req.params.id;

    // Récupérer l'ID de l'entreprise
    const enterprise = await Enterprise.findOne({
      where: { userId: req.userId }
    });

    if (!enterprise) {
      return res.status(404).send({
        message: "Profil entreprise non trouvé!"
      });
    }

    // Vérifier si la candidature existe et appartient à l'entreprise
    const candidature = await Candidature.findOne({
      where: { 
        id: candidatureId,
        entrepriseId: enterprise.id
      }
    });

    if (!candidature) {
      return res.status(404).send({
        message: "Candidature non trouvée ou vous n'avez pas les droits pour la modifier!"
      });
    }

    // Mettre à jour le statut
    candidature.status = "refusée";
    await candidature.save();

    res.status(200).send({
      message: "Candidature refusée avec succès!",
      candidature: {
        id: candidature.id,
        status: candidature.status,
        dateModification: candidature.updatedAt
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors du refus de la candidature."
    });
  }
};

// Ajouter ou modifier un commentaire - Entreprise
exports.ajouterCommentaire = async (req, res) => {
  try {
    const candidatureId = req.params.id;

    // Vérifier si le commentaire est fourni
    if (!req.body.commentaire) {
      return res.status(400).send({
        message: "Le commentaire ne peut pas être vide!"
      });
    }

    // Récupérer l'ID de l'entreprise
    const enterprise = await Enterprise.findOne({
      where: { userId: req.userId }
    });

    if (!enterprise) {
      return res.status(404).send({
        message: "Profil entreprise non trouvé!"
      });
    }

    // Vérifier si la candidature existe et appartient à l'entreprise
    const candidature = await Candidature.findOne({
      where: { 
        id: candidatureId,
        entrepriseId: enterprise.id
      }
    });

    if (!candidature) {
      return res.status(404).send({
        message: "Candidature non trouvée ou vous n'avez pas les droits pour la modifier!"
      });
    }

    // Ajouter le commentaire
    candidature.commentaireEntreprise = req.body.commentaire;
    await candidature.save();

    res.status(200).send({
      message: "Commentaire ajouté avec succès!",
      candidature: {
        id: candidature.id,
        commentaireEntreprise: candidature.commentaireEntreprise,
        dateModification: candidature.updatedAt
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de l'ajout du commentaire."
    });
  }
};

// Admin - Récupérer toutes les candidatures
exports.getAllCandidatures = async (req, res) => {
  try {
    const candidatures = await Candidature.findAll({
      include: [
        {
          model: Stage,
          as: "stage",
          include: [
            {
              model: Enterprise,
              as: "entreprise",
              attributes: ["id", "nom", "secteur"]
            }
          ]
        },
        {
          model: Student,
          as: "etudiant",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["nom", "prenom", "email"]
            }
          ],
          attributes: ["id", "niveau", "filiere"]
        }
      ],
      order: [["datePostulation", "DESC"]]
    });

    res.status(200).send({
      count: candidatures.length,
      candidatures: candidatures
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la récupération des candidatures."
    });
  }
};

// Entreprise - Changer le statut d'une candidature
exports.updateStatutEntreprise = async (req, res) => {
  try {
    const candidatureId = req.params.id;
    const { status } = req.body;
    if (!status || !["en attente", "acceptée", "refusée"].includes(status)) {
      return res.status(400).send({
        message: "Statut invalide! Les statuts acceptés sont: en attente, acceptée, refusée"
      });
    }
    // Récupérer l'entreprise à partir du userId
    const enterprise = await Enterprise.findOne({ where: { userId: req.userId } });
    if (!enterprise) {
      return res.status(404).send({ message: "Profil entreprise non trouvé!" });
    }
    // Vérifier que la candidature appartient à cette entreprise
    const candidature = await Candidature.findOne({ where: { id: candidatureId, entrepriseId: enterprise.id } });
    if (!candidature) {
      return res.status(404).send({ message: "Candidature non trouvée ou vous n'avez pas les droits pour la modifier!" });
    }
    candidature.status = status;
    await candidature.save();
    res.status(200).send({
      message: "Statut de la candidature mis à jour avec succès!",
      candidature: {
        id: candidature.id,
        status: candidature.status,
        dateModification: candidature.updatedAt
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la mise à jour du statut de la candidature."
    });
  }
};

// Admin - Changer le statut d'une candidature
exports.updateStatut = async (req, res) => {
  try {
    const candidatureId = req.params.id;
    const { status } = req.body;

    // Vérifier si le statut est valide
    if (!status || !["en attente", "acceptée", "refusée"].includes(status)) {
      return res.status(400).send({
        message: "Statut invalide! Les statuts acceptés sont: en attente, acceptée, refusée"
      });
    }

    // Trouver la candidature
    const candidature = await Candidature.findByPk(candidatureId);

    if (!candidature) {
      return res.status(404).send({
        message: "Candidature non trouvée!"
      });
    }

    // Mettre à jour le statut
    candidature.status = status;
    await candidature.save();

    res.status(200).send({
      message: "Statut de la candidature mis à jour avec succès!",
      candidature: {
        id: candidature.id,
        status: candidature.status,
        dateModification: candidature.updatedAt
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la mise à jour du statut de la candidature."
    });
  }
};

// Admin - Supprimer une candidature
exports.deleteCandidature = async (req, res) => {
  try {
    const candidatureId = req.params.id;

    // Trouver la candidature
    const candidature = await Candidature.findByPk(candidatureId);

    if (!candidature) {
      return res.status(404).send({
        message: "Candidature non trouvée!"
      });
    }

    // Supprimer la candidature
    await candidature.destroy();

    res.status(200).send({
      message: "Candidature supprimée avec succès!"
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la suppression de la candidature."
    });
  }
};
