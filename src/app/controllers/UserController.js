import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      attributes: [
        'id',
        'name',
        'email',
        'street',
        'street_number',
        'city',
        'state',
      ],
    });

    return res.json(users);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      street: Yup.string().required(),
      street_number: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      password: Yup.string().required().min(8),
    });

    const { email } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const checkUniqueEmail = await User.findOne({ where: { email } });

    if (checkUniqueEmail) {
      return res.status(400).json({ error: 'Email must unique.' });
    }

    const { id, name, street, street_number, city, state } = await User.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      street,
      street_number,
      city,
      state,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      street: Yup.string().required(),
      street_number: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { email } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    if (email && email !== user.email) {
      const checkUniqueEmail = await User.findOne({ where: { email } });

      if (checkUniqueEmail) {
        return res.status(400).json({ error: 'Email must unique.' });
      }
    }

    const { id, name, street, street_number, city, state } = await user.update(
      req.body
    );

    return res.json({
      id,
      name,
      street,
      street_number,
      city,
      state,
    });
  }

  async destroy(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    user.destroy();

    return res.status(200);
  }
}

export default new UserController();
