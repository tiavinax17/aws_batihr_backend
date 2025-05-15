const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/db');
const { protect, authorize } = require('../middleware/auth');

// GET /api/settings - Récupérer tous les paramètres publics
router.get('/', async (req, res) => {
  try {
    const [settings] = await sequelize.query(`
      SELECT setting_key, setting_value, setting_group
      FROM site_settings
      WHERE is_public = 1
    `);
    
    // Si aucun paramètre n'est trouvé, renvoyer des données par défaut
    if (!settings || settings.length === 0) {
      const defaultSettings = [
        { setting_key: 'site_name', setting_value: 'BATIHR +', setting_group: 'general' },
        { setting_key: 'site_description', setting_value: 'Entreprise du secteur BTP spécialisée dans la construction et la rénovation', setting_group: 'general' },
        { setting_key: 'contact_email', setting_value: 'contact@batihr.fr', setting_group: 'contact' },
        { setting_key: 'contact_phone', setting_value: '+33123456789', setting_group: 'contact' },
        { setting_key: 'contact_address', setting_value: '1234 Avenue de la Construction, 75000 Paris', setting_group: 'contact' },
        { setting_key: 'social_facebook', setting_value: 'https://facebook.com/batihrplus', setting_group: 'social' },
        { setting_key: 'social_linkedin', setting_value: 'https://linkedin.com/company/batihrplus', setting_group: 'social' },
        { setting_key: 'social_instagram', setting_value: 'https://instagram.com/batihrplus', setting_group: 'social' }
      ];
      return res.json({ success: true, data: defaultSettings });
    }
    
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    
    // En cas d'erreur, renvoyer des données statiques
    const defaultSettings = [
      { setting_key: 'site_name', setting_value: 'BATIHR +', setting_group: 'general' },
      { setting_key: 'site_description', setting_value: 'Entreprise du secteur BTP spécialisée dans la construction et la rénovation', setting_group: 'general' },
      { setting_key: 'contact_email', setting_value: 'contact@batihr.fr', setting_group: 'contact' },
      { setting_key: 'contact_phone', setting_value: '+33123456789', setting_group: 'contact' },
      { setting_key: 'contact_address', setting_value: '1234 Avenue de la Construction, 75000 Paris', setting_group: 'contact' },
      { setting_key: 'social_facebook', setting_value: 'https://facebook.com/batihrplus', setting_group: 'social' },
      { setting_key: 'social_linkedin', setting_value: 'https://linkedin.com/company/batihrplus', setting_group: 'social' },
      { setting_key: 'social_instagram', setting_value: 'https://instagram.com/batihrplus', setting_group: 'social' }
    ];
    
    res.json({ success: true, data: defaultSettings });
  }
});

// GET /api/settings/:key - Récupérer un paramètre spécifique
router.get('/:key', async (req, res) => {
  try {
    const [settings] = await sequelize.query(`
      SELECT setting_key, setting_value, setting_group
      FROM site_settings
      WHERE setting_key = ? AND is_public = 1
    `, {
      replacements: [req.params.key],
      type: sequelize.QueryTypes.SELECT
    });
    
    const setting = settings[0];
    
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Paramètre non trouvé' });
    }
    
    res.json({ success: true, data: setting });
  } catch (error) {
    console.error('Erreur lors de la récupération du paramètre:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Routes protégées pour l'administration
// GET /api/settings/all - Récupérer tous les paramètres (publics et privés)
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const [settings] = await sequelize.query(`
      SELECT * FROM site_settings
      ORDER BY setting_group ASC, setting_key ASC
    `);
    
    // Organiser les paramètres par groupe
    const settingsByGroup = {};
    settings.forEach(setting => {
      if (!settingsByGroup[setting.setting_group]) {
        settingsByGroup[setting.setting_group] = {};
      }
      settingsByGroup[setting.setting_group][setting.setting_key] = {
        value: setting.setting_value,
        is_public: setting.is_public,
        id: setting.id
      };
    });
    
    res.json({ success: true, data: settingsByGroup });
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les paramètres:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/settings/:key - Mettre à jour un paramètre
router.put('/:key', protect, authorize('admin'), async (req, res) => {
  try {
    const { setting_value, is_public } = req.body;
    
    // Vérifier si le paramètre existe
    const [settings] = await sequelize.query(`
      SELECT * FROM site_settings WHERE setting_key = ?
    `, {
      replacements: [req.params.key],
      type: sequelize.QueryTypes.SELECT
    });
    
    const setting = settings[0];
    
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Paramètre non trouvé' });
    }
    
    // Mettre à jour le paramètre
    await sequelize.query(`
      UPDATE site_settings 
      SET setting_value = ?, is_public = ?
      WHERE setting_key = ?
    `, {
      replacements: [
        setting_value !== undefined ? setting_value : setting.setting_value, 
        is_public !== undefined ? (is_public ? 1 : 0) : setting.is_public,
        req.params.key
      ],
      type: sequelize.QueryTypes.UPDATE
    });
    
    const [updatedSettings] = await sequelize.query(`
      SELECT * FROM site_settings WHERE setting_key = ?
    `, {
      replacements: [req.params.key],
      type: sequelize.QueryTypes.SELECT
    });
    
    const updatedSetting = updatedSettings[0];
    
    res.json({ success: true, data: updatedSetting });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paramètre:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/settings - Ajouter un nouveau paramètre
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { setting_key, setting_value, setting_group, is_public } = req.body;
    
    // Validation de base
    if (!setting_key || !setting_group) {
      return res.status(400).json({ 
        success: false, 
        message: 'La clé et le groupe du paramètre sont requis' 
      });
    }
    
    // Vérifier si la clé existe déjà
    const [existingSettings] = await sequelize.query(`
      SELECT * FROM site_settings WHERE setting_key = ?
    `, {
      replacements: [setting_key],
      type: sequelize.QueryTypes.SELECT
    });
    
    const existingSetting = existingSettings[0];
    
    if (existingSetting) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cette clé de paramètre existe déjà' 
      });
    }
    
    // Insérer le paramètre
    await sequelize.query(`
      INSERT INTO site_settings 
      (setting_key, setting_value, setting_group, is_public)
      VALUES (?, ?, ?, ?)
    `, {
      replacements: [
        setting_key, 
        setting_value || null, 
        setting_group, 
        is_public ? 1 : 0
      ],
      type: sequelize.QueryTypes.INSERT
    });
    
    const [newSettings] = await sequelize.query(`
      SELECT * FROM site_settings WHERE setting_key = ?
    `, {
      replacements: [setting_key],
      type: sequelize.QueryTypes.SELECT
    });
    
    const newSetting = newSettings[0];
    
    res.status(201).json({ success: true, data: newSetting });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du paramètre:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/settings/:key - Supprimer un paramètre
router.delete('/:key', protect, authorize('admin'), async (req, res) => {
  try {
    // Vérifier si le paramètre existe
    const [settings] = await sequelize.query(`
      SELECT * FROM site_settings WHERE setting_key = ?
    `, {
      replacements: [req.params.key],
      type: sequelize.QueryTypes.SELECT
    });
    
    const setting = settings[0];
    
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Paramètre non trouvé' });
    }
    
    // Supprimer le paramètre
    await sequelize.query(`
      DELETE FROM site_settings WHERE setting_key = ?
    `, {
      replacements: [req.params.key],
      type: sequelize.QueryTypes.DELETE
    });
    
    res.json({ success: true, message: 'Paramètre supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du paramètre:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
