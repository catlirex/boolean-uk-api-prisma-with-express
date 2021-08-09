const prisma = require("../../utils/database");
const { errorHandling } = require("../book/controller");

async function getAllPets(req, res) {
  const { microchip } = req.query;
  let result = null;
  try {
    if (!microchip) result = await selectAllPet();
    if (microchip)
      result = await selectAllPet({ microchip: booleanParse(microchip) });
    if (result.length) res.json(result);
    if (!result.length) res.json({ Msg: "No data found" });
  } catch (e) {
    errorHandling(e, res);
  }
}

async function selectAllPet(filterValue) {
  try {
    const result = await prisma.pet.findMany({
      where: filterValue,
    });
    return result;
  } catch (e) {
    throw e;
  }
}

function booleanParse(string) {
  return string === "true";
}

async function getPetTypes(req, res) {
  try {
    const result = await prisma.pet.groupBy({
      by: ["type"],
      select: {
        type: true,
      },
    });
    res.json({ result });
  } catch (e) {
    errorHandling(e, res);
  }
}

async function getPetByType(req, res) {
  const type = req.params.type;
  const { breed, microchip } = req.query;
  let result = null;

  if (!breed && !microchip) result = await selectPetByType({ type });
  if (breed && !microchip) result = await selectPetByType({ type, breed });
  if (!breed && microchip)
    result = await selectPetByType({
      type,
      microchip: booleanParse(microchip),
    });
  if (breed && microchip)
    result = await selectPetByType({
      type,
      breed,
      microchip: booleanParse(microchip),
    });

  res.json(result);
}

async function selectPetByType(filterValue) {
  try {
    const result = await prisma.pet.findMany({
      where: filterValue,
    });
    return result;
  } catch (e) {
    throw e;
  }
}

async function getOnePet(req, res) {
  const petId = Number(req.params.id);
  try {
    const result = await selectOnePet(petId);
    res.json(result);
  } catch (e) {
    errorHandling(e);
  }
}

async function selectOnePet(id) {
  try {
    const result = await prisma.pet.findMany({
      where: { id },
    });
    return result;
  } catch (e) {
    throw e;
  }
}

async function postOnePet(req, res) {
  let newPet = req.body;
  const isValidPet = newPetObjChecker(newPet);

  try {
    if (!isValidPet) return res.json({ ERROR: "BOOK info invalid" });
    const createdNewPet = await createNewPet(newPet);
    res.json(createdNewPet);
  } catch (e) {
    errorHandling(e, res);
  }
}

function newPetObjChecker(newPet) {
  const NewPetRequirements = ["name", "age", "type", "breed", "microchip"];

  const hasAllKeys = NewPetRequirements.every((item) =>
    newPet.hasOwnProperty(item)
  );

  if (
    !hasAllKeys ||
    typeof newPet.age !== "number" ||
    typeof newPet.microchip !== "boolean" ||
    Object.keys(newPet).length !== NewPetRequirements.length
  )
    return false;
  else return true;
}

async function createNewPet(newPet) {
  const { name, type, age, breed, microchip } = newPet;

  try {
    const result = await prisma.pet.create({
      data: {
        name,
        type,
        age,
        breed,
        microchip,
      },
    });
    return result;
  } catch (e) {
    throw e;
  }
}

async function patchOnePet(req, res) {
  const toUpdateId = Number(req.params.id);
  const toUpdateContent = req.body;

  try {
    const isExist = idExistChecker(toUpdateId);
    if (!isExist)
      return res.json({ ERROR: `PET NOT FOUND petId:${toUpdateId}` });

    const contentValid = updatePetObjChecker(toUpdateContent);
    if (!contentValid) return res.json({ ERROR: `Update info incorrect` });

    const updatedBook = await updatePetToServer(toUpdateId, toUpdateContent);
    res.json(updatedBook);
  } catch (e) {
    errorHandling(e, res);
  }
}

async function idExistChecker(id) {
  const targetItem = await selectOnePet(id);
  if (targetItem) return true;
  else return false;
}

function updatePetObjChecker(toUpdateContent) {
  const UpdatePetRequirements = [
    "id",
    "name",
    "age",
    "type",
    "breed",
    "microchip",
  ];

  if (
    (toUpdateContent.age && typeof toUpdateContent.age !== "number") ||
    (toUpdateContent.microchip &&
      typeof toUpdateContent.microchip !== "boolean")
  )
    return false;

  for (const key of Object.keys(toUpdateContent)) {
    const keyChecker = UpdatePetRequirements.includes(key);
    if (!keyChecker) return false;
  }

  return true;
}

async function updatePetToServer(id, toUpdateContent) {
  try {
    const updatedBook = await prisma.pet.update({
      where: {
        id,
      },
      data: toUpdateContent,
    });

    return updatedBook;
  } catch (e) {
    throw e;
  }
}

async function deleteOnePet(req, res) {
  const id = Number(req.params.id);
  try {
    const deletePet = await prisma.pet.delete({
      where: {
        id,
      },
    });

    res.json({ DeletedItem: deletePet });
  } catch (e) {
    errorHandling(e, res);
  }
}

module.exports = {
  getAllPets,
  getPetTypes,
  getPetByType,
  getOnePet,
  postOnePet,
  patchOnePet,
  deleteOnePet,
};
