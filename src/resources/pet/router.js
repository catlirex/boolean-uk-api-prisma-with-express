const express = require("express");

const {
  getAllPets,
  getOnePet,
  postOnePet,
  patchOnePet,
  deleteOnePet,
  getPetTypes,
  getPetByType,
} = require("./controller");

const petRouter = express.Router();

petRouter.get("/types", getPetTypes);
petRouter.get("/types/:type", getPetByType);
petRouter.get("/:id", getOnePet);
petRouter.get("/", getAllPets);
petRouter.post("/", postOnePet);
petRouter.patch("/:id", patchOnePet);
petRouter.delete("/:id", deleteOnePet);

module.exports = petRouter;
