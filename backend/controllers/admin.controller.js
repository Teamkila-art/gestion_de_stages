const db = require("../models");
const User = db.user;
const Student = db.student;
const Enterprise = db.enterprise;
const Stage = db.stage;
const Candidature = db.candidature;
const { Sequelize } = db;
const Op = db.Sequelize.Op;

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nom', 'prenom', 'email', 'role', 'dateInscription', 'actif'],
      include: [
        {
          model: Student,
          as: "student",
          required: false
        },
        {
          model: Enterprise,
          as: "enterprise",
          required: false
        }
      ],
      order: [['dateInscription', 'DESC']]
    });

    res.status(200).send({
      count: users.length,
      utilisateurs: users.map(user => ({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        dateInscription: user.dateInscription,
        actif: user.actif,
        detailsEtudiant: user.student,
        detailsEntreprise: user.enterprise
      }))
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la récupération des utilisateurs."
    });
  }
};

// Activer un compte utilisateur
exports.activateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).send({
        message: "Utilisateur non trouvé!"
      });
    }

    // Mise à jour du statut
    user.actif = true;
    await user.save();

    res.status(200).send({
      message: "Compte utilisateur activé avec succès!",
      utilisateur: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        actif: user.actif
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de l'activation du compte utilisateur."
    });
  }
};

// Désactiver un compte utilisateur
exports.deactivateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).send({
        message: "Utilisateur non trouvé!"
      });
    }

    // Mise à jour du statut
    user.actif = false;
    await user.save();

    res.status(200).send({
      message: "Compte utilisateur désactivé avec succès!",
      utilisateur: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        actif: user.actif
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la désactivation du compte utilisateur."
    });
  }
};

// Obtenir les statistiques des candidatures par statut
exports.getStatistics = async (req, res) => {
  try {
    // Compter le nombre de candidatures par statut
    const candidatureStats = await Candidature.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Transformer le résultat en format demandé
    const stats = {};
    candidatureStats.forEach(stat => {
      const status = stat.status;
      // Transformer les clés pour le format demandé
      let formattedStatus;
      switch(status) {
        case 'en attente':
          formattedStatus = 'en_attente';
          break;
        case 'acceptée':
          formattedStatus = 'valide';
          break;
        case 'refusée':
          formattedStatus = 'refuse';
          break;
        default:
          formattedStatus = status.replace(' ', '_').toLowerCase();
      }
      stats[formattedStatus] = parseInt(stat.get('count'));
    });

    // S'assurer que toutes les clés existent avec une valeur par défaut de 0
    if (!stats.hasOwnProperty('en_attente')) stats.en_attente = 0;
    if (!stats.hasOwnProperty('valide')) stats.valide = 0;
    if (!stats.hasOwnProperty('refuse')) stats.refuse = 0;

    res.status(200).send(stats);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Une erreur est survenue lors de la récupération des statistiques."
    });
  }
};
