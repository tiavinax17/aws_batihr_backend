const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/projects - Récupérer tous les projets
router.get('/', async (req, res) => {
  try {
    const projects = await query(`
      SELECT p.*, pc.name as category_name, pc.slug as category_slug,
      (SELECT image_path FROM project_images WHERE project_id = p.id AND is_main = 1 LIMIT 1) as main_image
      FROM projects p
      LEFT JOIN project_categories pc ON p.category_id = pc.id
      ORDER BY p.completion_date DESC
    `);
    
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/projects/featured - Récupérer les projets mis en avant
router.get('/featured', async (req, res) => {
  try {
    const projects = await query(`
      SELECT p.*, pc.name as category_name, pc.slug as category_slug,
      (SELECT image_path FROM project_images WHERE project_id = p.id AND is_main = 1 LIMIT 1) as main_image
      FROM projects p
      LEFT JOIN project_categories pc ON p.category_id = pc.id
      WHERE p.featured = 1
      ORDER BY p.completion_date DESC
    `);
    
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/projects/categories - Récupérer toutes les catégories de projets
router.get('/categories', async (req, res) => {
  try {
    const categories = await query('SELECT * FROM project_categories ORDER BY name ASC');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/projects/category/:id - Récupérer les projets par catégorie
router.get('/category/:id', async (req, res) => {
  try {
    const projects = await query(`
      SELECT p.*, pc.name as category_name, pc.slug as category_slug,
      (SELECT image_path FROM project_images WHERE project_id = p.id AND is_main = 1 LIMIT 1) as main_image
      FROM projects p
      LEFT JOIN project_categories pc ON p.category_id = pc.id
      WHERE p.category_id = ?
      ORDER BY p.completion_date DESC
    `, [req.params.id]);
    
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/projects/:slug - Récupérer un projet par son slug
router.get('/:slug', async (req, res) => {
  try {
    // Récupérer les informations du projet
    const [project] = await query(`
      SELECT p.*, pc.name as category_name, pc.slug as category_slug
      FROM projects p
      LEFT JOIN project_categories pc ON p.category_id = pc.id
      WHERE p.slug = ?
    `, [req.params.slug]);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    
    // Récupérer les images du projet
    const images = await query(`
      SELECT * FROM project_images 
      WHERE project_id = ? 
      ORDER BY is_main DESC, is_before DESC, is_after DESC, display_order ASC
    `, [project.id]);
    
    // Récupérer les services associés à ce projet
    const services = await query(`
      SELECT s.id, s.name, s.slug, s.short_description, s.icon
      FROM services s
      INNER JOIN project_services ps ON s.id = ps.service_id
      WHERE ps.project_id = ?
      ORDER BY s.name ASC
    `, [project.id]);
    
    // Récupérer les témoignages associés à ce projet
    const testimonials = await query(`
      SELECT * FROM testimonials
      WHERE project_id = ? AND is_approved = 1
      ORDER BY created_at DESC
      LIMIT 3
    `, [project.id]);
    
    // Récupérer des projets similaires (même catégorie)
    const similarProjects = await query(`
      SELECT p.id, p.name, p.slug, p.short_description, p.completion_date,
      (SELECT image_path FROM project_images WHERE project_id = p.id AND is_main = 1 LIMIT 1) as main_image
      FROM projects p
      WHERE p.category_id = ? AND p.id != ?
      ORDER BY p.completion_date DESC
      LIMIT 3
    `, [project.category_id, project.id]);
    
    res.json({
      success: true,
      data: {
        ...project,
        images,
        services,
        testimonials,
        similarProjects
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Routes protégées pour l'administration
// POST /api/projects - Créer un nouveau projet
router.post('/', protect, authorize('admin', 'editor'), upload.single('main_image'), async (req, res) => {
  try {
    // Logique pour créer un projet
    // ...
    
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/projects/:id - Mettre à jour un projet
router.put('/:id', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    // Logique pour mettre à jour un projet
    // ...
    
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/projects/:id - Supprimer un projet
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    // Vérifier si le projet existe
    const [project] = await query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    
    // Supprimer le projet (les images et relations seront supprimées en cascade)
    await query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
