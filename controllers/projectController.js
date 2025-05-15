const Project = require('../models/Project');
const { Op } = require('sequelize');

// Récupérer tous les projets actifs
exports.getAllProjects = async (req, res) => {
  try {
    const category = req.query.category;
    
    // Construire la requête avec ou sans filtre de catégorie
    const whereClause = { active: true };
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    
    const projects = await Project.findAll({
      where: whereClause,
      order: [['year', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des projets',
      error: error.message
    });
  }
};

// Récupérer un projet par son slug
exports.getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { 
        slug: req.params.slug,
        active: true
      }
    });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du projet',
      error: error.message
    });
  }
};

// Récupérer les projets similaires (même catégorie)
exports.getSimilarProjects = async (req, res) => {
  try {
    const { slug, category } = req.params;
    
    const similarProjects = await Project.findAll({
      where: { 
        category,
        slug: { [Op.ne]: slug }, // Exclure le projet actuel
        active: true
      },
      limit: 3,
      order: [['year', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: similarProjects
    });
  } catch (error) {
    console.error('Error fetching similar projects:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des projets similaires',
      error: error.message
    });
  }
};

// Récupérer les projets mis en avant
exports.getFeaturedProjects = async (req, res) => {
  try {
    const featuredProjects = await Project.findAll({
      where: { 
        featured: true,
        active: true
      },
      limit: 6,
      order: [['year', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: featuredProjects
    });
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des projets mis en avant',
      error: error.message
    });
  }
};
