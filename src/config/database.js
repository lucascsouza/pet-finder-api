require('../bootstrap');

module.exports = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  storage: './__tests__/database.sqlite',
  define: {
    timestamps: false,
    underscored: true,
    underscoredAll: true,
  },
};
