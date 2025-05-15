/**
 * Génère un identifiant unique pour un devis
 * Format: DEV-YYYYMMDD-XXXX (où XXXX est un nombre aléatoire à 4 chiffres)
 * @returns {string} - Identifiant du devis
 */
exports.generateDevisId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000); // Nombre aléatoire à 4 chiffres
    
    return `DEV-${year}${month}${day}-${random}`;
  };
  
  module.exports = exports;
  