// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config({ path: __dirname + '/../.env' });

// Vérifier que les variables sont bien chargées
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '****' : 'non défini');

// Importer les dépendances
const { Sequelize } = require('sequelize');

// Créer une connexion directe à la base de données avec les variables d'environnement
const sequelize = new Sequelize(
  process.env.DB_NAME || 'batihr_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

// Importer les modèles après avoir créé l'instance Sequelize
// Ces modèles doivent être définis avec la même instance Sequelize
const Certification = require('../models/Certification');
const TeamMember = require('../models/TeamMember');

const seedDatabase = async () => {
  try {
    // Tester la connexion
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');

    // Synchroniser les modèles avec la base de données
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Créer des certifications de test
    const certifications = [
      {
        name: 'ISO 9001',
        issuer: 'Organisation internationale de normalisation',
        description: 'Certification de système de management de la qualité',
        year: 2020,
        imageUrl: '/images/certifications/iso9001.jpg',
      },
      {
        name: 'RGE Qualibat',
        issuer: 'Qualibat',
        description: 'Reconnu Garant de l\'Environnement pour les travaux d\'efficacité énergétique',
        year: 2019,
        imageUrl: '/images/certifications/rge-qualibat.jpg',
      },
      {
        name: 'Certification Qualifelec',
        issuer: 'Qualifelec',
        description: 'Qualification professionnelle des entreprises de l\'équipement électrique',
        year: 2021,
        imageUrl: '/images/certifications/qualifelec.jpg',
      },
    ];

    await Certification.bulkCreate(certifications);
    console.log('Certifications created');

    // Créer des membres d'équipe de test
    const teamMembers = [
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        position: 'Directeur Général',
        bio: 'Avec plus de 20 ans d\'expérience dans le secteur du bâtiment, Jean dirige BATIHR+ avec passion et expertise.',
        email: 'jean.dupont@batihrplus.fr',
        phone: '01 23 45 67 89',
        imageUrl: '/images/team/jean-dupont.jpg',
        order: 1,
      },
      {
        firstName: 'Marie',
        lastName: 'Laurent',
        position: 'Responsable Technique',
        bio: 'Ingénieure de formation, Marie supervise tous les aspects techniques de nos projets et garantit leur conformité.',
        email: 'marie.laurent@batihrplus.fr',
        phone: '01 23 45 67 90',
        imageUrl: '/images/team/marie-laurent.jpg',
        order: 2,
      },
      {
        firstName: 'Thomas',
        lastName: 'Moreau',
        position: 'Chef de Projet',
        bio: 'Thomas coordonne nos équipes sur le terrain et assure le suivi rigoureux de chaque chantier.',
        email: 'thomas.moreau@batihrplus.fr',
        phone: '01 23 45 67 91',
        imageUrl: '/images/team/thomas-moreau.jpg',
        order: 3,
      },
      {
        firstName: 'Sophie',
        lastName: 'Petit',
        position: 'Responsable Commerciale',
        bio: 'Sophie est à l\'écoute de vos besoins pour vous proposer des solutions adaptées à votre projet.',
        email: 'sophie.petit@batihrplus.fr',
        phone: '01 23 45 67 92',
        imageUrl: '/images/team/sophie-petit.jpg',
        order: 4,
      },
    ];

    await TeamMember.bulkCreate(teamMembers);
    console.log('Team members created');

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Fermer la connexion à la base de données
    await sequelize.close();
    process.exit(0);
  }
};

// Exécuter la fonction de seeding
seedDatabase();
