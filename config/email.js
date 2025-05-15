const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'batihr.plus@gmail.com',
      pass: process.env.SMTP_PASSWORD || 'ydel pdic slbv sghr',
    },
    from: process.env.EMAIL_FROM || 'batihr.plus@gmail.com',
    fromName: process.env.EMAIL_FROM_NAME || 'BATIHR +',
  }
};
