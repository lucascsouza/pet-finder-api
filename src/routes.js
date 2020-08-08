import { Router } from 'express';

import AuthMiddleware from './app/middlewares/auth';
import AuthController from './app/controllers/AuthController';
import UserController from './app/controllers/UserController';
import PetController from './app/controllers/PetController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
});

// Rotas de Autenticação
routes.post('/auth', AuthController.store);
routes.post('/users', UserController.store);

routes.get('/pets', PetController.index);

// Middleware de Autenticacação
routes.use(AuthMiddleware);

// Rotas de usuário
routes.get('/users', UserController.index);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.destroy);

// Rotas de pets
routes.get('/pets/:id', PetController.edit);
routes.get('/user/pets', PetController.indexUser);
routes.post('/pets', PetController.store);
routes.put('/pets/:id', PetController.update);
routes.delete('/pets/:id', PetController.destroy);
routes.post('/pets/contact/:id', PetController.contactOwner);

export default routes;
