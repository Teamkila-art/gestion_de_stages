const { authJwt } = require("../middleware");
const controller = require("../controllers/admin.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Middleware pour vérifier si l'utilisateur est authentifié et est admin
  const verifyToken = authJwt.verifyToken;
  const isAdmin = authJwt.isAdmin;

  // Routes de gestion des utilisateurs (admin uniquement)
  app.get(
    "/api/admin/utilisateurs",
    [verifyToken, isAdmin],
    controller.getAllUsers
  );

  app.put(
    "/api/admin/utilisateur/:id/activer",
    [verifyToken, isAdmin],
    controller.activateUser
  );

  app.put(
    "/api/admin/utilisateur/:id/desactiver",
    [verifyToken, isAdmin],
    controller.deactivateUser
  );

  // Route pour les statistiques
  app.get(
    "/api/admin/statistiques",
    [verifyToken, isAdmin],
    controller.getStatistics
  );
};
