const emailService = require('../utils/emailService');

/**
 * Envoie un email de confirmation pour un rendez-vous
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.sendAppointmentConfirmation = async (req, res) => {
  try {
    const { to, name, date, time, reason, preferredMethod } = req.body;

    // Validation des données
    if (!to || !name || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Données insuffisantes pour envoyer l\'email de confirmation'
      });
    }

    // Envoyer l'email de confirmation
    const emailSent = await emailService.sendAppointmentConfirmation({
      to,
      nom: name.split(' ')[1] || '',
      prenom: name.split(' ')[0] || name,
      date,
      time,
      reason,
      preferredMethod
    });

    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: 'Email de confirmation envoyé avec succès'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Échec de l\'envoi de l\'email de confirmation'
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi de l\'email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Envoie un email de confirmation pour une demande de devis
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.sendQuoteConfirmation = async (req, res) => {
  try {
    const { to, firstName, lastName, requestId, projectType } = req.body;

    // Validation des données
    if (!to || !firstName || !requestId) {
      return res.status(400).json({
        success: false,
        message: 'Données insuffisantes pour envoyer l\'email de confirmation'
      });
    }

    // Envoyer l'email de confirmation
    const emailSent = await emailService.sendDevisConfirmation({
      to,
      prenom: firstName,
      nom: lastName || '',
      devisId: requestId
    });

    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: 'Email de confirmation de devis envoyé avec succès'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Échec de l\'envoi de l\'email de confirmation de devis'
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation de devis:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi de l\'email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
