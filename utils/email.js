const nodemailer = require('nodemailer');

// Création du transporteur pour l'envoi d'emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Fonction pour envoyer un email
const sendEmail = async (options) => {
  const message = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Email envoyé: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

module.exports = sendEmail;
