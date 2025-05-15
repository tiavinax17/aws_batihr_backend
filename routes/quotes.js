const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const sendEmail = require('../utils/email');
const upload = require('../middleware/upload');
const { v4: uuidv4 } = require('uuid');

// POST /api/quotes - Soumettre une demande de devis
router.post('/', upload.array('documents', 5), async (req, res) => {
  try {
    const { 
      first_name, last_name, email, phone, address, city, postal_code,
      project_type, project_description, budget, timeline, service_ids
    } = req.body;
    
    // Validation de base
    if (!first_name || !last_name || !email || !phone || !project_description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Veuillez remplir tous les champs obligatoires' 
      });
    }
    
    // Traiter les documents joints
    const documents = req.files ? req.files.map(file => `/uploads/quotes/${file.filename}`) : [];
    
    // Générer un numéro de suivi unique
    const tracking_number = `DEV-${Date.now().toString().slice(-6)}-${uuidv4().slice(0, 4)}`;
    
    // Enregistrer la demande de devis dans la base de données
    // Note: Cette table n'est pas dans le schéma initial, il faudrait l'ajouter
    const result = await query(`
      INSERT INTO quote_requests 
      (tracking_number, first_name, last_name, email, phone, address, city, postal_code,
       project_type, project_description, budget, timeline, documents, status, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      tracking_number,
      first_name, 
      last_name, 
      email, 
      phone, 
      address || null, 
      city || null, 
      postal_code || null, 
      project_type || null, 
      project_description, 
      budget || null, 
      timeline || null, 
      JSON.stringify(documents), 
      'pending', // statut initial
      req.ip, 
      req.headers['user-agent']
    ]);
    
    // Enregistrer les services associés si fournis
    if (service_ids && Array.isArray(service_ids)) {
      for (const service_id of service_ids) {
        await query(`
          INSERT INTO quote_request_services (quote_request_id, service_id)
          VALUES (?, ?)
        `, [result.insertId, service_id]);
      }
    }
    
    // Envoyer un email de notification à l'administrateur
    await sendEmail({
      email: process.env.EMAIL_FROM,
      subject: `Nouvelle demande de devis: ${tracking_number}`,
      message: `
        <h1>Nouvelle demande de devis</h1>
        <p><strong>Numéro de suivi:</strong> ${tracking_number}</p>
        <p><strong>De:</strong> ${first_name} ${last_name} (${email})</p>
        <p><strong>Téléphone:</strong> ${phone}</p>
        <p><strong>Type de projet:</strong> ${project_type || 'Non spécifié'}</p>
        <p><strong>Description du projet:</strong></p>
        <p>${project_description.replace(/\n/g, '<br>')}</p>
        <p><a href="${process.env.ADMIN_URL}/quotes/${result.insertId}">Voir dans l'administration</a></p>
      `
    });
    
    // Envoyer un email de confirmation au client
    await sendEmail({
      email: email,
      subject: `Confirmation de votre demande de devis - BATIHR+`,
      message: `
        <h1>Merci pour votre demande de devis</h1>
        <p>Cher(e) ${first_name} ${last_name},</p>
        <p>Nous avons bien reçu votre demande de devis et nous vous remercions de votre intérêt pour nos services.</p>
        <p><strong>Votre numéro de suivi:</strong> ${tracking_number}</p>
        <p>Notre équipe va étudier votre projet et vous contactera dans un délai de 48 heures ouvrées pour discuter des détails et vous proposer un devis personnalisé.</p>
        <p>Vous pouvez suivre l'état de votre demande en utilisant le lien ci-dessous:</p>
        <p><a href="${process.env.CLIENT_URL}/suivi-devis/${tracking_number}">Suivre ma demande de devis</a></p>
        <p>Cordialement,</p>
        <p>L'équipe BATIHR+</p>
      `
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Votre demande de devis a été envoyée avec succès. Vous recevrez une confirmation par email.',
      data: { tracking_number }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/quotes/track/:tracking_number - Suivre une demande de devis
router.get('/track/:tracking_number', async (req, res) => {
  try {
    // Récupérer la demande de devis
    const [quote] = await query(`
      SELECT id, tracking_number, status, created_at, updated_at
      FROM quote_requests
      WHERE tracking_number = ?
    `, [req.params.tracking_number]);
    
    if (!quote) {
      return res.status(404).json({ success: false, message: 'Demande de devis non trouvée' });
    }
    
    // Récupérer les mises à jour de statut
    const statusUpdates = await query(`
      SELECT status, message, created_at
      FROM quote_status_updates
      WHERE quote_request_id = ?
      ORDER BY created_at DESC
    `, [quote.id]);
    
    res.json({ 
      success: true, 
      data: {
        ...quote,
        statusUpdates
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
