import * as Yup from 'yup';

import Mail from '../../lib/mail';
import Pet from '../models/Pet';
import User from '../models/User';

import decodeToken from '../utils/decodeToken';

class PetController {
  async index(req, res) {
    let pets = {};

    const userId = await decodeToken(req, res);

    if (userId) {
      const userCity = await User.findByPk(userId, {
        attributes: ['city'],
      });

      pets = await Pet.findAll({
        where: { city: userCity.city },
        attributes: ['id', 'name', 'breed', 'age', 'weight', 'type', 'city'],
        order: [['id', 'DESC']],
      });
    } else {
      pets = await Pet.findAll({
        attributes: ['id', 'name', 'breed', 'age', 'weight', 'type', 'city'],
        order: [['id', 'DESC']],
      });
    }

    return res.json(pets);
  }

  async indexUser(req, res) {
    let pets = {};

    const userId = await decodeToken(req);

    console.log(userId);

    if (userId) {
      pets = await Pet.findAll({
        where: { owner_user_id: userId },
        attributes: ['id', 'name', 'breed', 'age', 'weight', 'type', 'city'],
        order: [['id', 'DESC']],
      });
    } else {
      pets = {};
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

    console.log(req.userId);

    const data = { ...req.body, owner_user_id: req.userId };

    const { id, name, breed, age, weight, type, city } = await Pet.create(data);
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

  async edit(req, res) {
    const { id } = req.params;

    const pet = await Pet.findByPk(id, {
      attributes: ['id', 'name', 'breed', 'age', 'weight', 'type', 'city'],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['name'],
        },
      ],
    });

    return res.json(pet);
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

  async contactOwner(req, res) {
    // Busca dados do usuario logado
    const user = await User.findByPk(req.userId);

    // Busca dados do Pet
    const pet = await Pet.findByPk(req.params.id, {
      attributes: ['id', 'name'],
      include: [
        {
          model: User,
          as: 'owner',
        },
      ],
    });

    const { message } = req.body;
    await Mail.sendMail({
      to: `${pet.owner.name} <${pet.owner.email}>`,
      subject: 'Novo Contato',
      text: `Você foi contato por ${user.name} referente ao pet #${pet.id} - ${pet.name}
            Mensagem:
            ${message}`,
    });

    return res.status(200).json({ error: 'Lucas' });
  }
}

export default new PetController();
