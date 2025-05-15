const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const dotenv = require('dotenv');
const { sequelize, testConnection } = require('./config/db');


// Ajouter cette ligne avec les autres imports de modèles
require('./models/Job');

require('./models/Service');

// Importation correcte des modèles
// require('./models/Certification');
// require('./models/TeamMember');

const devisRoutes = require('./routes/devisRoutes');
// const certificationRoutes = require('./routes/certificationRoutes');
// const teamRoutes = require('./routes/teamRoutes');
const JobRoutes = require('./routes/JobRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes'); // Nouvelle route pour les rendez-vous
const emailRoutes = require('./routes/emailRoutes');
const contactRoutes = require('./routes/contactRoutes');


const ServicesRoute = require('./routes/ServiceRoutes');
const ProjectsRoutes = require('./routes/projectsRoutes');
// Chargement des variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Tester la connexion à la base de données
testConnection();

// Synchroniser les modèles avec la base de données
sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => console.log('Base de données synchronisée'))
  .catch(err => console.error('Erreur de synchronisation avec la base de données:', err));

// Dossier statique pour les uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api/services', ServicesRoute);
app.use('/api/projects', ProjectsRoutes);
// app.use('/api/testimonials', require('./routes/testimonials'));
// app.use('/api/blog', require('./routes/blog'));
app.use('/api/jobs', JobRoutes);
app.use('/api/settings', require('./routes/settings'));
// app.use('/api/auth', require('./routes/auth'));
app.use('/api/devis', devisRoutes);
app.use('/api/contact', contactRoutes);
//app.use('/api/appointments', require('./routes/appointmentRoutes'));
// app.use('/api/certifications', certificationRoutes);
// app.use('/api/team', teamRoutes);
app.use('/api/service-details', require('./routes/serviceDetailRoutes'));
app.use('/api/appointments', appointmentRoutes); // Nouvelle route pour les rendez-vous
app.use('/api/emails', emailRoutes);

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
