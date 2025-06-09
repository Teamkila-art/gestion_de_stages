const { authJwt } = require("../middleware");
const controller = require("../controllers/student.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Route pour récupérer le profil de l'étudiant connecté
  app.get(
    "/api/student/profile",
    [authJwt.verifyToken, authJwt.isStudent],
    controller.getProfile
  );
};
