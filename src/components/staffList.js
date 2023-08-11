import { faker } from "@faker-js/faker";
const staffList = [
  {
    key: faker.string.uuid(),
    avatar: faker.image.avatar(),
    name: faker.person.firstName(),
    position: faker.person.jobTitle(),
    rating: faker.number.float({ min: 4, max: 5, precision: 0.1 }),
  },

  {
    key: faker.string.uuid(),
    avatar: faker.image.avatar(),
    name: faker.person.firstName(),
    position: faker.person.jobTitle(),
    rating: faker.number.float({ min: 4, max: 5, precision: 0.1 }),
  },

  {
    key: faker.string.uuid(),
    avatar: faker.image.avatar(),
    name: faker.person.firstName(),
    position: faker.person.jobTitle(),
    rating: faker.number.float({ min: 4, max: 5, precision: 0.1 }),
  },
  
  {
    key: faker.string.uuid(),
    avatar: faker.image.avatar(),
    name: faker.person.firstName(),
    position: faker.person.jobTitle(),
    rating: faker.number.float({ min: 4, max: 5, precision: 0.1 }),
  },

  {
    key: faker.string.uuid(),
    avatar: faker.image.avatar(),
    name: faker.person.firstName(),
    position: faker.person.jobTitle(),
    rating: faker.number.float({ min: 4, max: 5, precision: 0.1 }),
  },

  {
    key: faker.string.uuid(),
    avatar: faker.image.avatar(),
    name: faker.person.firstName(),
    position: faker.person.jobTitle(),
    rating: faker.number.float({ min: 4, max: 5, precision: 0.1 }),
  },
];

export default staffList;