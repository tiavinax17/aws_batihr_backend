const nodemailer = require('nodemailer');
const emailConfig = require('../config/email').email;
const cabinetEmails = require('../config/cabinetEmails');

const path = require('path');

// Créer un transporteur de mail
const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass
  }
});


// Fonction pour obtenir l'email du cabinet approprié
const getCabinetEmail = (cabinet) => {
  if (cabinet && cabinetEmails[cabinet]) {
    return cabinetEmails[cabinet];
  }
  return cabinetEmails.default;
};

// Envoyer un email de confirmation au client après soumission d'un devis
exports.sendDevisConfirmation = async ({ to, devisId, nom, prenom, cabinet }) => {
  try {

    let cabinetText = 'Non spécifié';
    if (cabinet === 'plomberie') cabinetText = 'Plomberie';
    if (cabinet === 'fumisterie') cabinetText = 'Fumisterie';
    if (cabinet === 'couverture') cabinetText = 'Couverture et Étanchéité';
    if (cabinet === 'administratif') cabinetText = 'Administratif';

    await transporter.sendMail({
      from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
      to,
      subject: `Confirmation de votre demande de devis #${devisId}`,
      html: `
        <h1>Merci pour votre demande de devis</h1>
        <p>Bonjour ${prenom} ${nom},</p>
        <p>Nous avons bien reçu votre demande de devis (référence: <strong>${devisId}</strong>) pour le cabinet de ${cabinetText}.</p>
        <p>Notre équipe va étudier votre projet et vous contactera dans les plus brefs délais.</p>
        <p>Cordialement,</p>
        <p>L'équipe ${emailConfig.fromName}</p>
      `
    });
    console.log(`Email de confirmation envoyé à ${to}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
    return false;
  }
};

// Envoyer une notification à l'administrateur pour une nouvelle demande de devis
// exports.sendDevisNotification = async ({ devisId, nom, prenom, email, telephone, typeProjet ,cabinet}) => {
//   const toEmail = getCabinetEmail(cabinet);
//   let cabinetText = 'Non spécifié';
//   if (cabinet === 'plomberie') cabinetText = 'Plomberie';
//   if (cabinet === 'fumisterie') cabinetText = 'Fumisterie';
//   if (cabinet === 'couverture') cabinetText = 'Couverture et Étanchéité';
//   if (cabinet === 'administratif') cabinetText = 'Administratif';
//   try {
//     await transporter.sendMail({
//       from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
//       to: toEmail, // Envoyer à l'adresse admin
//       subject: `Nouvelle demande de devis #${devisId}`,
//       html: `
//         <h1>Nouvelle demande de devis</h1>
//         <p>Une nouvelle demande de devis a été soumise:</p>
//         <ul>
//           <li><strong>Référence:</strong> ${devisId}</li>
//           <li><strong>Client:</strong> ${prenom} ${nom}</li>
//           <li><strong>Email:</strong> ${email}</li>
//           <li><strong>Téléphone:</strong> ${telephone}</li>
//           <li><strong>Cabinet concerné:</strong> ${cabinetText}</li>
//           <li><strong>Type de projet:</strong> ${typeProjet}</li>
//         </ul>
//         <p>Connectez-vous à l'interface d'administration pour plus de détails.</p>
//       `
//     });
//     console.log(`Email de notification envoyé à l'administrateur`);
//     return true;
//   } catch (error) {
//     console.error('Erreur lors de l\'envoi de l\'email de notification:', error);
//     return false;
//   }
// };

// Envoyer un email de confirmation au client après demande de rendez-vous
exports.sendAppointmentConfirmation = async ({ to, appointmentId, nom, prenom, date, time, reason, preferredMethod, cabinet }) => {
  try {
    // Formater la date pour l'affichage
    const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });


    // Traduire le mode de rendez-vous
    let methodText = 'en personne';
    if (preferredMethod === 'video') methodText = 'par visioconférence';
    if (preferredMethod === 'phone') methodText = 'par téléphone';

    // Traduire le motif
    let reasonText = 'Non spécifié';
    if (reason === 'information') reasonText = 'Demande d\'information';
    if (reason === 'consultation') reasonText = 'Consultation';
    if (reason === 'devis') reasonText = 'Demande de devis';
    if (reason === 'other') reasonText = 'Autre';

    let cabinetText = 'Non spécifié';
    if (cabinet === 'plomberie') cabinetText = 'Plomberie';
    if (cabinet === 'fumisterie') cabinetText = 'Fumisterie';
    if (cabinet === 'couverture') cabinetText = 'Couverture et Étanchéité';
    if (cabinet === 'administratif') cabinetText = 'Administratif';

    await transporter.sendMail({
      from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
      to,
      subject: `Confirmation de votre rendez-vous #${appointmentId}`,
      html: `
        <h1>Confirmation de rendez-vous</h1>
        <p>Bonjour ${prenom} ${nom},</p>
        <p>Nous avons bien reçu votre demande de rendez-vous (référence: <strong>${appointmentId}</strong>).</p>
        <p>Détails du rendez-vous:</p>
        <ul>
          <li><strong>Date:</strong> ${formattedDate}</li>
          <li><strong>Cabinet:</strong> ${cabinetText}</li>
          <li><strong>Heure:</strong> ${time}</li>
          <li><strong>Motif:</strong> ${reasonText}</li>
          <li><strong>Mode:</strong> ${methodText}</li>
        </ul>
        <p>Notre équipe confirmera ce rendez-vous dans les plus brefs délais.</p>
        <p>Cordialement,</p>
        <p>L'équipe ${emailConfig.fromName}</p>
      `
    });
    console.log(`Email de confirmation de rendez-vous envoyé à ${to}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation de rendez-vous:', error);
    return false;
  }
};

// Envoyer une notification à l'administrateur pour une nouvelle demande de rendez-vous
exports.sendAppointmentNotification = async ({ appointmentId, nom, prenom, email, telephone, date, time, motif, methode, notes, cabinet }) => {
  try {
    // Formater la date pour l'affichage
    const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Traduire le mode de rendez-vous
    let methodText = 'en personne';
    if (methode === 'video') methodText = 'par visioconférence';
    if (methode === 'phone') methodText = 'par téléphone';

    // Traduire le motif
    let reasonText = 'Non spécifié';
    if (motif === 'information') reasonText = 'Demande d\'information';
    if (motif === 'consultation') reasonText = 'Consultation';
    if (motif === 'devis') reasonText = 'Demande de devis';
    if (motif === 'other') reasonText = 'Autre';

    const toEmail = getCabinetEmail(cabinet);

    let cabinetText = 'Non spécifié';
    if (cabinet === 'plomberie') cabinetText = 'Plomberie';
    if (cabinet === 'fumisterie') cabinetText = 'Fumisterie';
    if (cabinet === 'couverture') cabinetText = 'Couverture et Étanchéité';
    if (cabinet === 'administratif') cabinetText = 'Administratif';

    await transporter.sendMail({
      from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
      to: toEmail, // Envoyer à l'adresse admin
      subject: `Nouvelle demande de rendez-vous #${appointmentId}`,
      html: `
        <h1>Nouvelle demande de rendez-vous</h1>
        <p>Une nouvelle demande de rendez-vous a été soumise:</p>
        <ul>
          <li><strong>Référence:</strong> ${appointmentId}</li>
          <li><strong>Client:</strong> ${prenom} ${nom}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Téléphone:</strong> ${telephone}</li>
          <li><strong>Cabinet concerné:</strong> ${cabinetText}</li>
          <li><strong>Date:</strong> ${formattedDate}</li>
          <li><strong>Heure:</strong> ${time}</li>
          <li><strong>Motif:</strong> ${reasonText}</li>
          <li><strong>Mode:</strong> ${methodText}</li>
        </ul>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        <p>Connectez-vous à l'interface d'administration pour confirmer ce rendez-vous.</p>
      `
    });
    console.log(`Email de notification de rendez-vous envoyé à l'administrateur`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de notification de rendez-vous:', error);
    return false;
  }
};
/**
 * Envoie un email de confirmation pour un message de contact
 */
exports.sendContactConfirmation = async (data) => {
  try {
    const { to, prenom, nom, messageId, subject, cabinet } = data;
    
    // Traduire le nom du cabinet pour l'affichage
    let cabinetText = 'Non spécifié';
    if (cabinet === 'plomberie') cabinetText = 'Plomberie';
    if (cabinet === 'fumisterie') cabinetText = 'Fumisterie';
    if (cabinet === 'couverture') cabinetText = 'Couverture et Étanchéité';
    if (cabinet === 'administratif') cabinetText = 'Administratif';
    
    const mailOptions = {
      from:`"${emailConfig.fromName}" <${emailConfig.from}>`,
      to,
      subject: 'Confirmation de votre message - BATIHR +',
      html: `
        <h2>Merci de nous avoir contactés!</h2>
        <p>Cher(e) ${prenom} ${nom},</p>
        <p>Nous avons bien reçu votre message (Référence: ${messageId}) concernant "${subject}" pour notre cabinet de <strong>${cabinetText}</strong>.</p>
        <p>Notre équipe va l'examiner et vous répondra dans les plus brefs délais.</p>
        <p>Cordialement,</p>
        <p>L'équipe BATIHR +</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return info.messageId ? true : false;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation de contact:', error);
    return false;
  }
};
/**
 * Envoie une notification à l'administrateur pour un nouveau message de contact
 */
exports.sendContactNotification = async (data) => {
  try {
    const { messageId, prenom, nom, email, telephone, sujet, message, cabinet } = data;
    
    // Déterminer l'adresse email de destination en fonction du cabinet
    const toEmail = getCabinetEmail(cabinet);
    
    // Traduire le nom du cabinet pour l'affichage
    let cabinetText = 'Non spécifié';
    if (cabinet === 'plomberie') cabinetText = 'Plomberie';
    if (cabinet === 'fumisterie') cabinetText = 'Fumisterie';
    if (cabinet === 'couverture') cabinetText = 'Couverture et Étanchéité';
    if (cabinet === 'administratif') cabinetText = 'Administratif';
    
    const mailOptions = {
      from:`"${emailConfig.fromName}" <${emailConfig.from}>`,
      to: toEmail,
      subject: `Nouveau message de contact: ${messageId} - Cabinet ${cabinetText}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Référence:</strong> ${messageId}</p>
        <p><strong>Cabinet concerné:</strong> ${cabinetText}</p>
        <p><strong>Nom:</strong> ${prenom} ${nom}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${telephone}</p>
        <p><strong>Sujet:</strong> ${sujet}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return info.messageId ? true : false;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification de contact:', error);
    return false;
  }
};
// Ajouter ces fonctions à votre fichier emailService.js existant

// Envoyer un email de confirmation au client après soumission d'un devis
exports.sendDevisConfirmation = async ({ to, devisId, nom, prenom, projectType }) => {
  try {
    // Traduire le type de projet
    let projectTypeText = 'Non spécifié';
    if (projectType === 'plomberie') projectTypeText = 'Plomberie';
    if (projectType === 'couverture') projectTypeText = 'Couverture';
    if (projectType === 'etancheite') projectTypeText = 'Extension';
    if (projectType === 'fumisterie') projectTypeText = 'Fumisterie';
    if (projectType === 'access-difficiles') projectTypeText = 'Travaux d’accès difficiles';
    if (projectType === 'other') projectTypeText = 'Autre';

    await transporter.sendMail({
      from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
      to,
      subject: `Confirmation de votre demande de devis #${devisId}`,
      html: `
        <h1>Merci pour votre demande de devis</h1>
        <p>Bonjour ${prenom} ${nom},</p>
        <p>Nous avons bien reçu votre demande de devis (référence: <strong>${devisId}</strong>) pour votre projet de <strong>${projectTypeText}</strong>.</p>
        <p>Notre équipe va étudier votre projet et vous contactera dans les 48 heures pour discuter des détails et vous proposer un devis personnalisé.</p>
        <p>Cordialement,</p>
        <p>L'équipe ${emailConfig.fromName}</p>
      `
    });
    console.log(`Email de confirmation de devis envoyé à ${to}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation de devis:', error);
    return false;
  }
};

// Envoyer une notification à l'administrateur pour une nouvelle demande de devis
exports.sendDevisNotification = async ({ devisId, nom, prenom, email, telephone, projectType, budget, timeline, description, address, files ,cabinet}) => {
  try {
    const toEmail = getCabinetEmail(cabinet);
    let cabinetText = 'Non spécifié';
    if (cabinet === 'plomberie') cabinetText = 'Plomberie';
    if (cabinet === 'fumisterie') cabinetText = 'Fumisterie';
    if (cabinet === 'couverture') cabinetText = 'Couverture et Étanchéité';
    if (cabinet === 'administratif') cabinetText = 'Administratif';
    // Traduire le type de projet
    let projectTypeText = 'Non spécifié';
    if (projectType === 'plomberie') projectTypeText = 'Plomberie';
    if (projectType === 'couverture') projectTypeText = 'Couverture';
    if (projectType === 'etancheite') projectTypeText = 'Extension';
    if (projectType === 'fumisterie') projectTypeText = 'Fumisterie';
    if (projectType === 'access-difficiles') projectTypeText = 'Travaux d’accès difficiles';
    if (projectType === 'other') projectTypeText = 'Autre';

    // Traduire le budget
    let budgetText = 'Non spécifié';
    if (budget === 'less-than-10k') budgetText = 'Moins de 10 000 €';
    if (budget === '10k-50k') budgetText = '10 000 € - 50 000 €';
    if (budget === '50k-100k') budgetText = '50 000 € - 100 000 €';
    if (budget === '100k-200k') budgetText = '100 000 € - 200 000 €';
    if (budget === 'more-than-200k') budgetText = 'Plus de 200 000 €';

    // Traduire le délai
    let timelineText = 'Non spécifié';
    if (timeline === 'urgent') timelineText = 'Urgent (moins d\'1 mois)';
    if (timeline === '1-3-months') timelineText = '1 à 3 mois';
    if (timeline === '3-6-months') timelineText = '3 à 6 mois';
    if (timeline === '6-12-months') timelineText = '6 à 12 mois';
    if (timeline === 'more-than-12-months') timelineText = 'Plus de 12 mois';

    const attachments = files.map(file => ({
      filename: file.originalname,
      path: file.path
    }));

    await transporter.sendMail({
      from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
      to: toEmail, // Envoyer à l'adresse admin
      subject: `Nouvelle demande de devis #${devisId}`,
      html: `
        <h1>Nouvelle demande de devis</h1>
        <p>Une nouvelle demande de devis a été soumise:</p>
        <ul>
          <li><strong>Référence:</strong> ${devisId}</li>
          <li><strong>Client:</strong> ${prenom} ${nom}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Téléphone:</strong> ${telephone}</li>
          <li><strong>Adresse du projet:</strong> ${address}</li>
          <li><strong>Type de projet:</strong> ${projectTypeText}</li>
          <li><strong>Budget estimé:</strong> ${budgetText}</li>
          <li><strong>Délai souhaité:</strong> ${timelineText}</li>
        </ul>
        <p><strong>Description du projet:</strong></p>
        <p>${description.replace(/\n/g, '<br>')}</p>
         ${files && files.length > 0 ? `
        <p><strong>Fichiers joints:</strong> ${files.length} fichier(s)</p>
        ` : '<p>Aucun fichier joint</p>'}
        <p>Connectez-vous à l'interface d'administration pour plus de détails.</p>
      `,
      attachments: attachments 
    });
    console.log(`Email de notification de devis envoyé à l'administrateur`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de notification de devis:', error);
    return false;
  }
};

// Ajouter ces fonctions à votre fichier emailService.js existant

// Envoyer un email de confirmation au candidat après soumission d'une candidature
exports.sendApplicationConfirmation = async ({ to, applicationId, firstName, lastName, jobTitle }) => {
  try {
    await transporter.sendMail({
      from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
      to,
      subject: `Confirmation de votre candidature #${applicationId}`,
      html: `
        <h1>Merci pour votre candidature</h1>
        <p>Bonjour ${firstName} ${lastName},</p>
        <p>Nous avons bien reçu votre candidature (référence: <strong>${applicationId}</strong>) pour le poste de <strong>${jobTitle}</strong>.</p>
        <p>Notre équipe RH va étudier votre profil et vous recontactera si votre candidature est retenue pour la suite du processus de recrutement.</p>
        <p>Cordialement,</p>
        <p>L'équipe ${emailConfig.fromName}</p>
      `
    });
    console.log(`Email de confirmation de candidature envoyé à ${to}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation de candidature:', error);
    return false;
  }
};

// Envoyer une notification à l'administrateur pour une nouvelle candidature
exports.sendApplicationNotification = async ({ applicationId, firstName, lastName, email, phone, message, jobTitle, jobId, files }) => {
  try {
    // Préparer les pièces jointes
    const attachments = [];
    const toEmail = getCabinetEmail("administratif");
    
    // Ajouter le CV
    if (files.resume) {
      attachments.push({
        filename: `CV_${firstName}_${lastName}${path.extname(files.resume.originalname)}`,
        path: files.resume.path
      });
    }
    
    // Ajouter la lettre de motivation si présente
    if (files.coverLetter) {
      attachments.push({
        filename: `LM_${firstName}_${lastName}${path.extname(files.coverLetter.originalname)}`,
        path: files.coverLetter.path
      });
    }

    await transporter.sendMail({
      from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
      to: toEmail, // Envoyer à l'adresse admin
      subject: `Nouvelle candidature #${applicationId} pour ${jobTitle}`,
      html: `
        <h1>Nouvelle candidature</h1>
        <p>Une nouvelle candidature a été soumise:</p>
        <ul>
          <li><strong>Référence:</strong> ${applicationId}</li>
          <li><strong>Poste:</strong> ${jobTitle} (ID: ${jobId})</li>
          <li><strong>Candidat:</strong> ${firstName} ${lastName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Téléphone:</strong> ${phone}</li>
        </ul>
        ${message ? `
        <p><strong>Message / Lettre de motivation:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        ` : ''}
        <p><strong>Pièces jointes:</strong></p>
        <ul>
          <li>CV</li>
          ${files.coverLetter ? '<li>Lettre de motivation</li>' : ''}
        </ul>
        <p>Connectez-vous à l'interface d'administration pour gérer cette candidature.</p>
      `,
      attachments: attachments
    });
    console.log(`Email de notification de candidature envoyé à l'administrateur avec ${attachments.length} pièce(s) jointe(s)`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de notification de candidature:', error);
    return false;
  }
};



module.exports = exports;
