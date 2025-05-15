// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config({ path: __dirname + '/../.env' });

// Vérifier que les variables sont bien chargées
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '****' : 'non défini');

// Importer les dépendances
const { Sequelize, DataTypes } = require('sequelize');

// Créer une connexion directe à la base de données avec les variables d'environnement
const sequelize = new Sequelize(
  process.env.DB_NAME || 'batihr_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log // Activer les logs pour voir les requêtes SQL
  }
);

// Définir le modèle Service directement dans ce script
const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 999,
  }
}, {
  timestamps: true
});

const seedServices = async () => {
  try {
    // Tester la connexion
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');

    // Synchroniser le modèle avec la base de données (créer la table)
    await sequelize.sync({ force: false }); // force: false pour ne pas supprimer la table si elle existe déjà
    console.log('Table Services synchronisée avec succès');

    // Données des services à insérer
    const servicesData = [
      {
        title: 'Plomberie',
        description: 'Des services de plomberie professionnels pour tous vos besoins résidentiels et commerciaux.',
        image: '../images/plomberie.webp',
        slug: 'plomberie',
        order: 1
      },
      {
        title: 'Couverture',
        description: 'Solutions complètes pour la réparation, l\'entretien et l\'installation de toitures de qualité.',
        image: '../images/couverture.webp',
        slug: 'couverture',
        order: 2
      },
      {
        title: 'Étanchéité',
        description: 'Services d\'étanchéité professionnels pour protéger votre bâtiment contre les infiltrations d\'eau.',
        image: '../images/etancheite.jpg',
        slug: 'etancheite',
        order: 3
      },
      {
        title: 'Fumisterie',
        description: 'Installation et entretien de systèmes de chauffage et d\'évacuation des fumées pour votre sécurité et confort.',
        image: '../images/funiste.jpg',
        slug: 'fumisterie',
        order: 4
      },
      {
        title: 'Travaux d\'accès difficiles',
        description: 'Solutions spécialisées pour les travaux en hauteur et les zones difficiles d\'accès.',
        image: '../images/diffaccLight.jpg',
        slug: 'acces-difficiles',
        order: 5
      }
    ];
    
    // Insérer les services dans la base de données
    await Service.bulkCreate(servicesData);
    
    console.log('Services insérés avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des services :', error);
  } finally {
    // Fermer la connexion
    await sequelize.close();
    process.exit(0);
  }
};

// Exécuter la fonction
seedServices();
