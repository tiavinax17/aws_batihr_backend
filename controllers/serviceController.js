const Service = require('../models/Service');

// Récupérer tous les services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      order: [['order', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des services',
      error: error.message
    });
  }
};

// Récupérer un service par son slug
exports.getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const service = await Service.findOne({
      where: { slug }
    });
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du service',
      error: error.message
    });
  }
};
