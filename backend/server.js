const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();

// Configure CORS options
const corsOptions = {
  origin: "http://localhost:3001", // Frontend URL
  credentials: true
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API de gestion de stages." });
});

// Import authentication routes
require('./routes/auth.routes')(app);

// Import candidature routes
require('./routes/candidature.routes')(app);

// Import tutor routes
require('./routes/tutor.routes')(app);

// Import admin routes
require('./routes/admin.routes')(app);

// Import enterprise routes
require('./routes/enterprise.routes')(app);

// Import stage routes
require('./routes/stage.routes')(app);

// Import student routes
require('./routes/student.routes')(app);

// Set port and listen for requests
const PORT = process.env.PORT || 5000;

// Sync database and start server
db.sequelize.sync() // Using default sync mode to avoid key limitation errors
  .then(() => {
    console.log("Database synchronized!");
    
    // Create initial admin user if needed
    const bcrypt = require('bcryptjs');
    const User = db.user;
    User.findOrCreate({
      where: { email: 'admin@email.com' },
      defaults: {
        nom: 'Admin',
        prenom: 'User',
        motdepasse: bcrypt.hashSync('admin1234', 8),
        role: 'admin',
        actif: true,
        dateInscription: new Date()
      }
    }).then(() => {
      console.log('Admin user ensured in DB (email: admin@email.com, password: admin1234)');
    });
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });
