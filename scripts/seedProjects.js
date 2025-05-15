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

// Définir le modèle Project directement dans ce script
const Project = sequelize.define('Project', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fullDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  client: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  surface: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gallery: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('gallery');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('gallery', JSON.stringify(value));
    }
  },
  testimonial: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('testimonial');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('testimonial', JSON.stringify(value));
    }
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

const seedProjects = async () => {
  try {
    // Tester la connexion
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');

    // Synchroniser le modèle avec la base de données (créer la table)
    await sequelize.sync({ force: false }); // force: false pour ne pas supprimer la table si elle existe déjà
    console.log('Table Projects synchronisée avec succès');

    // Vérifier si des projets existent déjà
    const count = await Project.count();
    if (count > 0) {
      console.log('Des projets existent déjà dans la base de données.');
      await sequelize.close();
      process.exit(0);
      return;
    }

    // Données des projets à insérer
    const projectsData = [
      {
        title: 'Rénovation complète d\'un appartement haussmannien',
        slug: 'renovation-appartement-haussmannien',
        description: 'Rénovation complète d\'un appartement de 120m² dans le style haussmannien à Paris.',
        fullDescription: `
          <p>Ce projet de rénovation complète d'un appartement haussmannien de 120m² situé dans le 8ème arrondissement de Paris a été un véritable défi technique et esthétique. Notre client souhaitait conserver l'esprit et les éléments caractéristiques de ce type d'architecture tout en apportant une touche de modernité et de confort.</p>
          
          <p>Nous avons commencé par une phase d'étude approfondie pour identifier les éléments architecturaux d'origine à préserver : moulures, parquet en point de Hongrie, cheminées en marbre, etc. Ensuite, nous avons élaboré un plan de rénovation qui respecte ces éléments tout en répondant aux besoins contemporains du client.</p>
          
          <h3>Les travaux réalisés comprennent :</h3>
          <ul>
            <li>Restauration des moulures et des corniches</li>
            <li>Rénovation du parquet en point de Hongrie</li>
            <li>Restauration des cheminées en marbre</li>
            <li>Réfection complète de l'électricité et de la plomberie</li>
            <li>Création d'une cuisine ouverte sur le séjour</li>
            <li>Rénovation complète de deux salles de bains</li>
            <li>Installation d'un système de chauffage au sol</li>
            <li>Mise en place d'une isolation phonique et thermique</li>
          </ul>
          
          <p>Le résultat est un appartement qui allie le charme de l'ancien et le confort du moderne, avec des espaces de vie lumineux et fonctionnels qui répondent parfaitement aux attentes de notre client.</p>
        `,
        category: 'renovation',
        location: 'Paris, France',
        year: 2022,
        client: 'M. et Mme Dupont',
        surface: '120 m²',
        duration: '6 mois',
        image: '/images/projects/project-1.jpg',
        gallery: [
          '/images/projects/project-1-gallery-1.jpg',
          '/images/projects/project-1-gallery-2.jpg',
          '/images/projects/project-1-gallery-3.jpg',
          '/images/projects/project-1-gallery-4.jpg'
        ],
        testimonial: {
          content: "BATIHR+ a réalisé un travail exceptionnel pour la rénovation de notre appartement haussmannien. Ils ont su préserver le charme de l'ancien tout en apportant le confort moderne que nous recherchions. Nous sommes ravis du résultat et recommandons vivement leurs services.",
          author: "M. Dupont",
          position: "Propriétaire"
        },
        featured: true
      },
      {
        title: 'Construction d\'une maison contemporaine',
        slug: 'construction-maison-contemporaine',
        description: 'Construction d\'une maison contemporaine de 180m² avec piscine à Lyon.',
        fullDescription: `
          <p>Ce projet de construction d'une maison contemporaine de 180m² à Lyon a été conçu pour une famille de quatre personnes souhaitant un espace de vie moderne, lumineux et respectueux de l'environnement.</p>
          
          <p>Après plusieurs réunions avec nos clients pour comprendre leurs besoins et leurs aspirations, nous avons élaboré un plan architectural qui privilégie les espaces ouverts, la lumière naturelle et l'intégration harmonieuse dans l'environnement.</p>
          
          <h3>Les caractéristiques principales de cette construction :</h3>
          <ul>
            <li>Architecture contemporaine avec des lignes épurées</li>
            <li>Grande pièce de vie ouverte sur le jardin</li>
            <li>Baies vitrées à galandage pour maximiser la lumière naturelle</li>
            <li>Quatre chambres dont une suite parentale</li>
            <li>Piscine à débordement intégrée dans la terrasse</li>
            <li>Système domotique pour la gestion de l'énergie</li>
                       <li>Panneaux solaires pour la production d'eau chaude</li>
            <li>Système de récupération des eaux de pluie</li>
            <li>Isolation thermique renforcée</li>
          </ul>
          
          <p>La construction a été réalisée avec des matériaux de haute qualité et des techniques respectueuses de l'environnement. Le résultat est une maison moderne, confortable et économe en énergie qui répond parfaitement aux attentes de nos clients.</p>
        `,
        category: 'construction',
        location: 'Lyon, France',
        year: 2021,
        client: 'Famille Martin',
        surface: '180 m²',
        duration: '10 mois',
        image: '/images/projects/project-2.jpg',
        gallery: [
          '/images/projects/project-2-gallery-1.jpg',
          '/images/projects/project-2-gallery-2.jpg',
          '/images/projects/project-2-gallery-3.jpg',
          '/images/projects/project-2-gallery-4.jpg'
        ],
        testimonial: {
          content: "Nous sommes extrêmement satisfaits de notre nouvelle maison. BATIHR+ a su transformer notre vision en réalité, avec un souci du détail remarquable. La qualité de la construction et le respect des délais ont été exemplaires.",
          author: "M. Martin",
          position: "Propriétaire"
        },
        featured: true
      },
      {
        title: 'Extension d\'une maison familiale',
        slug: 'extension-maison-familiale',
        description: 'Extension de 40m² d\'une maison familiale pour créer un espace de vie supplémentaire.',
        fullDescription: `
          <p>Ce projet d'extension d'une maison familiale à Bordeaux visait à créer un espace de vie supplémentaire de 40m² pour une famille dont les besoins évoluaient. L'objectif était d'agrandir la maison tout en préservant son caractère et en assurant une transition harmonieuse entre l'existant et la nouvelle construction.</p>
          
          <p>Après une étude approfondie de la structure existante et des contraintes urbanistiques, nous avons proposé une extension contemporaine qui s'intègre parfaitement à la maison d'origine tout en apportant une touche de modernité.</p>
          
          <h3>Les travaux réalisés comprennent :</h3>
          <ul>
            <li>Création d'une extension de 40m² en ossature bois</li>
            <li>Installation de grandes baies vitrées pour maximiser la lumière naturelle</li>
            <li>Aménagement d'un espace salon/salle à manger ouvert sur le jardin</li>
            <li>Création d'une mezzanine pour un espace bureau</li>
            <li>Installation d'un système de chauffage par le sol</li>
            <li>Mise en place d'une isolation thermique performante</li>
            <li>Aménagement d'une terrasse en bois</li>
          </ul>
          
          <p>Le résultat est un espace de vie lumineux et convivial qui répond parfaitement aux besoins de la famille tout en valorisant leur propriété.</p>
        `,
        category: 'extension',
        location: 'Bordeaux, France',
        year: 2023,
        client: 'Famille Dubois',
        surface: '40 m²',
        duration: '4 mois',
        image: '/images/projects/project-3.jpg',
        gallery: [
          '/images/projects/project-3-gallery-1.jpg',
          '/images/projects/project-3-gallery-2.jpg',
          '/images/projects/project-3-gallery-3.jpg',
          '/images/projects/project-3-gallery-4.jpg'
        ],
        testimonial: {
          content: "L'extension réalisée par BATIHR+ a transformé notre maison et notre quotidien. L'espace est parfaitement intégré à notre maison existante tout en apportant une touche contemporaine que nous adorons. Le chantier a été mené avec professionnalisme et dans le respect des délais.",
          author: "Mme Dubois",
          position: "Propriétaire"
        },
        featured: true
      },
      {
        title: 'Aménagement d\'un jardin paysager',
        slug: 'amenagement-jardin-paysager',
        description: 'Création d\'un jardin paysager avec terrasse, bassin et espace détente.',
        fullDescription: `
          <p>Ce projet d'aménagement paysager à Nantes consistait à transformer un jardin de 500m² en un espace extérieur esthétique et fonctionnel, adapté aux besoins d'une famille qui souhaitait profiter pleinement de son extérieur tout au long de l'année.</p>
          
          <p>Après une analyse du terrain et des souhaits des propriétaires, nous avons conçu un plan d'aménagement qui divise l'espace en plusieurs zones distinctes tout en créant une harmonie d'ensemble.</p>
          
          <h3>Les aménagements réalisés comprennent :</h3>
          <ul>
            <li>Création d'une terrasse en bois exotique de 50m²</li>
            <li>Installation d'un bassin ornemental avec cascade</li>
            <li>Aménagement d'un espace détente avec pergola bioclimatique</li>
            <li>Création d'un potager surélevé</li>
            <li>Plantation d'arbres, arbustes et vivaces adaptés au climat local</li>
            <li>Installation d'un système d'arrosage automatique</li>
            <li>Mise en place d'un éclairage paysager</li>
            <li>Création d'allées en pas japonais</li>
          </ul>
          
          <p>Le résultat est un jardin équilibré qui offre à la fois des espaces de convivialité, de détente et de nature, tout en nécessitant un entretien raisonnable.</p>
        `,
        category: 'amenagement',
        location: 'Nantes, France',
        year: 2022,
        client: 'M. et Mme Leroy',
        surface: '500 m²',
        duration: '3 mois',
        image: '/images/projects/project-4.jpg',
        gallery: [
          '/images/projects/project-4-gallery-1.jpg',
          '/images/projects/project-4-gallery-2.jpg',
          '/images/projects/project-4-gallery-3.jpg',
          '/images/projects/project-4-gallery-4.jpg'
        ],
        testimonial: {
          content: "BATIHR+ a transformé notre jardin en un véritable havre de paix. Chaque espace a été pensé avec soin et correspond parfaitement à nos attentes. Nous profitons désormais de notre extérieur en toutes saisons et recevons de nombreux compliments de nos invités.",
          author: "M. Leroy",
          position: "Propriétaire"
        },
        featured: false
      },
      {
        title: 'Rénovation énergétique d\'une maison ancienne',
        slug: 'renovation-energetique-maison-ancienne',
        description: 'Rénovation énergétique complète d\'une maison ancienne pour améliorer sa performance thermique.',
        fullDescription: `
          <p>Ce projet de rénovation énergétique concernait une maison ancienne de 150m² à Strasbourg, construite dans les années 1960 et présentant de nombreuses déperditions thermiques. L'objectif était d'améliorer significativement la performance énergétique du bâtiment tout en préservant son caractère.</p>
          
          <p>Après un audit énergétique complet, nous avons élaboré un plan de rénovation global visant à réduire la consommation d'énergie et à améliorer le confort des occupants.</p>
          
          <h3>Les travaux réalisés comprennent :</h3>
          <ul>
            <li>Isolation des murs par l'extérieur avec un enduit à la chaux</li>
            <li>Isolation des combles perdus</li>
            <li>Remplacement des fenêtres simple vitrage par des fenêtres à double vitrage à isolation renforcée</li>
            <li>Installation d'une pompe à chaleur air-eau en remplacement de la chaudière au fioul</li>
            <li>Mise en place d'un système de ventilation mécanique contrôlée (VMC) double flux</li>
            <li>Installation de panneaux photovoltaïques sur le toit</li>
            <li>Réfection de l'électricité avec installation d'un système domotique pour la gestion de l'énergie</li>
          </ul>
          
          <p>Grâce à ces travaux, la consommation énergétique de la maison a été réduite de 70% et le confort thermique a été considérablement amélioré, tant en hiver qu'en été.</p>
        `,
        category: 'renovation',
        location: 'Strasbourg, France',
        year: 2021,
        client: 'M. et Mme Petit',
        surface: '150 m²',
        duration: '5 mois',
        image: '/images/projects/project-5.jpg',
        gallery: [
          '/images/projects/project-5-gallery-1.jpg',
          '/images/projects/project-5-gallery-2.jpg',
          '/images/projects/project-5-gallery-3.jpg',
          '/images/projects/project-5-gallery-4.jpg'
        ],
        testimonial: {
          content: "La rénovation énergétique réalisée par BATIHR+ a transformé notre maison. Nous avons gagné en confort et réalisé d'importantes économies sur nos factures d'énergie. L'équipe a été à l'écoute de nos besoins et a su nous conseiller efficacement tout au long du projet.",
          author: "Mme Petit",
          position: "Propriétaire"
        },
        featured: false
      },
      {
        title: 'Construction d\'un immeuble de bureaux',
        slug: 'construction-immeuble-bureaux',
        description: 'Construction d\'un immeuble de bureaux de 5 étages au cœur de Marseille.',
        fullDescription: `
          <p>Ce projet de construction d'un immeuble de bureaux de 5 étages au cœur de Marseille représentait un défi majeur en termes d'intégration urbaine et de performance environnementale. Notre client, une société d'investissement immobilier, souhaitait un bâtiment moderne, fonctionnel et respectueux de l'environnement.</p>
          
          <p>Après une phase d'étude approfondie et de concertation avec les autorités locales, nous avons conçu un immeuble qui s'intègre harmonieusement dans le tissu urbain tout en offrant des espaces de travail de qualité.</p>
          
          <h3>Les caractéristiques principales de cette construction :</h3>
          <ul>
            <li>Structure en béton armé avec façade vitrée à haute performance énergétique</li>
            <li>5 étages offrant une surface totale de 3000m² de bureaux modulables</li>
            <li>Terrasse végétalisée accessible au dernier étage</li>
            <li>Parking souterrain de 50 places</li>
            <li>Système de récupération des eaux de pluie</li>
            <li>Toiture équipée de panneaux photovoltaïques</li>
            <li>Système de climatisation/chauffage à haute efficacité énergétique</li>
            <li>Certification HQE (Haute Qualité Environnementale)</li>
          </ul>
          
          <p>Le bâtiment, livré en 2023, offre des espaces de travail lumineux et confortables, tout en affichant une consommation énergétique inférieure de 40% aux standards actuels.</p>
        `,
        category: 'construction',
        location: 'Marseille, France',
        year: 2023,
        client: 'Méditerranée Investissements',
        surface: '3000 m²',
        duration: '18 mois',
        image: '/images/projects/project-6.jpg',
        gallery: [
          '/images/projects/project-6-gallery-1.jpg',
          '/images/projects/project-6-gallery-2.jpg',
          '/images/projects/project-6-gallery-3.jpg',
          '/images/projects/project-6-gallery-4.jpg'
        ],
        testimonial: {
          content: "BATIHR+ a réalisé un travail remarquable pour la construction de notre immeuble de bureaux. Leur expertise technique et leur capacité à gérer un projet de cette envergure ont été déterminantes dans la réussite de cette opération. Le bâtiment répond parfaitement à nos attentes en termes de qualité, de fonctionnalité et de performance environnementale.",
          author: "Jean Moreau",
          position: "Directeur, Méditerranée Investissements"
        },
        featured: false
      }
    ];
    
    // Insérer les projets dans la base de données
    await Project.bulkCreate(projectsData);
    
    console.log('Projets insérés avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des projets :', error);
  } finally {
    // Fermer la connexion
    await sequelize.close();
    process.exit(0);
  }
};

// Exécuter la fonction
seedProjects();
