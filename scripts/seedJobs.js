// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config({ path: __dirname + '/../.env' });

// Vérifier que les variables sont bien chargées
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '****' : 'non défini');

// Importer les dépendances
const { Sequelize, DataTypes } = require('sequelize');

// Créer une connexion directe à la base de données avec les variables d'environnement
const sequelize = new Sequelize(
  process.env.DB_NAME || 'batihr_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log // Activer les logs pour voir les requêtes SQL
  }
);

// Définir le modèle Job directement dans ce script
const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // CDI, CDD, etc.
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING, // technique, management, commercial, administratif
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fullDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  education: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  publishDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  timestamps: true
});

const seedJobs = async () => {
  try {
    // Tester la connexion
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');

    // Synchroniser le modèle avec la base de données (créer la table)
    await sequelize.sync({ force: false }); // force: false pour ne pas supprimer la table si elle existe déjà
    console.log('Table Jobs synchronisée avec succès');

    // Vérifier si des offres d'emploi existent déjà
    const count = await Job.count();
    if (count > 0) {
      console.log('Des offres d\'emploi existent déjà dans la base de données.');
      await sequelize.close();
      process.exit(0);
      return;
    }

    // Données des offres d'emploi à insérer
    const jobsData = [
      {
        title: 'Serrurier / Menuisier (H/F)',
        slug: 'serrurier-menuisier-hf',
        location: 'Paris',
        type: 'CDI',
        category: 'technique',
        description: 'Nous recherchons un serrurier/menuisier qualifié pour rejoindre notre équipe.',
        fullDescription: `
          <p>BATIHR+ recherche un(e) Serrurier / Menuisier pour renforcer son équipe technique.</p>
          
          <h4>Description du poste :</h4>
          <p>Au sein de notre équipe, vous serez chargé(e) de :</p>
          <ul>
            <li>Réaliser des travaux de serrurerie et de menuiserie sur différents chantiers</li>
            <li>Installer et réparer des portes, fenêtres, volets et autres éléments de fermeture</li>
            <li>Fabriquer et poser des structures métalliques ou en bois</li>
            <li>Assurer la maintenance et le dépannage chez nos clients</li>
            <li>Respecter les normes de sécurité et les délais d'intervention</li>
            <li>Conseiller les clients sur les solutions techniques adaptées</li>
          </ul>
          
          <h4>Profil recherché :</h4>
          <ul>
            <li>Titulaire d'un CAP/BEP en Serrurerie, Menuiserie ou équivalent</li>
            <li>Expérience minimum de 3 ans sur un poste similaire</li>
            <li>Maîtrise des techniques de serrurerie et de menuiserie</li>
            <li>Connaissance des normes de sécurité en vigueur</li>
            <li>Permis B obligatoire</li>
            <li>Autonomie, rigueur et sens du service client</li>
            <li>Capacité à travailler en équipe</li>
          </ul>
          
          <h4>Nous offrons :</h4>
          <ul>
            <li>Un poste en CDI à temps plein</li>
            <li>Une rémunération attractive selon profil et expérience</li>
            <li>Des formations régulières pour développer vos compétences</li>
            <li>Des outils et équipements de qualité</li>
            <li>Une mutuelle d'entreprise avantageuse</li>
            <li>Des perspectives d'évolution au sein de notre entreprise</li>
          </ul>
        `,
        salary: 'Selon profil et expérience',
        experience: '3 ans minimum',
        education: 'CAP/BEP Serrurerie ou Menuiserie',
        publishDate: new Date('2023-05-15'),
        featured: true
      },
      {
        title: 'Chef de Chantier (H/F)',
        slug: 'chef-de-chantier-hf',
        location: 'Lyon',
        type: 'CDI',
        category: 'management',
        description: 'Supervisez nos chantiers et coordonnez les équipes sur le terrain.',
        fullDescription: `
          <p>BATIHR+ recherche un(e) Chef de Chantier expérimenté(e) pour superviser nos projets de construction et de rénovation.</p>
          
          <h4>Description du poste :</h4>
          <p>En tant que Chef de Chantier, vous serez responsable de :</p>
          <ul>
            <li>Organiser et coordonner les travaux sur le chantier</li>
            <li>Gérer les équipes et les sous-traitants</li>
            <li>Assurer le respect des délais, de la qualité et des normes de sécurité</li>
            <li>Contrôler l'avancement des travaux et résoudre les problèmes techniques</li>
            <li>Gérer les approvisionnements et le matériel sur le chantier</li>
            <li>Participer aux réunions de chantier et faire le lien avec le conducteur de travaux</li>
            <li>Veiller au respect des règles de sécurité et d'environnement</li>
          </ul>
          
          <h4>Profil recherché :</h4>
          <ul>
            <li>Formation BTS Bâtiment ou équivalent</li>
            <li>Expérience minimum de 5 ans en tant que chef de chantier</li>
            <li>Maîtrise des techniques du bâtiment et des normes de construction</li>
            <li>Compétences en management d'équipe</li>
            <li>Maîtrise des outils informatiques (lecture de plans, logiciels de planification)</li>
            <li>Permis B obligatoire</li>
            <li>Rigueur, organisation et capacité à gérer les priorités</li>
            <li>Excellentes aptitudes à la communication et à la résolution de problèmes</li>
          </ul>
          
          <h4>Nous offrons :</h4>
          <ul>
            <li>Un poste en CDI à temps plein</li>
            <li>Une rémunération attractive selon profil et expérience</li>
            <li>Un véhicule de fonction</li>
            <li>Des formations régulières pour développer vos compétences</li>
            <li>Une mutuelle d'entreprise avantageuse</li>
            <li>Des perspectives d'évolution au sein de notre entreprise</li>
          </ul>
        `,
        salary: 'Selon profil et expérience',
        experience: '5 ans minimum',
        education: 'BTS Bâtiment ou équivalent',
        publishDate: new Date('2023-05-10'),
        featured: true
      },
      {
        title: 'Électricien (H/F)',
        slug: 'electricien-hf',
        location: 'Marseille',
        type: 'CDI',
        category: 'technique',
        description: 'Rejoignez notre équipe pour des projets d\'installation électrique variés.',
        fullDescription: `
          <p>BATIHR+ recherche un(e) Électricien(ne) qualifié(e) pour rejoindre notre équipe technique.</p>
          
          <h4>Description du poste :</h4>
          <p>Au sein de notre équipe, vous serez chargé(e) de :</p>
          <ul>
            <li>Réaliser des installations électriques dans des bâtiments résidentiels et commerciaux</li>
            <li>Effectuer des travaux de rénovation électrique</li>
            <li>Installer et raccorder des équipements électriques</li>
            <li>Diagnostiquer et réparer des pannes électriques</li>
            <li>Respecter les normes de sécurité électrique</li>
            <li>Lire et interpréter des plans et schémas électriques</li>
          </ul>
          
          <h4>Profil recherché :</h4>
          <ul>
            <li>Titulaire d'un CAP/BEP ou Bac Pro en Électricité</li>
            <li>Expérience minimum de 2 ans sur un poste similaire</li>
            <li>Connaissance des normes électriques en vigueur (NF C 15-100)</li>
            <li>Habilitations électriques à jour</li>
            <li>Permis B obligatoire</li>
            <li>Autonomie, rigueur et sens du service client</li>
            <li>Capacité à travailler en équipe</li>
          </ul>
          
          <h4>Nous offrons :</h4>
          <ul>
            <li>Un poste en CDI à temps plein</li>
            <li>Une rémunération attractive selon profil et expérience</li>
            <li>Des formations régulières pour développer vos compétences</li>
            <li>Des outils et équipements de qualité</li>
            <li>Une mutuelle d'entreprise avantageuse</li>
            <li>Des perspectives d'évolution au sein de notre entreprise</li>
          </ul>
        `,
        salary: 'Selon profil et expérience',
        experience: '2 ans minimum',
        education: 'CAP/BEP ou Bac Pro Électricité',
        publishDate: new Date('2023-05-05'),
        featured: false
      },
      {
        title: 'Plombier (H/F)',
        slug: 'plombier-hf',
        location: 'Bordeaux',
        type: 'CDI',
        category: 'technique',
        description: 'Nous recherchons un plombier expérimenté pour divers projets de rénovation.',
        fullDescription: `
          <p>BATIHR+ recherche un(e) Plombier(ère) qualifié(e) pour rejoindre notre équipe technique.</p>
          
          <h4>Description du poste :</h4>
          <p>Au sein de notre équipe, vous serez chargé(e) de :</p>
          <ul>
            <li>Installer et réparer des systèmes de plomberie</li>
            <li>Poser des équipements sanitaires (lavabos, douches, WC, etc.)</li>
            <li>Installer et entretenir des systèmes de chauffage</li>
            <li>Détecter et réparer des fuites</li>
            <li>Déboucher des canalisations</li>
            <li>Conseiller les clients sur les solutions techniques adaptées</li>
          </ul>
          
          <h4>Profil recherché :</h4>
          <ul>
            <li>Titulaire d'un CAP/BEP ou Bac Pro en Plomberie</li>
            <li>Expérience minimum de 3 ans sur un poste similaire</li>
            <li>Maîtrise des techniques de plomberie</li>
            <li>Connaissance des normes en vigueur</li>
            <li>Permis B obligatoire</li>
            <li>Autonomie, rigueur et sens du service client</li>
            <li>Capacité à travailler en équipe</li>
          </ul>
          
          <h4>Nous offrons :</h4>
          <ul>
            <li>Un poste en CDI à temps plein</li>
            <li>Une rémunération attractive selon profil et expérience</li>
            <li>Des formations régulières pour développer vos compétences</li>
            <li>Des outils et équipements de qualité</li>
            <li>Une mutuelle d'entreprise avantageuse</li>
            <li>Des perspectives d'évolution au sein de notre entreprise</li>
          </ul>
        `,
        salary: 'Selon profil et expérience',
        experience: '3 ans minimum',
        education: 'CAP/BEP ou Bac Pro Plomberie',
        publishDate: new Date('2023-05-01'),
        featured: false
      },
      {
        title: 'Conducteur de Travaux (H/F)',
        slug: 'conducteur-de-travaux-hf',
        location: 'Paris',
        type: 'CDI',
        category: 'management',
        description: 'Gérez nos projets de construction du début à la fin avec excellence.',
        fullDescription: `
          <p>BATIHR+ recherche un(e) Conducteur(trice) de Travaux expérimenté(e) pour gérer nos projets de construction et de rénovation.</p>
          
          <h4>Description du poste :</h4>
          <p>En tant que Conducteur de Travaux, vous serez responsable de :</p>
          <ul>
            <li>Préparer et organiser les chantiers</li>
            <li>Élaborer les plannings et suivre l'avancement des travaux</li>
            <li>Gérer les équipes et les sous-traitants</li>
            <li>Assurer le respect des délais, des coûts et de la qualité</li>
            <li>Gérer les approvisionnements et les commandes</li>
            <li>Animer les réunions de chantier</li>
            <li>Veiller au respect des normes de sécurité et d'environnement</li>
            <li>Assurer la relation client et la coordination avec les différents intervenants</li>
          </ul>
          
          <h4>Profil recherché :</h4>
          <ul>
            <li>Formation Bac+2/3 en Bâtiment ou Génie Civil</li>
            <li>Expérience minimum de 5 ans en conduite de travaux</li>
            <li>Maîtrise des techniques du bâtiment et des normes de construction</li>
            <li>Compétences en management d'équipe et gestion de projet</li>
            <li>Maîtrise des outils informatiques (MS Project, AutoCAD, etc.)</li>
            <li>Permis B obligatoire</li>
            <li>Rigueur, organisation et capacité à gérer les priorités</li>
            <li>Excellentes aptitudes à la communication et à la négociation</li>
          </ul>
          
          <h4>Nous offrons :</h4>
          <ul>
            <li>Un poste en CDI à temps plein</li>
            <li>Une rémunération attractive selon profil et expérience</li>
            <li>Un véhicule de fonction</li>
            <li>Des formations régulières pour développer vos compétences</li>
            <li>Une mutuelle d'entreprise avantageuse</li>
            <li>Des perspectives d'évolution au sein de notre entreprise</li>
          </ul>
        `,
        salary: 'Selon profil et expérience',
        experience: '5 ans minimum',
        education: 'Bac+2/3 en Bâtiment ou Génie Civil',
        publishDate: new Date('2023-04-28'),
        featured: true
      },
      {
        title: 'Assistant Administratif (H/F)',
        slug: 'assistant-administratif-hf',
        location: 'Lyon',
        type: 'CDD',
        category: 'administratif',
        description: 'Soutenez notre équipe administrative dans la gestion quotidienne.',
        fullDescription: `
          <p>BATIHR+ recherche un(e) Assistant(e) Administratif(ve) pour soutenir notre équipe dans la gestion quotidienne.</p>
          
          <h4>Description du poste :</h4>
          <p>Au sein de notre équipe administrative, vous serez chargé(e) de :</p>
          <ul>
            <li>Assurer l'accueil téléphonique et physique</li>
            <li>Gérer le courrier et les emails</li>
            <li>Rédiger et mettre en forme des documents</li>
            <li>Organiser et planifier des réunions</li>
            <li>Gérer les agendas et les déplacements</li>
            <li>Assurer le suivi administratif des dossiers clients</li>
            <li>Participer à la facturation et au suivi des paiements</li>
          </ul>
          
          <h4>Profil recherché :</h4>
          <ul>
            <li>Formation Bac+2 en Assistanat de Direction ou équivalent</li>
            <li>Expérience minimum de 2 ans sur un poste similaire</li>
            <li>Maîtrise des outils bureautiques (Pack Office)</li>
            <li>Excellentes capacités rédactionnelles et organisationnelles</li>
            <li>Sens de l'accueil et du service client</li>
            <li>Discrétion et confidentialité</li>
            <li>Autonomie et polyvalence</li>
          </ul>
          
          <h4>Nous offrons :</h4>
          <ul>
            <li>Un poste en CDD de 6 mois (possibilité de CDI par la suite)</li>
            <li>Une rémunération selon profil et expérience</li>
            <li>Des horaires de bureau du lundi au vendredi</li>
            <li>Une ambiance de travail agréable et dynamique</li>
            <li>Une mutuelle d'entreprise</li>
          </ul>
        `,
        salary: 'Selon profil et expérience',
        experience: '2 ans minimum',
        education: 'Bac+2 en Assistanat de Direction',
        publishDate: new Date('2023-04-25'),
        featured: false
      },
      {
        title: 'Chargé d\'Affaires (H/F)',
        slug: 'charge-d-affaires-hf',
        location: 'Nantes',
        type: 'CDI',
        category: 'commercial',
        description: 'Développez notre portefeuille clients et gérez les projets commerciaux.',
        fullDescription: `
          <p>BATIHR+ recherche un(e) Chargé(e) d'Affaires pour développer notre activité commerciale.</p>
          
          <h4>Description du poste :</h4>
          <p>En tant que Chargé(e) d'Affaires, vous serez responsable de :</p>
          <ul>
            <li>Prospecter et développer un portefeuille clients</li>
            <li>Analyser les besoins des clients et proposer des solutions adaptées</li>
            <li>Réaliser des études techniques et financières</li>
            <li>Élaborer des devis et négocier les contrats</li>
            <li>Assurer le suivi des projets de la commande à la livraison</li>
            <li>Coordonner les différents intervenants (bureau d'études, équipes techniques)</li>
            <li>Veiller à la satisfaction client et au respect des engagements</li>
          </ul>
          
          <h4>Profil recherché :</h4>
          <ul>
            <li>Formation Bac+2/3 en Bâtiment ou Commerce</li>
            <li>Expérience minimum de 3 ans dans un poste similaire</li>
            <li>Connaissance du secteur du bâtiment</li>
            <li>Compétences commerciales et techniques</li>
            <li>Maîtrise des outils informatiques</li>
            <li>Permis B obligatoire</li>
            <li>Sens de la négociation et orientation client</li>
            <li>Autonomie, rigueur et organisation</li>
          </ul>
          
          <h4>Nous offrons :</h4>
          <ul>
            <li>Un poste en CDI à temps plein</li>
            <li>Une rémunération attractive (fixe + variable)</li>
            <li>Un véhicule de fonction</li>
            <li>Des formations régulières pour développer vos compétences</li>
            <li>Une mutuelle d'entreprise avantageuse</li>
            <li>Des perspectives d'évolution au sein de notre entreprise</li>
          </ul>
        `,
        salary: 'Fixe + Variable selon performance',
        experience: '3 ans minimum',
        education: 'Bac+2/3 en Bâtiment ou Commerce',
        publishDate: new Date('2023-04-20'),
        featured: true
      },
      {
        title: 'Peintre (H/F)',
        slug: 'peintre-hf',
        location: 'Toulouse',
        type: 'CDI',
        category: 'technique',
        description: 'Mettez en valeur nos projets grâce à votre expertise en peinture.',
        fullDescription: `
          <p>BATIHR+ recherche un(e) Peintre qualifié(e) pour rejoindre notre équipe technique.</p>
          
          <h4>Description du poste :</h4>
          <p>Au sein de notre équipe, vous serez chargé(e) de :</p>
          <ul>
            <li>Préparer les surfaces à peindre (ponçage, rebouchage, enduit)</li>
            <li>Appliquer des peintures, vernis et lasures</li>
            <li>Poser des revêtements muraux (papier peint, toile de verre, etc.)</li>
            <li>Réaliser des finitions décoratives</li>
            <li>Conseiller les clients sur les choix de couleurs et de finitions</li>
            <li>Respecter les normes de sécurité et les délais d'intervention</li>
          </ul>
          
          <h4>Profil recherché :</h4>
          <ul>
            <li>Titulaire d'un CAP/BEP Peintre ou équivalent</li>
            <li>Expérience minimum de 2 ans sur un poste similaire</li>
            <li>Maîtrise des techniques de peinture et de revêtements</li>
            <li>Connaissance des normes de sécurité</li>
            <li>Permis B souhaité</li>
            <li>Minutie, précision et sens esthétique</li>
            <li>Autonomie et capacité à travailler en équipe</li>
          </ul>
          
          <h4>Nous offrons :</h4>
          <ul>
            <li>Un poste en CDI à temps plein</li>
            <li>Une rémunération selon profil et expérience</li>
            <li>Des formations régulières pour développer vos compétences</li>
            <li>Des outils et équipements de qualité</li>
            <li>Une mutuelle d'entreprise avantageuse</li>
            <li>Des perspectives d'évolution au sein de notre entreprise</li>
          </ul>
        `,
        salary: 'Selon profil et expérience',
        experience: '2 ans minimum',
        education: 'CAP/BEP Peintre',
        publishDate: new Date('2023-04-15'),
        featured: false
      }
    ];
    
    // Insérer les offres d'emploi dans la base de données
    await Job.bulkCreate(jobsData);
    
    console.log('Offres d\'emploi insérées avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des offres d\'emploi :', error);
  } finally {
    // Fermer la connexion
    await sequelize.close();
    process.exit(0);
  }
};

// Exécuter la fonction
seedJobs();
