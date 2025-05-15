const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Devis = sequelize.define('Devis', {
  devisId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  // Informations client
  client_nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  client_prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  client_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  client_telephone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  client_adresse: {
    type: DataTypes.STRING,
    allowNull: true
  },
  client_codePostal: {
    type: DataTypes.STRING,
    allowNull: true
  },
  client_ville: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Informations projet
  projet_type: {
    type: DataTypes.ENUM('renovation', 'construction', 'extension', 'amenagement', 'autre'),
    allowNull: false
  },
  projet_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  projet_budget: {
    type: DataTypes.STRING,
    allowNull: true
  },
  projet_delai: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Statut et notes
  status: {
    type: DataTypes.ENUM('nouveau', 'en_cours', 'traite', 'archive'),
    defaultValue: 'nouveau'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Timestamps automatiques
  dateCreation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  dateMiseAJour: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'devis',
  timestamps: true,
  createdAt: 'dateCreation',
  updatedAt: 'dateMiseAJour'
});

// Modèle pour les documents associés à un devis
const DevisDocument = sequelize.define('DevisDocument', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'devis_documents',
  timestamps: true
});

// Relation entre Devis et DevisDocument
Devis.hasMany(DevisDocument, { as: 'documents', foreignKey: 'devisId' });
DevisDocument.belongsTo(Devis, { foreignKey: 'devisId' });

module.exports = { Devis, DevisDocument };
