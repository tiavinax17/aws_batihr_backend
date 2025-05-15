const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
// const { validateContactForm } = require('../middleware/validators');

// Route pour envoyer un message de contact
router.post('/', contactController.submitContactForm);

module.exports = router;
