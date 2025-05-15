const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/services - Récupérer tous les services
router.get('/', async (req, res) => {
  try {
    const services = await query(`
      SELECT s.*, sc.name as category_name, sc.slug as category_slug,
      (SELECT image_path FROM service_images WHERE service_id = s.id AND is_main = 1 LIMIT 1) as main_image
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      ORDER BY s.name ASC
    `);
    
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/services/featured - Récupérer les services mis en avant
router.get('/featured', async (req, res) => {
  try {
    const services = await query(`
      SELECT s.*, sc.name as category_name, sc.slug as category_slug,
      (SELECT image_path FROM service_images WHERE service_id = s.id AND is_main = 1 LIMIT 1) as main_image
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.featured = 1
      ORDER BY s.name ASC
    `);
    
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/services/categories - Récupérer toutes les catégories de services
router.get('/categories', async (req, res) => {
  try {
    const categories = await query('SELECT * FROM service_categories ORDER BY name ASC');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/services/category/:id - Récupérer les services par catégorie
router.get('/category/:id', async (req, res) => {
  try {
    const services = await query(`
      SELECT s.*, sc.name as category_name, sc.slug as category_slug,
      (SELECT image_path FROM service_images WHERE service_id = s.id AND is_main = 1 LIMIT 1) as main_image
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.category_id = ?
      ORDER BY s.name ASC
    `, [req.params.id]);
    
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/services/:slug - Récupérer un service par son slug
router.get('/:slug', async (req, res) => {
  try {
    // Récupérer les informations du service
    const [service] = await query(`
      SELECT s.*, sc.name as category_name, sc.slug as category_slug
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.slug = ?
    `, [req.params.slug]);
    
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service non trouvé' });
    }
    
    // Récupérer les images du service
    const images = await query('SELECT * FROM service_images WHERE service_id = ? ORDER BY is_main DESC, display_order ASC', [service.id]);
    
    // Récupérer les projets associés à ce service
    const projects = await query(`
      SELECT p.*, pc.name as category_name, pc.slug as category_slug,
      (SELECT image_path FROM project_images WHERE project_id = p.id AND is_main = 1 LIMIT 1) as main_image
      FROM projects p
      LEFT JOIN project_categories pc ON p.category_id = pc.id
      INNER JOIN project_services ps ON p.id = ps.project_id
      WHERE ps.service_id = ?
      ORDER BY p.completion_date DESC
      LIMIT 4
    `, [service.id]);
    
    // Récupérer les témoignages associés à ce service
    const testimonials = await query(`
      SELECT * FROM testimonials
      WHERE service_id = ? AND is_approved = 1
      ORDER BY created_at DESC
      LIMIT 3
    `, [service.id]);
    
    res.json({
      success: true,
      data: {
        ...service,
        images,
        projects,
        testimonials
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Routes protégées pour l'administration
// POST /api/services - Créer un nouveau service
router.post('/', protect, authorize('admin', 'editor'), upload.single('main_image'), async (req, res) => {
  try {
    // Logique pour créer un service
    // ...
    
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/services/:id - Mettre à jour un service
router.put('/:id', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    // Logique pour mettre à jour un service
    // ...
    
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/services/:id - Supprimer un service
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
      // Vérifier si le service existe
      const [service] = await query('SELECT * FROM services WHERE id = ?', [req.params.id]);
      
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service non trouvé' });
      }
      
      // Supprimer le service (les images et relations seront supprimées en cascade)
      await query('DELETE FROM services WHERE id = ?', [req.params.id]);
      
      res.json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  module.exports = router;
  