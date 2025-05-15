const Job = require('../models/Job');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const emailService = require('../utils/emailService');

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/applications');
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
    cb(null, 'application-' + uniqueSuffix + ext);
  }
});

// Filtrer les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Seuls PDF, DOC et DOCX sont acceptés.'), false);
  }
};

// Initialiser l'upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB
}).fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 }
]);

// Récupérer toutes les offres d'emploi actives
exports.getAllJobs = async (req, res) => {
  try {
    const { category } = req.query;
    
    let whereClause = { active: true };
    
    // Filtrer par catégorie si spécifiée
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    
    const jobs = await Job.findAll({
      where: whereClause,
      order: [
        ['featured', 'DESC'],
        ['publishDate', 'DESC']
      ]
    });
    
    return res.status(200).json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des offres d\'emploi',
      error: error.message
    });
  }
};

// Récupérer une offre d'emploi par son slug
exports.getJobBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const job = await Job.findOne({
      where: { 
        slug,
        active: true
      }
    });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Offre d\'emploi non trouvée'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'offre d\'emploi',
      error: error.message
    });
  }
};

// Récupérer les offres d'emploi similaires (même catégorie)
exports.getSimilarJobs = async (req, res) => {
  try {
    const { slug, category } = req.params;
    
    const similarJobs = await Job.findAll({
      where: {
        category,
        slug: { [Op.ne]: slug },
        active: true
      },
      limit: 3,
      order: [
        ['featured', 'DESC'],
        ['publishDate', 'DESC']
      ]
    });
    
    return res.status(200).json({
      success: true,
      data: similarJobs
    });
  } catch (error) {
    console.error('Error fetching similar jobs:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des offres d\'emploi similaires',
      error: error.message
    });
  }
};

// Soumettre une candidature
exports.submitApplication = (req, res) => {
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
      const { jobId, firstName, lastName, email, phone, message, consent } = req.body;

      // Validation des données
      if (!jobId || !firstName || !lastName || !email || !phone || !consent) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez fournir toutes les informations requises'
        });
      }

      // Vérifier que le CV a été uploadé
      if (!req.files.resume) {
        return res.status(400).json({
          success: false,
          message: 'Le CV est requis'
        });
      }

      // Récupérer les informations sur l'offre d'emploi
      const job = await Job.findByPk(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Offre d\'emploi non trouvée'
        });
      }

      // Générer un ID unique pour la candidature
      const applicationId = `APP-${Date.now().toString().slice(-6)}`;

      // Envoyer un email de confirmation au candidat
      const emailSent = await emailService.sendApplicationConfirmation({
        to: email,
        applicationId,
        firstName,
        lastName,
        jobTitle: job.title
      });

      // Envoyer une notification à l'administrateur
      const notificationSent = await emailService.sendApplicationNotification({
        applicationId,
        firstName,
        lastName,
        email,
        phone,
        message: message || '',
        jobTitle: job.title,
        jobId,
        files: {
          resume: req.files.resume[0],
          coverLetter: req.files.coverLetter ? req.files.coverLetter[0] : null
        }
      });

      if (emailSent && notificationSent) {
        return res.status(201).json({
          success: true,
          message: 'Votre candidature a été envoyée avec succès',
          data: { applicationId }
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'La candidature a été enregistrée mais l\'email n\'a pas pu être envoyé'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la soumission de la candidature:', error);
      return res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi de la candidature',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
};
