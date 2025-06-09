const db = require("../models");
const User = db.user;

// Check duplicate email
checkDuplicateEmail = async (req, res, next) => {
  try {
    // Check email
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (user) {
      return res.status(400).send({
        message: "Échec! L'email est déjà utilisé!"
      });
    }

    next();
  } catch (error) {
    res.status(500).send({
      message: "Impossible de valider l'email!"
    });
  }
};

// Check if role is valid
checkRoleExists = (req, res, next) => {
  if (req.body.role) {
    if (!["etudiant", "entreprise", "admin"].includes(req.body.role)) {
      res.status(400).send({
        message: "Échec! Le rôle n'existe pas = " + req.body.role
      });
      return;
    }
  }
  
  next();
};

// Additional validation for enterprise signup
validateEnterpriseSignup = (req, res, next) => {
  if (req.body.role === "entreprise" && !req.body.nomEntreprise) {
    return res.status(400).send({
      message: "Le nom de l'entreprise est requis pour un compte entreprise!"
    });
  }
  next();
};

const verifySignUp = {
  checkDuplicateEmail,
  checkRoleExists,
  validateEnterpriseSignup
};

module.exports = verifySignUp;
