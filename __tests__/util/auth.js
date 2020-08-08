import factory from '../factories';

export default function auth() {
  return Promise.all(
    let token;
    const user = await factory.attrs('User');

    await request(app)
      .post('/register')
      .send(user);

    const response = await request(app)
      .post('/login')
      .send({ email: user.email, password: user.password });
  );
}
