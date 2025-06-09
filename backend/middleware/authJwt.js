const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

// Verify token from the request
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "Aucun token fourni!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Non autorisé!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

// Verify if user has admin role
isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user.role === "admin") {
      next();
      return;
    }
    
    res.status(403).send({
      message: "Rôle d'administrateur requis!"
    });
  } catch (error) {
    res.status(500).send({
      message: "Impossible de valider le rôle d'utilisateur!"
    });
  }
};

// Verify if user has student role
isStudent = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user.role === "etudiant") {
      next();
      return;
    }
    
    res.status(403).send({
      message: "Rôle d'étudiant requis!"
    });
  } catch (error) {
    res.status(500).send({
      message: "Impossible de valider le rôle d'utilisateur!"
    });
  }
};

// Verify if user has enterprise role
isEnterprise = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user.role === "entreprise") {
      next();
      return;
    }
    
    res.status(403).send({
      message: "Rôle d'entreprise requis!"
    });
  } catch (error) {
    res.status(500).send({
      message: "Impossible de valider le rôle d'utilisateur!"
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isStudent,
  isEnterprise
};

module.exports = authJwt;
