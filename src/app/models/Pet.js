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
        created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      },
      {
        sequelize,
        paranoid: true,
        timestamps: true,
      }
    );
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
