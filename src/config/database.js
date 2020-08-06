module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'petfinder',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
