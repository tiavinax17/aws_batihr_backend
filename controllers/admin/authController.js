// Utilisateur admin en dur (à remplacer par une base de données dans un environnement de production)
const adminUser = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    isAdmin: true
  };
  
  exports.getLoginForm = (req, res) => {
    res.render('auth/login', { 
      title: 'Connexion',
      error: req.flash('error')
    });
  };
  
  exports.login = (req, res) => {
    const { username, password } = req.body;
    
    if (username === adminUser.username && password === adminUser.password) {
      // Créer une session utilisateur
      req.session.user = {
        username: adminUser.username,
        isAdmin: adminUser.isAdmin
      };
      
      req.flash('success', 'Connexion réussie');
      res.redirect('/admin');
    } else {
      req.flash('error', 'Identifiants incorrects');
      res.redirect('/login');
    }
  };
  
  exports.logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erreur lors de la déconnexion:', err);
      }
      res.redirect('/login');
    });
  };
  
  exports.getDashboard = (req, res) => {
    res.render('admin/dashboard', {
      title: 'Tableau de bord',
      active: 'dashboard',
      user: req.session.user
    });
  };
  