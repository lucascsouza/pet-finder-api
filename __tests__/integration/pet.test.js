import request from 'supertest';
import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

import User from '../../src/app/models/User';

describe('Pet', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Get all the pets', async () => {
    const response = await request(app).get('/pets');
    expect(response.status).toBe(200);
  });

  it('should create a pet', async () => {
    const user = await User.create({
      name: 'Lucas Souza',
      email: 'lucas@gmail.com',
      street: 'Rua Eduardo Luis Trindade',
      street_number: '541',
      city: 'São Paulo',
      state: 'SP',
      password: '@Desenv123',
    });
    const response = await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        name: 'Escopeta',
        breed: 'Não Definido',
        age: 9,
        weight: 5,
        type: 'Gato',
        city: 'São Paulo',
        owner_user_id: user.id,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});
