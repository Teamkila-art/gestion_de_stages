const db = require("../models");
const Student = db.student;
const User = db.user;

// GET /api/student/profile - get current student's profile (with user info)
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.userId },
      include: [{ model: User, as: 'studentUser', attributes: ["nom", "prenom", "email"] }]
    });
    if (!student) {
      return res.status(404).send({ message: "Profil étudiant non trouvé!" });
    }
    res.status(200).send({
      student: {
        nom: student.studentUser.nom + " " + student.studentUser.prenom,
        email: student.studentUser.email,
        filiere: student.filiere,
        niveau: student.niveau,
        description: student.description || ""
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Erreur lors de la récupération du profil étudiant." });
  }
};
