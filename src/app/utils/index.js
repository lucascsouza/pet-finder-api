import Mail from '../../lib/mail';

import User from '../models/User';
import Pet from '../models/Pet';

export default async function concatOwner(req, res) {
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

  await Mail.sendMail({
    to: `${pet.owner.name} <${pet.owner.email}>`,
    subject: 'Novo Contato',
    text: `Você foi contato por ${user.name} referente ao pet #${pet.id} - ${pet.name}`,
  });

  return res.status(200).json({ error: 'Lucas' });
}

// export default function truncate() {
//   return Promise.all(
//     Object.keys(database.connection.models).map(key => {
//       return database.connection.models[key].destroy({
//         truncate: true,
//         force: true,
//       });
//     })
//   );
// }
