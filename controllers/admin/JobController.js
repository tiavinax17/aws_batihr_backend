const { Sequelize, DataTypes } = require('sequelize');
const Job = require('../../models/Job');
const sequelize = new Sequelize(
  process.env.DB_NAME || 'batihr_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);



// Fonction pour générer un slug à partir du titre
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Méthodes du contrôleur
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      order: [['publishDate', 'DESC']]
    });
    res.render('admin/jobs/index', { 
      jobs,
      title: 'Gestion des offres d\'emploi',
      active: 'jobs'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des offres d\'emploi:', error);
    res.status(500).send('Erreur serveur');
  }
};

exports.getJobForm = async (req, res) => {
  try {
    const job = {
      id: null,
      title: '',
      location: '',
      type: '',
      category: '',
      description: '',
      fullDescription: '',
      salary: '',
      experience: '',
      education: '',
      featured: false,
      active: true
    };
    
    res.render('admin/jobs/form', { 
      job,
      title: 'Ajouter une offre d\'emploi',
      active: 'jobs',
      isNew: true
    });
  } catch (error) {
    console.error('Erreur lors du chargement du formulaire:', error);
    res.status(500).send('Erreur serveur');
  }
};

exports.getEditJobForm = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    
    if (!job) {
      return res.status(404).send('Offre d\'emploi non trouvée');
    }
    
    res.render('admin/jobs/form', { 
      job,
      title: 'Modifier une offre d\'emploi',
      active: 'jobs',
      isNew: false
    });
  } catch (error) {
    console.error('Erreur lors du chargement du formulaire d\'édition:', error);
    res.status(500).send('Erreur serveur');
  }
};

exports.createJob = async (req, res) => {
  try {
    const jobData = {
      title: req.body.title,
      slug: generateSlug(req.body.title),
      location: req.body.location,
      type: req.body.type,
      category: req.body.category,
      description: req.body.description,
      fullDescription: req.body.fullDescription,
      salary: req.body.salary,
      experience: req.body.experience,
      education: req.body.education,
      publishDate: new Date(),
      featured: req.body.featured === 'on',
      active: req.body.active === 'on'
    };
    
    await Job.create(jobData);
    
    req.flash('success', 'Offre d\'emploi créée avec succès');
    res.redirect('/admin/jobs');
  } catch (error) {
    console.error('Erreur lors de la création de l\'offre d\'emploi:', error);
    req.flash('error', 'Erreur lors de la création de l\'offre d\'emploi');
    res.redirect('/admin/jobs/new');
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    
    if (!job) {
      return res.status(404).send('Offre d\'emploi non trouvée');
    }
    
    const jobData = {
      title: req.body.title,
      slug: req.body.title !== job.title ? generateSlug(req.body.title) : job.slug,
      location: req.body.location,
      type: req.body.type,
      category: req.body.category,
      description: req.body.description,
      fullDescription: req.body.fullDescription,
      salary: req.body.salary,
      experience: req.body.experience,
      education: req.body.education,
      featured: req.body.featured === 'on',
      active: req.body.active === 'on'
    };
    
    await job.update(jobData);
    
    req.flash('success', 'Offre d\'emploi mise à jour avec succès');
    res.redirect('/admin/jobs');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'offre d\'emploi:', error);
    req.flash('error', 'Erreur lors de la mise à jour de l\'offre d\'emploi');
    res.redirect(`/admin/jobs/edit/${req.params.id}`);
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Offre d\'emploi non trouvée' });
    }
    
    await job.destroy();
    
    res.json({ success: true, message: 'Offre d\'emploi supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'offre d\'emploi:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
