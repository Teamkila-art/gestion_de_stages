module.exports = (sequelize, Sequelize) => {
  const Candidature = sequelize.define("candidature", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    stageId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'stages',
        key: 'id'
      }
    },
    etudiantId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      }
    },
    entrepriseId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'enterprises',
        key: 'id'
      }
    },
    datePostulation: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "en attente",
      validate: {
        isIn: [['en attente', 'acceptée', 'refusée']]
      }
    },
    commentaireEntreprise: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  });

  return Candidature;
};
