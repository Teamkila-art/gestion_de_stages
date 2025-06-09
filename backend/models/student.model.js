module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("student", {
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
    niveau: {
      type: Sequelize.STRING,
      allowNull: true
    },
    filiere: {
      type: Sequelize.STRING,
      allowNull: true
    },
    cv: {
      type: Sequelize.STRING,
      allowNull: true
    },
    lettreMotivation: {
      type: Sequelize.STRING,
      allowNull: true
    }
  });

  return Student;
};
