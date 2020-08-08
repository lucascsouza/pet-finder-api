import faker from 'faker';
import { factory } from 'factory-girl';
import User from '../src/app/models/User';
import Pet from '../src/app/models/Pet';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  street: faker.address.streetName(),
  street_number: faker.random.number(1000),
  city: faker.address.city(),
  state: faker.address.stateAbbr(),
  password: faker.internet.password(),
});

export default factory;
