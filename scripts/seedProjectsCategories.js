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

const seedCategoryProjects = async () => {
  try {
    // Tester la connexion
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');

    // Synchroniser le modèle avec la base de données (créer la table)
    await sequelize.sync({ force: false }); // force: false pour ne pas supprimer la table si elle existe déjà
    console.log('Table Projects synchronisée avec succès');

    // Données des projets à insérer
    const projectsData = [
      {
        title: 'Réparation de cheminée sur toit pentu',
        slug: 'reparation-cheminee-toit-pentu',
        description: 'Intervention sur une cheminée endommagée située sur un toit à forte pente dans un quartier historique.',
        fullDescription: `
          <p>Ce projet concernait la réparation d'une cheminée en briques anciennes située sur un toit à forte pente (45°) dans le centre historique de Lille. L'accès était particulièrement difficile en raison de la hauteur du bâtiment (4 étages) et de l'étroitesse des rues environnantes.</p>
          
          <p>Après une inspection minutieuse, nous avons constaté une dégradation importante des joints et plusieurs briques fissurées, créant un risque de chute de matériaux et d'infiltrations d'eau.</p>
          
          <h3>Les travaux réalisés comprennent :</h3>
          <ul>
            <li>Installation d'un échafaudage sécurisé avec système d'ancrage spécifique</li>
            <li>Mise en place d'une ligne de vie temporaire sur le toit</li>
            <li>Démontage partiel de la cheminée endommagée</li>
            <li>Remplacement des briques défectueuses par des briques d'époque similaires</li>
            <li>Rejointoiement complet avec un mortier à la chaux adapté aux bâtiments anciens</li>
            <li>Installation d'un chapeau de protection en zinc</li>
            <li>Vérification et nettoyage du conduit</li>
          </ul>
          
          <p>Cette intervention délicate a nécessité l'expertise de nos cordistes spécialisés et a permis de préserver l'authenticité de ce bâtiment classé tout en garantissant la sécurité des occupants et des passants.</p>
        `,
        category: 'Travaux d\'accès difficiles',
        location: 'Lille, France',
        year: 2022,
        client: 'Copropriété Les Vieux Remparts',
        surface: 'N/A',
        duration: '2 semaines',
        image: '/images/projects/acces-difficile-1.jpg',
        gallery: [
          '/images/projects/acces-difficile-1-gallery-1.jpg',
          '/images/projects/acces-difficile-1-gallery-2.jpg',
          '/images/projects/acces-difficile-1-gallery-3.jpg',
          '/images/projects/acces-difficile-1-gallery-4.jpg'
        ],
        testimonial: {
          content: "L'équipe de BATIHR+ a fait preuve d'un grand professionnalisme pour cette intervention complexe. Malgré les difficultés d'accès, ils ont réalisé un travail de qualité dans les délais prévus, tout en respectant les contraintes liées au caractère historique de notre immeuble.",
          author: "M. Lefebvre",
          position: "Président du conseil syndical"
        },
        featured: true
      },
      {
        title: 'Restauration d\'une cheminée d\'époque',
        slug: 'restauration-cheminee-epoque',
        description: 'Restauration complète d\'une cheminée du 19ème siècle dans un hôtel particulier.',
        fullDescription: `
          <p>Ce projet de fumisterie concernait la restauration complète d'une cheminée monumentale du 19ème siècle dans un hôtel particulier du 7ème arrondissement de Paris. Cette cheminée en marbre et fonte présentait des signes importants de dégradation et n'était plus fonctionnelle depuis plusieurs décennies.</p>
          
          <p>Notre mission consistait à restaurer cet élément patrimonial tout en le rendant à nouveau opérationnel pour permettre au propriétaire d'utiliser un insert à bois moderne.</p>
          
          <h3>Les travaux réalisés comprennent :</h3>
          <ul>
            <li>Diagnostic complet du conduit et de la structure</li>
            <li>Nettoyage et débistrage du conduit existant</li>
            <li>Tubage du conduit avec un matériau adapté aux normes actuelles</li>
            <li>Restauration des éléments en marbre (nettoyage, polissage, réparation des fissures)</li>
            <li>Restauration des éléments en fonte (traitement antirouille, peinture haute température)</li>
            <li>Installation d'un insert à bois haute performance énergétique</li>
            <li>Création d'une arrivée d'air frais conforme aux normes actuelles</li>
            <li>Remise en état des ornements et moulures</li>
          </ul>
          
          <p>Cette restauration a permis de conserver l'esthétique d'origine de cette cheminée d'exception tout en lui apportant les performances et la sécurité d'une installation moderne.</p>
        `,
        category: 'Fumisterie',
        location: 'Paris, France',
        year: 2021,
        client: 'M. et Mme Beaumont',
        surface: 'N/A',
        duration: '1 mois',
        image: '/images/projects/fumisterie-1.jpg',
        gallery: [
          '/images/projects/fumisterie-1-gallery-1.jpg',
          '/images/projects/fumisterie-1-gallery-2.jpg',
          '/images/projects/fumisterie-1-gallery-3.jpg',
          '/images/projects/fumisterie-1-gallery-4.jpg'
        ],
        testimonial: {
          content: "La restauration de notre cheminée par BATIHR+ est tout simplement remarquable. Ils ont su préserver l'authenticité de cet élément patrimonial tout en le rendant fonctionnel avec les standards actuels. Leur expertise en fumisterie est indéniable et nous recommandons vivement leurs services.",
          author: "Mme Beaumont",
          position: "Propriétaire"
        },
        featured: false
      },
      {
        title: 'Étanchéité toiture-terrasse immeuble collectif',
        slug: 'etancheite-toiture-terrasse-immeuble',
        description: 'Réfection complète de l\'étanchéité d\'une toiture-terrasse de 400m² sur un immeuble résidentiel.',
        fullDescription: `
          <p>Ce projet concernait la réfection complète de l'étanchéité d'une toiture-terrasse de 400m² sur un immeuble résidentiel de 6 étages à Nice. L'ancienne membrane d'étanchéité, datant de plus de 20 ans, présentait de nombreuses fissures et avait causé plusieurs infiltrations dans les appartements du dernier étage.</p>
          
          <p>Notre intervention visait non seulement à résoudre définitivement ces problèmes d'infiltration, mais aussi à améliorer l'isolation thermique du bâtiment et à créer une terrasse végétalisée accessible aux résidents.</p>
          
          <h3>Les travaux réalisés comprennent :</h3>
          <ul>
            <li>Dépose complète de l'ancien complexe d'étanchéité jusqu'au support</li>
            <li>Réparation des zones de béton dégradées</li>
            <li>Mise en place d'une nouvelle isolation thermique performante (R > 5 m².K/W)</li>
            <li>Installation d'un système d'étanchéité bicouche élastomère avec protection anti-racines</li>
            <li>Création de zones végétalisées avec système de rétention d'eau</li>
            <li>Installation d'un platelage bois sur plots pour les zones de circulation</li>
            <li>Mise en place d'un système de récupération des eaux pluviales</li>
            <li>Réfection complète des relevés d'étanchéité et des évacuations d'eau</li>
          </ul>
          
          <p>Cette rénovation a non seulement résolu les problèmes d'infiltration mais a également transformé un espace inutilisé en un lieu de vie agréable pour les résidents, tout en améliorant significativement la performance thermique du bâtiment.</p>
        `,
        category: 'Étanchéité',
        location: 'Nice, France',
        year: 2023,
        client: 'Copropriété Les Terrasses du Sud',
        surface: '400 m²',
        duration: '2 mois',
        image: '/images/projects/etancheite-1.jpg',
        gallery: [
          '/images/projects/etancheite-1-gallery-1.jpg',
          '/images/projects/etancheite-1-gallery-2.jpg',
          '/images/projects/etancheite-1-gallery-3.jpg',
          '/images/projects/etancheite-1-gallery-4.jpg'
        ],
        testimonial: {
          content: "Après des années de problèmes d'infiltration, BATIHR+ a enfin apporté une solution durable. La qualité de leur travail est exceptionnelle et la transformation de notre toiture en terrasse végétalisée a créé un espace commun très apprécié par tous les copropriétaires. Un investissement qui a vraiment valorisé notre immeuble.",
          author: "M. Rossi",
          position: "Syndic de copropriété"
        },
        featured: true
      },
      {
        title: 'Rénovation toiture en ardoise château historique',
        slug: 'renovation-toiture-ardoise-chateau',
        description: 'Restauration complète de la toiture en ardoise d\'un château du 18ème siècle classé monument historique.',
        fullDescription: `
          <p>Ce projet exceptionnel concernait la restauration complète de la toiture en ardoise d'un château du 18ème siècle classé monument historique dans la région de la Loire. La toiture d'une surface de 800m² présentait de nombreuses dégradations dues à l'âge et aux intempéries, menaçant l'intégrité de ce patrimoine architectural.</p>
          
          <p>En collaboration étroite avec les Architectes des Bâtiments de France, nous avons élaboré un plan de restauration respectant scrupuleusement les techniques et matériaux d'origine.</p>
          
          <h3>Les travaux réalisés comprennent :</h3>
          <ul>
            <li>Dépose soigneuse des ardoises existantes avec récupération des éléments réutilisables</li>
            <li>Restauration complète de la charpente en chêne avec remplacement des pièces endommagées</li>
            <li>Traitement préventif et curatif de l'ensemble de la structure bois</li>
            <li>Pose d'un écran sous-toiture respirant</li>
            <li>Installation de nouvelles ardoises naturelles de Trélazé, taillées à la main</li>
            <li>Restauration des ornements de toiture (épis, girouettes, lucarnes)</li>
            <li>Réfection complète des gouttières et descentes en cuivre</li>
            <li>Restauration des 6 cheminées monumentales en pierre</li>
          </ul>
          
          <p>Cette restauration minutieuse, réalisée par nos compagnons couvreurs spécialisés dans le patrimoine, a permis de redonner à ce château son aspect d'origine tout en garantissant une protection durable contre les intempéries.</p>
        `,
        category: 'Couverture',
        location: 'Vallée de la Loire, France',
        year: 2022,
        client: 'Fondation du Patrimoine Français',
        surface: '800 m²',
        duration: '8 mois',
        image: '/images/projects/couverture-1.jpg',
        gallery: [
          '/images/projects/couverture-1-gallery-1.jpg',
          '/images/projects/couverture-1-gallery-2.jpg',
          '/images/projects/couverture-1-gallery-3.jpg',
          '/images/projects/couverture-1-gallery-4.jpg'
        ],
        testimonial: {
          content: "Le travail réalisé par BATIHR+ sur la toiture de notre château est tout simplement exceptionnel. Leur expertise en matière de restauration de monuments historiques est remarquable. Ils ont su respecter l'authenticité du bâtiment tout en apportant des solutions techniques durables. Un travail d'orfèvre qui mérite d'être salué.",
          author: "M. de Montfort",
          position: "Président de la Fondation"
        },
        featured: true
      },
      {
        title: 'Rénovation complète de salle de bains haut de gamme',
        slug: 'renovation-salle-de-bains-luxe',
        description: 'Transformation d\'une salle de bains classique en espace bien-être avec équipements haut de gamme.',
        fullDescription: `
          <p>Ce projet de plomberie concernait la transformation complète d'une salle de bains traditionnelle en un véritable espace bien-être haut de gamme dans un appartement du 16ème arrondissement de Paris. Les propriétaires souhaitaient créer un lieu alliant esthétique raffinée et technologies de pointe.</p>
          
          <p>Après une étude approfondie des contraintes techniques du bâtiment ancien et des souhaits des clients, nous avons conçu et réalisé un espace sur mesure intégrant les dernières innovations en matière de plomberie sanitaire.</p>
          
          <h3>Les travaux réalisés comprennent :</h3>
          <ul>
            <li>Démolition complète de l'ancienne salle de bains</li>
            <li>Réfection totale des réseaux d'alimentation en eau (cuivre et multicouche)</li>
            <li>Installation d'un système de filtration d'eau centralisé</li>
            <li>Mise en place d'un plancher chauffant hydraulique basse température</li>
            <li>Installation d'une douche à l'italienne avec système hydromassant</li>
            <li>Pose d'une baignoire balnéo en îlot</li>
            <li>Installation d'une double vasque sur meuble suspendu</li>
            <li>Mise en place d'une robinetterie thermostatique haut de gamme</li>
            <li>Installation d'un WC japonais avec fonction lavante et séchante</li>
            <li>Création d'un système domotique pour le contrôle de l'eau et de la température</li>
          </ul>
          
          <p>Cette réalisation sur mesure a transformé une simple salle de bains en un véritable espace de détente et de bien-être, alliant esthétique contemporaine et fonctionnalités avancées.</p>
        `,
        category: 'Plomberie',
        location: 'Paris, France',
        year: 2023,
        client: 'M. et Mme Laurent',
        surface: '15 m²',
        duration: '6 semaines',
        image: '/images/projects/plomberie-1.jpg',
        gallery: [
          '/images/projects/plomberie-1-gallery-1.jpg',
          '/images/projects/plomberie-1-gallery-2.jpg',
          '/images/projects/plomberie-1-gallery-3.jpg',
          '/images/projects/plomberie-1-gallery-4.jpg'
        ],
        testimonial: {
          content: "BATIHR+ a transformé notre salle de bains en un véritable spa privé. La qualité de leur travail de plomberie est irréprochable et leur attention aux détails remarquable. Chaque élément a été parfaitement intégré et le résultat dépasse largement nos attentes. Un grand merci à toute l'équipe pour leur professionnalisme et leur créativité.",
          author: "Mme Laurent",
          position: "Propriétaire"
        },
        featured: false
      },
      {
        title: 'Installation système de récupération d\'eau de pluie',
        slug: 'installation-recuperation-eau-pluie',
        description: 'Mise en place d\'un système complet de récupération et utilisation des eaux pluviales pour une maison écologique.',
        fullDescription: `
          <p>Ce projet innovant concernait l'installation d'un système complet de récupération et d'utilisation des eaux pluviales pour une maison écologique près de Rennes. Les propriétaires, très sensibles aux questions environnementales, souhaitaient réduire significativement leur consommation d'eau potable.</p>
          
          <p>Après une étude approfondie de la pluviométrie locale, de la surface de toiture disponible et des besoins en eau des occupants, nous avons conçu et installé un système sur mesure permettant de couvrir environ 60% des besoins en eau non potable de la maison.</p>
          
          <h3>Les travaux réalisés comprennent :</h3>
          <ul>
            <li>Installation de gouttières filtrantes sur l'ensemble de la toiture</li>
            <li>Mise en place d'une cuve enterrée de 10 000 litres en béton</li>
            <li>Installation d'un système de filtration à plusieurs niveaux</li>
            <li>Mise en place d'une pompe immergée à détection de niveau</li>
            <li>Création d'un réseau de distribution spécifique pour l'eau de pluie</li>
            <li>Raccordement aux toilettes, lave-linge et robinets extérieurs</li>
            <li>Installation d'un système de traitement UV pour certains usages</li>
            <li>Mise en place d'un dispositif de gestion électronique avec affichage de la consommation</li>
            <li>Installation d'un système de trop-plein avec infiltration dans le jardin</li>
          </ul>
          
          <p>Cette installation permet désormais aux propriétaires d'économiser environ 80 000 litres d'eau potable par an, tout en disposant d'une eau de qualité pour leurs besoins domestiques non alimentaires et l'arrosage de leur jardin.</p>
        `,
        category: 'Plomberie',
        location: 'Rennes, France',
        year: 2022,
        client: 'Famille Morvan',
        surface: 'Maison de 150m² sur terrain de 800m²',
        duration: '3 semaines',
        image: '/images/projects/plomberie-2.jpg',
        gallery: [
          '/images/projects/plomberie-2-gallery-1.jpg',
          '/images/projects/plomberie-2-gallery-2.jpg',
          '/images/projects/plomberie-2-gallery-3.jpg',
          '/images/projects/plomberie-2-gallery-4.jpg'
        ],
        testimonial: {
          content: "Le système de récupération d'eau de pluie installé par BATIHR+ fonctionne parfaitement depuis plus d'un an. Nous avons réduit considérablement notre facture d'eau et contribuons à préserver cette ressource précieuse. L'équipe a fait preuve d'un grand professionnalisme et nous a parfaitement conseillés tout au long du projet.",
          author: "M. Morvan",
          position: "Propriétaire"
        },
        featured: false
      },
      {
        title: 'Intervention sur façade d\'immeuble classé',
        slug: 'intervention-facade-immeuble-classe',
        description: 'Réparation et sécurisation d\'éléments de façade sur un immeuble classé en centre-ville.',
        fullDescription: `
          <p>Ce projet concernait une intervention délicate sur la façade d'un immeuble classé du 19ème siècle situé en plein centre de Toulouse. Plusieurs éléments décoratifs en pierre présentaient des signes de dégradation avancée, créant un risque pour la sécurité des passants.</p>
          
          <p>L'accès était particulièrement complexe en raison de l'étroitesse de la rue, de la hauteur du bâtiment (5 étages) et de l'impossibilité d'installer un échafaudage traditionnel sans perturber gravement la circulation et les commerces.</p>
          
          <h3>Les travaux réalisés comprennent :</h3>
          <ul>
            <li>Mise en place d'une équipe de cordistes spécialisés en travaux sur patrimoine</li>
            <li>Installation de systèmes d'ancrage temporaires sur le toit</li>
            <li>Inspection détaillée de l'ensemble des éléments décoratifs de la façade</li>
            <li>Purge des éléments instables présentant un danger immédiat</li>
            <li>Consolidation des corniches et balcons fragilisés</li>
            <li>Restauration des éléments sculptés endommagés avec des matériaux compatibles</li>
            <li>Traitement des fissures par injection de résine adaptée aux bâtiments anciens</li>
            <li>Application d'un hydrofuge incolore respectant la perméabilité de la pierre</li>
          </ul>
          
          <p>Cette intervention d'urgence a permis de sécuriser la façade tout en préservant son authenticité historique, le tout sans perturber l'activité commerciale de la rue. Une solution de restauration plus complète a ensuite été programmée en coordination avec les Architectes des Bâtiments de France.</p>
        `,
        category: 'Travaux d\'accès difficiles',
        location: 'Toulouse, France',
        year: 2023,
        client: 'SCI Patrimoine Toulousain',
        surface: 'Façade de 250m²',
        duration: '3 semaines',
        image: '/images/projects/acces-difficile-2.jpg',
        gallery: [
          '/images/projects/acces-difficile-2-gallery-1.jpg',
          '/images/projects/acces-difficile-2-gallery-2.jpg',
          '/images/projects/acces-difficile-2-gallery-3.jpg',
          '/images/projects/acces-difficile-2-gallery-4.jpg'
        ],
        testimonial: {
          content: "Face à une situation d'urgence sur notre immeuble classé, BATIHR+ a su intervenir avec rapidité et efficacité. Leur équipe de cordistes a réalisé un travail remarquable, alliant technicité et respect du patrimoine. Leur solution a permis d'éviter l'installation d'un échafaudage qui aurait été catastrophique pour nos locataires commerciaux.",
          author: "Mme Fabre",
          position: "Gérante, SCI Patrimoine Toulousain"
        },
        featured: false
      },
      {
        title: 'Rénovation de poêle à bois ancien',
        slug: 'renovation-poele-bois-ancien',
        description: 'Restauration et mise aux normes d\'un poêle à bois traditionnel dans une maison de campagne.',
        fullDescription: `
          <p>Ce projet de fumisterie concernait la restauration et la mise aux normes d'un poêle à bois traditionnel en fonte datant du début du 20ème siècle dans une maison de campagne en Auvergne. Les propriétaires souhaitaient conserver cet élément de patrimoine tout en le rendant fonctionnel et conforme aux normes de sécurité actuelles.</p>
          
          <p>Après un diagnostic approfondi, nous avons constaté que le poêle était en bon état structurel mais nécessitait une révision complète et une adaptation de son conduit d'évacuation.</p>
          
          <h3>Les travaux réalisés comprennent :</h3>
          <ul>
            <li>Démontage complet du poêle et nettoyage de tous ses éléments</li>
            <li>Remplacement des joints et des éléments intérieurs usés</li>
            <li>Traitement anti-rouille et application d'une peinture haute température</li>
            <li>Vérification et nettoyage du conduit existant</li>
            <li>Tubage du conduit avec un matériau adapté aux combustibles solides</li>
            <li>Installation d'un régulateur de tirage</li>
            <li>Création d'une arrivée d'air frais indépendante</li>
            <li>Mise en place d'une plaque de protection au sol conforme aux normes</li>
            <li>Tests d'étanchéité et de tirage</li>
          </ul>
          
          <p>Cette restauration a permis de conserver le charme de ce poêle ancien tout en lui apportant une efficacité thermique améliorée et une sécurité optimale. Les propriétaires peuvent désormais profiter d'un chauffage d'appoint efficace et authentique dans leur maison de campagne.</p>
        `,
        category: 'Fumisterie',
        location: 'Auvergne, France',
        year: 2022,
        client: 'M. et Mme Durand',
        surface: 'N/A',
        duration: '2 semaines',
        image: '/images/projects/fumisterie-2.jpg',
        gallery: [
          '/images/projects/fumisterie-2-gallery-1.jpg',
          '/images/projects/fumisterie-2-gallery-2.jpg',
          '/images/projects/fumisterie-2-gallery-3.jpg',
          '/images/projects/fumisterie-2-gallery-4.jpg'
        ],
        testimonial: {
          content: "Nous sommes enchantés du travail réalisé par BATIHR+ sur notre ancien poêle à bois. Ils ont su préserver son authenticité tout en le rendant parfaitement fonctionnel et sécurisé. Leur expertise en fumisterie est impressionnante et leur respect des éléments patrimoniaux très appréciable. Notre poêle est maintenant la pièce maîtresse de notre salon.",
          author: "M. Durand",
          position: "Propriétaire"
        },
        featured: false
      },
      {
        title: 'Étanchéité toiture végétalisée bâtiment écologique',
        slug: 'etancheite-toiture-vegetalisee-ecologique',
        description: 'Création d\'une toiture végétalisée sur un bâtiment écologique avec système de récupération d\'eau.',
        fullDescription: `
          <p>Ce projet innovant concernait la création d'une toiture végétalisée de 300m² sur un bâtiment écologique à vocation pédagogique près de Montpellier. L'objectif était de combiner performance d'étanchéité, isolation thermique renforcée, biodiversité urbaine et gestion des eaux pluviales.</p>
          
          <p>En collaboration avec un bureau d'études spécialisé en construction écologique, nous avons conçu un système complet intégrant plusieurs fonctions environnementales.</p>
          
          <h3>Les travaux réalisés comprennent :</h3>
          <ul>
            <li>Préparation du support avec création de pentes adaptées</li>
            <li>Installation d'une membrane d'étanchéité EPDM haute durabilité</li>
            <li>Mise en place d'une couche anti-racines</li>
            <li>Installation d'un système de drainage et rétention d'eau à réservoir</li>
            <li>Pose d'un substrat spécifique de faible densité et forte capacité de rétention</li>
            <li>Plantation de variétés végétales locales adaptées au climat méditerranéen</li>
            <li>Création de zones différenciées (prairie, sedum, aromatiques)</li>
            <li>Installation d'un système d'irrigation goutte-à-goutte alimenté par récupération d'eau de pluie</li>
            <li>Mise en place de capteurs d'humidité pour gestion automatisée de l'arrosage</li>
            <li>Création d'habitats pour la biodiversité (hôtels à insectes, nichoirs)</li>
          </ul>
          
          <p>Cette toiture végétalisée contribue à l'isolation thermique du bâtiment, réduit les îlots de chaleur urbains, favorise la biodiversité et permet une gestion optimisée des eaux pluviales. Elle sert également de support pédagogique pour sensibiliser le public aux solutions écologiques en construction.</p>
        `,
        category: 'Étanchéité',
        location: 'Montpellier, France',
        year: 2023,
        client: 'Association Éco-Habitat',
        surface: '300 m²',
        duration: '6 semaines',
        image: '/images/projects/etancheite-2.jpg',
        gallery: [
          '/images/projects/etancheite-2-gallery-1.jpg',
          '/images/projects/etancheite-2-gallery-2.jpg',
          '/images/projects/etancheite-2-gallery-3.jpg',
          '/images/projects/etancheite-2-gallery-4.jpg'
        ],
        testimonial: {
          content: "La toiture végétalisée réalisée par BATIHR+ est devenue l'élément phare de notre bâtiment écologique. Non seulement elle remplit parfaitement ses fonctions techniques d'étanchéité et d'isolation, mais elle constitue aussi un formidable outil pédagogique pour nos visiteurs. La qualité de réalisation et l'expertise technique de l'équipe ont été déterminantes dans la réussite de ce projet ambitieux.",
          author: "Dr. Martinez",
          position: "Président, Association Éco-Habitat"
        },
        featured: true
      },
      {
        title: 'Réfection toiture en zinc à joint debout',
        slug: 'refection-toiture-zinc-joint-debout',
        description: 'Rénovation complète d\'une toiture en zinc à joint debout sur un bâtiment Art Déco.',
        fullDescription: `
          <p>Ce projet de couverture concernait la réfection complète d'une toiture en zinc à joint debout sur un immeuble Art Déco des années 1930 situé à Biarritz. La toiture d'origine, également en zinc, présentait de nombreuses fuites et dégradations après plus de 50 ans de service.</p>
          
          <p>L'enjeu était de respecter l'esthétique originale du bâtiment tout en utilisant des techniques modernes pour garantir durabilité et performance.</p>
          
          <h3>Les travaux réalisés comprennent :</h3>
          <ul>
            <li>Dépose complète de l'ancienne couverture en zinc</li>
            <li>Vérification et renforcement de la charpente existante</li>
            <li>Installation d'un écran de sous-toiture HPV (Haute Perméabilité à la Vapeur d'eau)</li>
            <li>Mise en place d'un voligeage en bois massif traité</li>
            <li>Pose d'une couverture en zinc-titane à joint debout (technique traditionnelle)</li>
            <li>Façonnage et installation de tous les éléments d'ornement (épis, faîtages, arêtiers)</li>
            <li>Création de chatières pour la ventilation de la toiture</li>
            <li>Réfection complète des gouttières et descentes en zinc</li>
            <li>Restauration des lucarnes et fenêtres de toit</li>
          </ul>
          
          <p>Cette rénovation a été réalisée par nos couvreurs-zingueurs spécialisés dans les techniques traditionnelles, garantissant un travail d'une grande finesse esthétique et d'une parfaite étanchéité. La nouvelle toiture, avec une patine naturelle qui se développera avec le temps, préservera l'aspect historique du bâtiment tout en le protégeant pour les 80 prochaines années.</p>
        `,
        category: 'Couverture',
        location: 'Biarritz, France',
        year: 2022,
        client: 'Copropriété Villa Atlantic',
        surface: '350 m²',
        duration: '3 mois',
        image: '/images/projects/couverture-2.jpg',
        gallery: [
          '/images/projects/couverture-2-gallery-1.jpg',
          '/images/projects/couverture-2-gallery-2.jpg',
          '/images/projects/couverture-2-gallery-3.jpg',
          '/images/projects/couverture-2-gallery-4.jpg'
        ],
        testimonial: {
          content: "La réfection de notre toiture en zinc par BATIHR+ est un véritable chef-d'œuvre artisanal. Leur maîtrise de la technique du joint debout est impressionnante et le résultat est à la hauteur de l'architecture Art Déco de notre immeuble. Malgré les difficultés liées à la complexité de la toiture, ils ont respecté les délais et le budget. Un travail d'exception.",
          author: "M. Deschamps",
          position: "Président du conseil syndical"
        },
        featured: false
      }
    ];
    
    // Insérer les projets dans la base de données
    await Project.bulkCreate(projectsData);
    
    console.log('Projets des nouvelles catégories insérés avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des projets :', error);
  } finally {
    // Fermer la connexion
    await sequelize.close();
    process.exit(0);
  }
};

// Exécuter la fonction
seedCategoryProjects();
