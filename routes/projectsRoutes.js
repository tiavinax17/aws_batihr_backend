const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Routes publiques
router.get('/', projectController.getAllProjects);
router.get('/featured', projectController.getFeaturedProjects);
router.get('/:slug', projectController.getProjectBySlug);
router.get('/:slug/similar/:category', projectController.getSimilarProjects);

module.exports = router;
