const path = require('path');
const fs = require('fs');
const multer = require('multer');
const emailService = require('../utils/emailService');

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/devis');
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'devis-' + uniqueSuffix + ext);
  }
});

// Filtrer les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Seuls PDF, JPG, PNG et DOC sont acceptés.'), false);
  }
};

// Initialiser l'upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limite de 10MB
}).array('files', 5); // Maximum 5 fichiers

/**
 * Traite la soumission d'une demande de devis
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.submitDevis = (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      // Erreur Multer lors de l'upload
      return res.status(400).json({
        success: false,
        message: `Erreur lors de l'upload: ${err.message}`
      });
    } else if (err) {
      // Autre erreur
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    try {
      // Extraire les données du formulaire
      const { name, email, phone, projectType, budget, timeline, description, address ,cabinet } = req.body;

      // Validation des données
      if (!name || !email || !phone || !projectType || !budget || !timeline || !description || !address || !cabinet) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez fournir toutes les informations requises'
        });
      }

      // Générer un ID unique pour le devis
      const devisId = `DEV-${Date.now().toString().slice(-6)}`;

      // Récupérer les noms des fichiers uploadés
      //const fileNames = req.files ? req.files.map(file => file.filename) : [];
      const files = req.files || [];
      // Extraire le prénom et le nom
      const nameParts = name.split(' ');
      const prenom = nameParts[0] || '';
      const nom = nameParts.slice(1).join(' ') || '';

      // Envoyer un email de confirmation au client
      const emailSent = await emailService.sendDevisConfirmation({
        to: email,
        devisId,
        nom,
        cabinet,
        prenom,
        projectType
      });

      // Envoyer une notification à l'administrateur
      const notificationSent = await emailService.sendDevisNotification({
        devisId,
        nom,
        prenom,
        email,
        telephone: phone,
        projectType,
        budget,
        timeline,
        description,
        address,
        files,
        cabinet
      });

      if (emailSent && notificationSent) {
        return res.status(201).json({
          success: true,
          message: 'Votre demande de devis a été envoyée avec succès',
          data: { devisId }
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'La demande a été enregistrée mais l\'email n\'a pas pu être envoyé'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du devis:', error);
      return res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi de la demande de devis',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
};
