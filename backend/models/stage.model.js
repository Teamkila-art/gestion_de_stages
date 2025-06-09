module.exports = (sequelize, Sequelize) => {
  const Stage = sequelize.define("stage", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titre: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    dateDebut: {
      type: Sequelize.DATE,
      allowNull: false
    },
    dateFin: {
      type: Sequelize.DATE,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "ouvert",
      validate: {
        isIn: [['ouvert', 'pourvu', 'terminé', 'annulé']]
      }
    },
    entrepriseId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'enterprises',
        key: 'id'
      }
    }
  });

  return Stage;
};
