const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const sendEmail = require('../utils/email');
const { protect, authorize } = require('../middleware/auth');

// POST /api/jobs/apply - Soumettre une candidature simplifiée
router.post('/apply', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validation de base
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'L\'adresse email est requise' 
      });
    }
    
    // Enregistrer la candidature
    await query(`
      INSERT INTO job_applications 
      (email, ip_address, user_agent)
      VALUES (?, ?, ?)
    `, [email, req.ip, req.headers['user-agent']]);
    
    // Envoyer un email de notification à l'administrateur
    await sendEmail({
      email: process.env.EMAIL_FROM,
      subject: `Nouvelle candidature spontanée - BATIHR+`,
      message: `
        <h1>Nouvelle candidature spontanée</h1>
        <p>Une nouvelle personne souhaite rejoindre l'équipe BATIHR+.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>Veuillez contacter cette personne pour plus d'informations sur son profil et ses motivations.</p>
      `
    });
    
    // Envoyer un email de confirmation au candidat
    await sendEmail({
      email: email,
      subject: `Confirmation de votre candidature - BATIHR+`,
      message: `
        <h1>Merci pour votre intérêt</h1>
        <p>Bonjour,</p>
        <p>Nous avons bien reçu votre candidature spontanée et nous vous remercions de votre intérêt pour BATIHR+.</p>
        <p>Notre équipe des ressources humaines examinera votre profil et vous contactera si votre candidature correspond à nos besoins actuels.</p>
        <p>Cordialement,</p>
        <p>L'équipe BATIHR+</p>
      `
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Votre candidature a été enregistrée avec succès. Nous vous contacterons prochainement.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Routes protégées pour l'administration
// GET /api/jobs/applications - Récupérer toutes les candidatures
router.get('/applications', protect, authorize('admin'), async (req, res) => {
  try {
    const applications = await query(`
      SELECT * FROM job_applications
      ORDER BY created_at DESC
    `);
    
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
