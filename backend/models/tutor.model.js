module.exports = (sequelize, Sequelize) => {
  const Tutor = sequelize.define("tutor", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    fonction: {
      type: Sequelize.STRING,
      allowNull: false
    },
    nom: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return Tutor;
};
