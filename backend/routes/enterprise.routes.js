const { authJwt } = require("../middleware");
const controller = require("../controllers/enterprise.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Route pour récupérer le profil de l'entreprise connectée
  app.get(
    "/api/entreprise/profile",
    [authJwt.verifyToken, authJwt.isEnterprise],
    controller.getProfile
  );

  // Route pour récupérer toutes les entreprises (accessible aux étudiants)
  app.get(
    "/api/enterprises",
    [authJwt.verifyToken, authJwt.isStudent],
    controller.getAllEnterprises
  );
};
