/**
 * Configuration des emails par cabinet
 */
module.exports = {
  // Emails par défaut
  default: process.env.EMAIL_DEFAULT || 'tiavina3180@gmail.com',
  
  // Emails spécifiques par cabinet
  plomberie: process.env.EMAIL_PLOMBERIE || 'randrianjatiavinaeliot@gmail.com',
  fumisterie: process.env.EMAIL_FUMISTERIE ,
  couverture: process.env.EMAIL_COUVERTURE ,
  administratif: process.env.EMAIL_ADMINISTRATIF
};