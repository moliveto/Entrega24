import { faker } from "@faker-js/faker";

faker.locale = "en";

export const generateProduct = () => {
  return {
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    price: faker.commerce.price(),
    quantity: faker.random.numeric(1),
    thumbnail: faker.image.image(),
  };
};
