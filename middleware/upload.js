const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Déterminer le dossier de destination en fonction du type de fichier
    let uploadPath = 'uploads/';
    
    if (req.originalUrl.includes('/team')) {
      uploadPath += 'team/';
    } else if (req.originalUrl.includes('/certifications')) {
      uploadPath += 'certifications/';
    } else if (req.originalUrl.includes('/services')) {
      uploadPath += 'services/';
    } else if (req.originalUrl.includes('/projects')) {
      uploadPath += 'projects/';
    } else if (req.originalUrl.includes('/blog')) {
      uploadPath += 'blog/';
    } else if (req.originalUrl.includes('/testimonials')) {
      uploadPath += 'testimonials/';
    } else if (req.originalUrl.includes('/quotes')) {
      uploadPath += 'quotes/';
    } else if (req.originalUrl.includes('/contact')) {
      uploadPath += 'contact/';
    } else {
      uploadPath += 'misc/';
    }
    
    // Créer le dossier s'il n'existe pas
    const fullPath = path.join(__dirname, '../public/', uploadPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, 'public/' + uploadPath);
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtre pour les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  // Types MIME autorisés
  const allowedMimeTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Seuls les images (JPEG, PNG, GIF, WebP) et documents (PDF, DOC, DOCX, XLS, XLSX) sont acceptés.'), false);
  }
};

// Configuration de Multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

module.exports = upload;
