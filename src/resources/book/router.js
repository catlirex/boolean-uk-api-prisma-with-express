const express = require("express");
const {
  getAllBook,
  postOneBook,
  getOneBook,
  getBookByType,
  getBookOfAuthor,
  patchOneBook,
  deleteOneBook,
} = require("./controller");

const bookRouter = express.Router();

bookRouter.get("/", getAllBook);
bookRouter.get("/type/:type", getBookByType);
bookRouter.get("/author/:authorName", getBookOfAuthor);
bookRouter.get("/:id", getOneBook);
bookRouter.post("/", postOneBook);
bookRouter.patch("/:id", patchOneBook);
bookRouter.delete("/:id", deleteOneBook);

module.exports = bookRouter;
