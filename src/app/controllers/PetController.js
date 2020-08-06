import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

import Pet from '../models/Pet';
import User from '../models/User';

class PetController {
  async index(req, res) {
    let pets = {};

    const authHeader = req.headers.authorization;

    if (authHeader) {
      const [, token] = req.headers.authorization.split(' ');
      const decoded = await promisify(jwt.verify)(token, authConfig.secret);

      const userCity = await User.findByPk(decoded.id, {
        attributes: ['city'],
      });

      pets = await Pet.findAll({
        where: { city: userCity.city },
        attributes: ['id', 'name', 'breed', 'age', 'weight', 'type', 'city'],
      });
    } else {
      pets = await Pet.findAll({
        attributes: ['id', 'name', 'breed', 'age', 'weight', 'type', 'city'],
      });
    }

    return res.json(pets);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      breed: Yup.string().required(),
      age: Yup.number().integer().positive().required(),
      weight: Yup.number().positive().required(),
      type: Yup.mixed().oneOf(['Cachorro', 'Gato']),
      city: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { id, name, breed, age, weight, type, city } = await Pet.create(
      req.body
    );
    return res.json({
      id,
      name,
      breed,
      age,
      weight,
      type,
      city,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      breed: Yup.string().required(),
      age: Yup.number().integer().positive().required(),
      weight: Yup.number().positive().required(),
      type: Yup.mixed().oneOf(['Cachorro', 'Gato']),
      city: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(400).json({ error: 'Pet not found.' });
    }

    const { id, name, breed, age, weight, type, city } = await pet.update(
      req.body
    );

    return res.json({
      id,
      name,
      breed,
      age,
      weight,
      type,
      city,
    });
  }

  async destroy(req, res) {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) {
      return res.status(400).json({ error: 'Pet not found.' });
    }
    pet.destroy();
    return res.status(200);
  }
}

export default new PetController();
