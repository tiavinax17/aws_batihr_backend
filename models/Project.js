const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fullDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING, // renovation, construction, extension, amenagement
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  client: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  surface: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gallery: {
    type: DataTypes.TEXT, // Stocké comme JSON stringifié
    allowNull: true,
    get() {
      const value = this.getDataValue('gallery');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('gallery', JSON.stringify(value));
    }
  },
  testimonial: {
    type: DataTypes.TEXT, // Stocké comme JSON stringifié
    allowNull: true,
    get() {
      const value = this.getDataValue('testimonial');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('testimonial', JSON.stringify(value));
    }
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  timestamps: true
});

module.exports = Project;
