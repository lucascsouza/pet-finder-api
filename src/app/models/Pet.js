import Sequelize, { Model } from 'sequelize';

class Pet extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        breed: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.DECIMAL(10, 2),
        type: Sequelize.ENUM('Gato', 'Cachorro'),
        city: Sequelize.STRING,
        owner_user_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        paranoid: true,
      }
    );

    this.addHook('beforeSave', async (pet) => {
      pet.owner_user_id = 4;
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'owner_user_id',
      as: 'owner',
    });
  }
}

export default Pet;
