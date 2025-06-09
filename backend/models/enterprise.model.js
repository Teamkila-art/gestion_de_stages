module.exports = (sequelize, Sequelize) => {
  const Enterprise = sequelize.define("enterprise", {
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
    nom: {
      type: Sequelize.STRING,
      allowNull: false
    },
    secteur: {
      type: Sequelize.STRING,
      allowNull: true
    },
    adresse: {
      type: Sequelize.STRING,
      allowNull: true
    },
    siteWeb: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  });

  return Enterprise;
};
