const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Vérifiez que appointmentController.createAppointment existe
console.log('Controller methods:', Object.keys(appointmentController));

// Route pour créer un nouveau rendez-vous
router.post('/', appointmentController.createAppointment);

module.exports = router;
