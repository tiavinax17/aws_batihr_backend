const emailService = require('../utils/emailService');

/**
 * Crée un nouveau rendez-vous et envoie un email de confirmation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.createAppointment = async (req, res) => {
  try {
    const { name, email, phone, date, time, reason, preferredMethod, notes ,cabinet} = req.body;

    // Validation des données
    if (!name || !email || !phone || !date || !time || !reason || !preferredMethod || !cabinet) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir toutes les informations requises'
      });
    }

    // Générer un ID unique pour le rendez-vous
    const appointmentId = `APT-${Date.now().toString().slice(-6)}`;

    // Envoyer un email de confirmation au client
    const emailSent = await emailService.sendAppointmentConfirmation({
      to: email,
      nom: name.split(' ')[1] || '',  // Tentative de récupérer le nom de famille
      prenom: name.split(' ')[0] || name,  // Prénom ou nom complet si pas d'espace
      appointmentId,
      date,
      time,
      reason,
      preferredMethod,
      cabinet
    });

    // Envoyer une notification à l'administrateur
    const notificationSent = await emailService.sendAppointmentNotification({
      appointmentId,
      nom: name.split(' ')[1] || '',
      prenom: name.split(' ')[0] || name,
      email,
      telephone: phone,
      date,
      time,
      motif: reason,
      methode: preferredMethod,
      notes,
      cabinet
    });

    if (emailSent && notificationSent) {
      return res.status(201).json({
        success: true,
        message: 'Demande de rendez-vous envoyée avec succès',
        data: { appointmentId }
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Le rendez-vous a été enregistré mais l\'email n\'a pas pu être envoyé'
      });
    }
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la création du rendez-vous',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
