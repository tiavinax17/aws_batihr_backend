const express = require('express');
const router = express.Router();
const devisController = require('../controllers/devisController');
const upload = require('../middleware/uploadMiddleware');

// Route pour soumettre une demande de devis avec upload de fichiers
router.post('/', upload.array('documents', 5), devisController.submitDevis);

// Route pour récupérer les types de projets
router.get('/project-types', devisController.getProjectTypes);

// Route pour récupérer un devis par son ID (pour l'admin)
router.get('/:id', devisController.getDevisById);

// Route pour récupérer tous les devis (pour l'admin)
router.get('/', devisController.getAllDevis);

module.exports = router;
