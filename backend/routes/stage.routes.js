const { authJwt } = require("../middleware");
const controller = require("../controllers/stage.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Route pour créer un stage (accessible aux étudiants)
  app.post(
    "/api/stages",
    [authJwt.verifyToken, authJwt.isStudent],
    controller.createStage
  );
};
