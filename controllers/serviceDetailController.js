const Service = require('../models/Service');
const ServiceDetail = require('../models/ServiceDetail');

// Récupérer les détails d'un service par son slug
exports.getServiceDetailBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Trouver le service par son slug
    const service = await Service.findOne({
      where: { slug, active: true }
    });
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }
    
    // Récupérer les détails du service
    const serviceDetail = await ServiceDetail.findOne({
      where: { serviceId: service.id }
    });
    
    if (!serviceDetail) {
      return res.status(404).json({
        success: false,
        message: 'Détails du service non trouvés'
      });
    }
    
    // Combiner les données du service et ses détails
    const serviceData = {
      id: service.id,
      title: service.title,
      description: service.description,
      image: service.image,
      slug: service.slug,
      fullDescription: serviceDetail.fullDescription,
      features: serviceDetail.features,
      gallery: serviceDetail.gallery
    };
    
    return res.status(200).json({
      success: true,
      data: serviceData
    });
  } catch (error) {
    console.error('Error fetching service details:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des détails du service',
      error: error.message
    });
  }
};

// Créer ou mettre à jour les détails d'un service
exports.createOrUpdateServiceDetail = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { fullDescription, features, gallery } = req.body;
    
    // Vérifier si le service existe
    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }
    
    // Vérifier si les détails du service existent déjà
    let serviceDetail = await ServiceDetail.findOne({
      where: { serviceId }
    });
    
    if (serviceDetail) {
      // Mettre à jour les détails existants
      serviceDetail = await serviceDetail.update({
        fullDescription,
        features,
        gallery
      });
    } else {
      // Créer de nouveaux détails
      serviceDetail = await ServiceDetail.create({
        serviceId,
        fullDescription,
        features,
        gallery
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Détails du service enregistrés avec succès',
      data: serviceDetail
    });
  } catch (error) {
    console.error('Error saving service details:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement des détails du service',
      error: error.message
    });
  }
};
