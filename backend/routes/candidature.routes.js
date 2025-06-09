const { authJwt } = require("../middleware");
const controller = require("../controllers/candidature.controller");

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

  // Routes pour étudiant
  app.post(
    "/api/candidatures",
    [verifyToken, isStudent],
    controller.createCandidature
  );

  app.get(
    "/api/candidatures/etudiant",
    [verifyToken, isStudent],
    controller.getEtudiantCandidatures
  );

  // Routes pour entreprise
  app.get(
    "/api/candidatures/entreprise",
    [verifyToken, isEnterprise],
    controller.getEntrepriseCandidatures
  );

  app.put(
    "/api/candidatures/:id/valider",
    [verifyToken, isEnterprise],
    controller.validerCandidature
  );

  app.put(
    "/api/candidatures/:id/refuser",
    [verifyToken, isEnterprise],
    controller.refuserCandidature
  );

  app.put(
    "/api/candidatures/:id/commentaire",
    [verifyToken, isEnterprise],
    controller.ajouterCommentaire
  );

  // Routes pour admin
  app.get(
    "/api/candidatures",
    [verifyToken, isAdmin],
    controller.getAllCandidatures
  );

  app.put(
    "/api/candidatures/:id/statut",
    [verifyToken, isEnterprise],
    controller.updateStatutEntreprise
  );

  app.put(
    "/api/candidatures/:id/statut",
    [verifyToken, isAdmin],
    controller.updateStatut
  );

  app.delete(
    "/api/candidatures/:id",
    [verifyToken, isAdmin],
    controller.deleteCandidature
  );
};
