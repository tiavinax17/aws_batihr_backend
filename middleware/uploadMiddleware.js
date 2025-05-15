const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer le dossier d'upload s'il n'existe pas
const uploadDir = path.join(__dirname, '../uploads/devis');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'devis-' + uniqueSuffix + ext);
  }
});

// Filtrer les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non autorisé. Formats acceptés: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX'), false);
  }
};

// Limiter la taille des fichiers (10 Mo)
const limits = {
  fileSize: 10 * 1024 * 1024
};

// Créer le middleware multer
const upload = multer({
  storage,
  fileFilter,
  limits
});

module.exports = upload;
