import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        street: Sequelize.STRING,
        street_number: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      },
      {
        sequelize,
        paranoid: true,
        timeStamps: true,
      }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  generateToken() {
    return jwt.sign({ id: this.id }, process.env.APP_SECRET, {
      expiresIn: process.env.EXPIRES_IN,
    });
  }
}

export default User;
