const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Service = require('./Service');

const ServiceDetail = sequelize.define('ServiceDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Service,
      key: 'id'
    }
  },
  fullDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  features: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('features');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('features', JSON.stringify(value));
    }
  },
  gallery: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('gallery');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('gallery', JSON.stringify(value));
    }
  }
}, {
  timestamps: true
});

// Définir la relation avec Service
ServiceDetail.belongsTo(Service, { foreignKey: 'serviceId' });
Service.hasOne(ServiceDetail, { foreignKey: 'serviceId' });

module.exports = ServiceDetail;
