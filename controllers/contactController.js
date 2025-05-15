const emailService = require('../utils/emailService');

/**
 * Traite le formulaire de contact et envoie des emails de confirmation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message ,cabinet} = req.body;

    // Validation des données
    if (!name || !email || !subject || !message|| !cabinet) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir toutes les informations requises'
      });
    }

    // Générer un ID unique pour le message
    const messageId = `MSG-${Date.now().toString().slice(-6)}`;

    // Envoyer un email de confirmation au client
    const emailSent = await emailService.sendContactConfirmation({
      to: email,
      nom: name.split(' ')[1] || '',  // Tentative de récupérer le nom de famille
      prenom: name.split(' ')[0] || name,  // Prénom ou nom complet si pas d'espace
      cabinet,
      messageId,
      subject
    });

    // Envoyer une notification à l'administrateur
    const notificationSent = await emailService.sendContactNotification({
      messageId,
      nom: name.split(' ')[1] || '',
      prenom: name.split(' ')[0] || name,
      cabinet,
      email,
      telephone: phone || 'Non fourni',
      sujet: subject,
      message: message
    });

    if (emailSent && notificationSent) {
      return res.status(201).json({
        success: true,
        message: 'Votre message a été envoyé avec succès',
        data: { messageId }
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Le message a été enregistré mais l\'email n\'a pas pu être envoyé'
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi du message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
