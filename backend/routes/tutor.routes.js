const { authJwt } = require("../middleware");
const controller = require("../controllers/tutor.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Middleware pour vérifier si l'utilisateur est authentifié
  const verifyToken = authJwt.verifyToken;
  
  // Middleware pour vérifier les rôles
  const isAdmin = authJwt.isAdmin;
  const isStudent = authJwt.isStudent;
  const isEnterprise = authJwt.isEnterprise;

  // Route pour ajouter un tuteur (accessible aux étudiants)
  app.post(
    "/api/tutors",
    [verifyToken, isStudent],
    controller.addTutor
  );

  // Route pour obtenir les tuteurs d'une entreprise spécifique
  app.get(
    "/api/tutors/enterprise/:entrepriseId",
    [verifyToken],
    controller.getTutorsByEnterprise
  );

  // Route pour assigner un tuteur à un stage (accessible aux étudiants)
  app.post(
    "/api/tutors/assign",
    [verifyToken, isStudent],
    controller.assignTutorToStage
  );

  // Route pour obtenir tous les tuteurs (accessible aux admins)
  app.get(
    "/api/tutors",
    [verifyToken, isAdmin],
    controller.getAllTutors
  );
};
