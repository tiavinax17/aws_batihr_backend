// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config({ path: __dirname + '/../.env' });

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
    logging: false
  }
);

// Définir les modèles
const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 999,
  }
}, {
  timestamps: true
});

const ServiceDetail = sequelize.define('ServiceDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Service,
      key: 'id'
    }
  },
  fullDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  features: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('features');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('features', JSON.stringify(value));
    }
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
  }
}, {
  timestamps: true
});

// Définir la relation
ServiceDetail.belongsTo(Service, { foreignKey: 'serviceId' });
Service.hasOne(ServiceDetail, { foreignKey: 'serviceId' });

const seedServiceDetails = async () => {
  try {
    // Tester la connexion
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');

    // Synchroniser le modèle avec la base de données
    await sequelize.sync({ alter: true });
    console.log('Table ServiceDetails synchronisée avec succès');

    // Récupérer tous les services
    const services = await Service.findAll();
    
    // Données des détails de service
    const serviceDetailsData = [
      {
        slug: 'plomberie',
        fullDescription: `
          <p>La plomberie est un élément essentiel de toute habitation ou local commercial. Chez BATIHR+, nous proposons une gamme complète de services de plomberie, de l'installation à la réparation, en passant par la maintenance.</p>
          
          <p>Notre équipe de plombiers qualifiés et expérimentés intervient rapidement et efficacement pour résoudre tous vos problèmes de plomberie et réaliser vos projets d'installation ou de rénovation.</p>
          
          <h3>Nos services de plomberie comprennent :</h3>
          <ul>
            <li>Installation et remplacement de canalisations</li>
            <li>Installation et réparation de robinetterie</li>
            <li>Installation et remplacement de chauffe-eau</li>
            <li>Installation et rénovation de salles de bains</li>
            <li>Installation et rénovation de cuisines</li>
            <li>Détection et réparation de fuites</li>
            <li>Débouchage de canalisations</li>
          </ul>
          
          <p>Nous utilisons des matériaux et des équipements de qualité, conformes aux normes en vigueur, pour vous garantir des installations durables et fiables.</p>
        `,
        features: [
          'Intervention rapide',
          'Devis détaillé et transparent',
          'Équipements et matériaux de qualité',
          'Garantie sur tous nos travaux',
          'Service d\'urgence disponible'
        ],
        gallery: [
          '/images/services/plomberie-1.jpg',
          '/images/services/plomberie-2.jpg',
          '/images/services/plomberie-3.jpg'
        ]
      },
      {
        slug: 'couverture',
        fullDescription: `
          <p>BATIHR+ vous propose des services professionnels de couverture pour protéger votre maison ou bâtiment contre les intempéries. Une toiture bien entretenue est essentielle pour la durabilité et la valeur de votre propriété.</p>
          
          <p>Notre équipe de couvreurs expérimentés maîtrise toutes les techniques et matériaux de couverture pour vous offrir des solutions adaptées à vos besoins et à votre budget.</p>
          
          <h3>Nos services de couverture comprennent :</h3>
          <ul>
            <li>Installation de toitures neuves (tuiles, ardoises, zinc, etc.)</li>
            <li>Réparation et rénovation de toitures</li>
            <li>Remplacement de tuiles ou d'ardoises cassées</li>
            <li>Traitement anti-mousse et hydrofuge</li>
            <li>Installation et réparation de gouttières</li>
            <li>Pose de fenêtres de toit et de velux</li>
            <li>Démoussage et nettoyage de toiture</li>
          </ul>
          
          <p>Nous intervenons sur tous types de toitures et garantissons un travail soigné et durable, réalisé dans le respect des normes de sécurité et des règles de l'art.</p>
        `,
        features: [
          'Expertise en tous types de toitures',
          'Matériaux de qualité supérieure',
          'Respect des normes de sécurité',
          'Garantie décennale',
          'Devis gratuit et détaillé'
        ],
        gallery: [
          '/images/services/couverture-1.jpg',
          '/images/services/couverture-2.jpg',
          '/images/services/couverture-3.jpg'
        ]
      },
      {
        slug: 'etancheite',
        fullDescription: `
          <p>L'étanchéité est cruciale pour protéger votre bâtiment contre les infiltrations d'eau et l'humidité. Chez BATIHR+, nous proposons des solutions d'étanchéité efficaces et durables pour tous types de surfaces.</p>
          
          <p>Notre équipe spécialisée utilise des techniques modernes et des matériaux de haute qualité pour assurer une étanchéité parfaite de votre toiture terrasse, de vos fondations ou de vos murs.</p>
          
          <h3>Nos services d'étanchéité comprennent :</h3>
          <ul>
            <li>Étanchéité de toitures terrasses</li>
            <li>Étanchéité de fondations et sous-sols</li>
            <li>Traitement des remontées capillaires</li>
            <li>Imperméabilisation de façades</li>
            <li>Étanchéité de balcons et terrasses</li>
            <li>Pose de membranes d'étanchéité</li>
            <li>Diagnostic et réparation de fuites</li>
          </ul>
          
          <p>Nous réalisons un diagnostic précis de vos problèmes d'étanchéité et vous proposons les solutions les plus adaptées, avec un excellent rapport qualité-prix.</p>
        `,
        features: [
          'Solutions sur mesure',
          'Matériaux d\'étanchéité de qualité',
          'Techniques modernes et efficaces',
          'Garantie sur nos travaux',
          'Intervention rapide en cas de fuite'
        ],
        gallery: [
          '/images/services/etancheite-1.jpg',
          '/images/services/etancheite-2.jpg',
          '/images/services/etancheite-3.jpg'
        ]
      },
      {
        slug: 'fumisterie',
        fullDescription: `
          <p>La fumisterie concerne tous les systèmes d'évacuation des fumées et de chauffage. Chez BATIHR+, nous vous proposons des services complets de fumisterie pour assurer votre confort et votre sécurité.</p>
          
          <p>Notre équipe de fumistes qualifiés intervient pour l'installation, l'entretien et la réparation de tous types de conduits de fumée, cheminées, poêles et systèmes de chauffage.</p>
          
          <h3>Nos services de fumisterie comprennent :</h3>
          <ul>
            <li>Installation et rénovation de cheminées</li>
            <li>Pose de poêles à bois, à granulés ou à gaz</li>
            <li>Tubage et chemisage de conduits</li>
            <li>Ramonage et entretien de conduits</li>
            <li>Réparation de conduits endommagés</li>
            <li>Création de sorties de toit</li>
            <li>Diagnostic et mise aux normes</li>
          </ul>
          
                    <p>Nous veillons au respect des normes de sécurité en vigueur et vous conseillons sur les solutions les plus adaptées à votre logement et à vos besoins en chauffage.</p>
        `,
        features: [
          'Installation conforme aux normes',
          'Expertise en tous types de conduits',
          'Entretien régulier et préventif',
          'Conseils personnalisés',
          'Intervention rapide en cas de problème'
        ],
        gallery: [
          '/images/services/fumisterie-1.jpg',
          '/images/services/fumisterie-2.jpg',
          '/images/services/fumisterie-3.jpg'
        ]
      },
      {
        slug: 'acces-difficiles',
        fullDescription: `
          <p>BATIHR+ est spécialisé dans les travaux en hauteur et les zones d'accès difficiles. Notre équipe dispose des compétences et de l'équipement nécessaires pour intervenir en toute sécurité là où d'autres ne peuvent pas accéder.</p>
          
          <p>Que ce soit pour des travaux de réparation, d'entretien ou d'installation en hauteur, nous proposons des solutions adaptées sans recourir à des échafaudages coûteux.</p>
          
          <h3>Nos services de travaux d'accès difficiles comprennent :</h3>
          <ul>
            <li>Réparation de toitures en hauteur</li>
            <li>Nettoyage de façades et de vitres inaccessibles</li>
            <li>Installation et maintenance d'équipements en hauteur</li>
            <li>Travaux sur clochers, monuments et bâtiments historiques</li>
            <li>Élagage et entretien d'arbres en hauteur</li>
            <li>Inspection de structures difficiles d'accès</li>
            <li>Interventions d'urgence en zones inaccessibles</li>
          </ul>
          
          <p>Notre équipe est formée aux techniques de travail en hauteur et utilise des équipements spécialisés (cordes, nacelles, etc.) pour garantir une sécurité maximale lors de nos interventions.</p>
        `,
        features: [
          'Personnel hautement qualifié',
          'Équipement spécialisé et certifié',
          'Respect strict des normes de sécurité',
          'Solutions sans échafaudage',
          'Intervention rapide même en zones complexes'
        ],
        gallery: [
          '/images/services/acces-difficiles-1.jpg',
          '/images/services/acces-difficiles-2.jpg',
          '/images/services/acces-difficiles-3.jpg'
        ]
      }
    ];
    
    // Pour chaque service, créer ou mettre à jour ses détails
    for (const detailData of serviceDetailsData) {
      // Trouver le service correspondant par son slug
      const service = services.find(s => s.slug === detailData.slug);
      
      if (service) {
        // Vérifier si des détails existent déjà pour ce service
        let serviceDetail = await ServiceDetail.findOne({
          where: { serviceId: service.id }
        });
        
        if (serviceDetail) {
          // Mettre à jour les détails existants
          await serviceDetail.update({
            fullDescription: detailData.fullDescription,
            features: detailData.features,
            gallery: detailData.gallery
          });
          console.log(`Détails du service "${service.title}" mis à jour.`);
        } else {
          // Créer de nouveaux détails
          await ServiceDetail.create({
            serviceId: service.id,
            fullDescription: detailData.fullDescription,
            features: detailData.features,
            gallery: detailData.gallery
          });
          console.log(`Détails du service "${service.title}" créés.`);
        }
      } else {
        console.log(`Service avec le slug "${detailData.slug}" non trouvé.`);
      }
    }
    
    console.log('Détails des services insérés avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des détails des services :', error);
  } finally {
    // Fermer la connexion
    await sequelize.close();
    process.exit(0);
  }
};

// Exécuter la fonction
seedServiceDetails();
