const { body, validationResult } = require('express-validator');

// Fonction pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

// Validation du formulaire de contact
exports.validateContactForm = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Veuillez fournir un email valide'),
  
  body('phone')
    .trim()
    .optional()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).withMessage('Veuillez fournir un numéro de téléphone valide'),
  
  body('subject')
    .trim()
    .notEmpty().withMessage('Le sujet est requis')
    .isLength({ min: 2, max: 200 }).withMessage('Le sujet doit contenir entre 2 et 200 caractères'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Le message est requis')
    .isLength({ min: 10, max: 2000 }).withMessage('Le message doit contenir entre 10 et 2000 caractères'),
  
  handleValidationErrors
];

// Validation du formulaire de rendez-vous
exports.validateAppointmentForm = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Veuillez fournir un email valide'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Le téléphone est requis')
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).withMessage('Veuillez fournir un numéro de téléphone valide'),
  
  body('date')
    .notEmpty().withMessage('La date est requise')
    .isISO8601().withMessage('Veuillez fournir une date valide')
    .custom(value => {
      const date = new Date(value);
      const now = new Date();
      if (date < now) {
        throw new Error('La date doit être dans le futur');
      }
      return true;
    }),
  
  body('time')
    .notEmpty().withMessage('L\'heure est requise')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Veuillez fournir une heure valide au format HH:MM'),
  
  body('reason')
    .trim()
    .notEmpty().withMessage('Le motif est requis'),
  
  body('preferredMethod')
    .isIn(['in-person', 'video', 'phone']).withMessage('Le mode de rendez-vous doit être valide'),
  
  handleValidationErrors
];
// Si ce fichier existe déjà, ajoutez simplement la fonction validateDevisForm

// Validation du formulaire de devis
exports.validateDevisForm = (req, res, next) => {
  const { name, email, phone, projectType, budget, timeline, description, address } = req.body;
  
  // Vérifier que tous les champs requis sont présents
  if (!name || !email || !phone || !projectType || !budget || !timeline || !description || !address) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir toutes les informations requises'
    });
  }
  
  // Valider le format de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir une adresse email valide'
    });
  }
  
  // Valider le format du téléphone (simple vérification)
  const phoneRegex = /^[0-9+\s()-]{8,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Veuillez fournir un numéro de téléphone valide'
    });
  }
  
  next();
};

