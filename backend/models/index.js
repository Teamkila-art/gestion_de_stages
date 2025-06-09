const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.user = require("./user.model.js")(sequelize, Sequelize);
db.student = require("./student.model.js")(sequelize, Sequelize);
db.enterprise = require("./enterprise.model.js")(sequelize, Sequelize);
db.student.belongsTo(db.user, { foreignKey: "userId", as: "studentUser" });
// db.student.belongsTo(db.user, { foreignKey: "userId", as: "user" }); // Removed duplicate association
db.stage = require("./stage.model.js")(sequelize, Sequelize);
db.candidature = require("./candidature.model.js")(sequelize, Sequelize);
db.tutor = require("./tutor.model.js")(sequelize, Sequelize);

// Define associations
db.user.hasOne(db.student, {
  foreignKey: "userId",
  as: "student"
});

db.user.hasOne(db.enterprise, {
  foreignKey: "userId",
  as: "enterprise"
});

db.student.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user"
});

db.enterprise.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user"
});

// Associations pour Stage
db.stage.belongsTo(db.enterprise, {
  foreignKey: "entrepriseId",
  as: "entreprise"
});

db.enterprise.hasMany(db.stage, {
  foreignKey: "entrepriseId",
  as: "stages"
});

// Associations pour Candidature
db.candidature.belongsTo(db.stage, {
  foreignKey: "stageId",
  as: "stage"
});

db.candidature.belongsTo(db.student, {
  foreignKey: "etudiantId",
  as: "etudiant"
});

db.candidature.belongsTo(db.enterprise, {
  foreignKey: "entrepriseId",
  as: "entreprise"
});

db.stage.hasMany(db.candidature, {
  foreignKey: "stageId",
  as: "candidatures"
});

db.student.hasMany(db.candidature, {
  foreignKey: "etudiantId",
  as: "candidatures"
});

db.enterprise.hasMany(db.candidature, {
  foreignKey: "entrepriseId",
  as: "candidatures"
});

// Associations pour Tuteur
db.tutor.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user"
});

db.tutor.belongsTo(db.enterprise, {
  foreignKey: "entrepriseId",
  as: "entreprise"
});

db.enterprise.hasMany(db.tutor, {
  foreignKey: "entrepriseId",
  as: "tutors"
});

db.user.hasOne(db.tutor, {
  foreignKey: "userId",
  as: "tutor"
});

module.exports = db;
