const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Student = db.student;
const Enterprise = db.enterprise;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Sequelize } = require("../models");

// Sign Up function
exports.signup = async (req, res) => {
  try {
    // Create user
    const user = await User.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      motdepasse: bcrypt.hashSync(req.body.motdepasse, 8),
      role: req.body.role
    });

    // Create profile based on role
    if (req.body.role === "etudiant") {
      await Student.create({
        userId: user.id,
        niveau: req.body.niveau || null,
        filiere: req.body.filiere || null
      });
    } else if (req.body.role === "entreprise") {
      await Enterprise.create({
        userId: user.id,
        nom: req.body.nomEntreprise,
        secteur: req.body.secteur || null,
        adresse: req.body.adresse || null,
        siteWeb: req.body.siteWeb || null,
        description: req.body.description || null
      });
    }

    res.status(200).send({ 
      message: "Utilisateur enregistré avec succès!",
      userId: user.id,
      role: user.role
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Sign In function
exports.signin = async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé." });
    }

    // Check password validity
    const passwordIsValid = bcrypt.compareSync(
      req.body.motdepasse,
      user.motdepasse
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Mot de passe incorrect!"
      });
    }

    // Check if user is active (except admin)
    if (user.role !== "admin" && !user.actif) {
      return res.status(403).send({
        message: "Votre compte est désactivé. Veuillez contacter l'administrateur."
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    // Respond with user data and token
    res.status(200).send({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
