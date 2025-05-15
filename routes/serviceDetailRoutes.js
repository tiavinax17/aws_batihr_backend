const express = require('express');
const router = express.Router();
const serviceDetailController = require('../controllers/serviceDetailController');

// Route pour récupérer les détails d'un service par son slug
router.get('/:slug', serviceDetailController.getServiceDetailBySlug);

// Route pour créer ou mettre à jour les détails d'un service (protégée par authentification)
router.post('/:serviceId', serviceDetailController.createOrUpdateServiceDetail);

module.exports = router;
