require('dotenv').config();

export default {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMPT_SECURE || false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  default: {
    from: 'Pet Finder <noreply@petfinder.com',
  },
};
