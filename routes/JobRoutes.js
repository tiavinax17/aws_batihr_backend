const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// Route pour récupérer toutes les offres d'emploi
router.get('/', jobController.getAllJobs);

// Route pour récupérer une offre d'emploi par son slug
router.get('/:slug', jobController.getJobBySlug);

// Route pour récupérer des offres d'emploi similaires
router.get('/:slug/similar/:category', jobController.getSimilarJobs);

// Route pour soumettre une candidature
router.post('/apply', jobController.submitApplication);

module.exports = router;
