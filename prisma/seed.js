const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const faker = require("faker");

const boolean = [true, false];

async function seed() {
  const petList = buildAnimalDatabase();
  const pets = await prisma.pet.createMany({
    data: petList,
  });

  console.log(pets);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

module.exports = {
  seed,
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function buildAnimalDatabase() {
  const animalBreedsGenerators = {
    dog: faker.animal.dog,
    cat: faker.animal.cat,
    snake: faker.animal.snake,
    horse: faker.animal.horse,
    bird: faker.animal.bird,
    rabbit: faker.animal.rabbit,
  };

  const animalTypes = Object.keys(animalBreedsGenerators);

  const animals = [];

  animalTypes.forEach((type) => {
    const breedGenerator = animalBreedsGenerators[type];
    const numberOfBreeds = getRandomInt(1, 5);

    for (let i = 0; i < numberOfBreeds; i++) {
      const breed = breedGenerator();

      const numberOfAnimals = getRandomInt(1, 5);

      for (let i = 0; i < numberOfAnimals; i++) {
        const booelanIndex = getRandomInt(0, boolean.length - 1);

        const newAnimal = {
          name: faker.name.firstName(),
          age: getRandomInt(1, 20),
          type,
          breed,
          microchip: boolean[booelanIndex],
        };

        animals.push(newAnimal);
      }
    }
  });

  return animals;
}
