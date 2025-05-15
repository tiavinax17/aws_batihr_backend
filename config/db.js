const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Configuration de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? false: console.log,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');
    return true;
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};
