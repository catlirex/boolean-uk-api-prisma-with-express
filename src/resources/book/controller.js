const prisma = require("../../utils/database");

function errorHandling(error, res) {
  console.log(error.message);
  if (error.message.includes("invalid value"))
    res.status(400).json({ ERROR: "Invalid value type found" });
  else
    res
      .status(500)
      .json({ ERROR: "Internal server error please try again later" });
}

async function getAllBook(req, res) {
  try {
    const result = await prisma.book.findMany();
    res.json(result);
  } catch (e) {
    errorHandling(e, res);
  }
}

async function postOneBook(req, res) {
  const newBook = req.body;
  const { title, type, author, topic, publicationdate } = newBook;
  const validBook = newBookChecker(newBook);
  if (!validBook) return res.status(400).json({ ERROR: "BOOK info invalid" });

  try {
    const result = await prisma.book.create({
      data: {
        title,
        type,
        author,
        topic,
        publicationdate,
      },
    });
    res.json(result);
  } catch (e) {
    errorHandling(e, res);
  }
}

async function getOneBook(req, res) {
  const id = Number(req.params.id);

  try {
    const result = await prisma.book.findUnique({
      where: {
        id,
      },
    });
    if (result) res.json(result);
    else res.json({ msg: "Item not found" });
  } catch (e) {
    errorHandling(e, res);
  }
}

async function getBookByType(req, res) {
  const { type } = req.params;
  const { topic } = req.query;
  let result = null;

  try {
    if (!topic) result = await selectBookByTypeWithoutTopic(type);
    if (topic) result = await selectBookByTypeWithTopic(type, topic);
    if (result.length) res.json(result);
    if (!result.length) res.json({ Msg: "No data found" });
  } catch (e) {
    errorHandling(e, res);
  }
}

async function selectBookByTypeWithoutTopic(type) {
  try {
    const result = await prisma.book.findMany({
      where: {
        type,
      },
    });
    return result;
  } catch (e) {
    throw e;
  }
}

async function selectBookByTypeWithTopic(type, topic) {
  try {
    const result = await prisma.book.findMany({
      where: {
        type,
        topic,
      },
    });

    return result;
  } catch (e) {
    throw e;
  }
}

async function getBookOfAuthor(req, res) {
  const author = req.params.authorName;
  const { order } = req.query;
  let result = null;
  try {
    if (!order) result = await selectBookOfAuthorWithoutOrder(author);
    if (order) result = await selectBookOfAuthorWithOrder(author);
    if (result.length) res.json(result);
    if (!result.length) res.json({ Msg: "No data found" });
  } catch (e) {
    errorHandling(e, res);
  }
}

async function selectBookOfAuthorWithoutOrder(author) {
  try {
    const result = await prisma.book.findMany({
      where: {
        author,
      },
    });
    return result;
  } catch (e) {
    throw e;
  }
}

async function selectBookOfAuthorWithOrder(author) {
  try {
    const result = await prisma.book.findMany({
      where: {
        author,
      },
      orderBy: {
        publicationdate: "desc",
      },
    });
    return result;
  } catch (e) {
    throw e;
  }
}

async function deleteOneBook(req, res) {
  const id = Number(req.params.id);
  try {
    const deleteBook = await prisma.book.delete({
      where: {
        id,
      },
    });

    res.json({ DeletedItem: deleteBook });
  } catch (e) {
    errorHandling(e, res);
  }
}

async function patchOneBook(req, res) {
  const id = Number(req.params.id);
  const toUpdateContent = req.body;
  try {
    const itemExist = await itemChecker(id);
    if (!itemExist) return res.json({ ERROR: `BOOK NOT FOUND bookId:${id}` });

    const contentValid = updateBookObjChecker(toUpdateContent);
    if (!contentValid) return res.json({ ERROR: `Update info incorrect` });

    const updatedBook = await updateBookToServer(id, toUpdateContent);
    res.json(updatedBook);
  } catch (e) {
    errorHandling(e, res);
  }
}

async function itemChecker(id) {
  try {
    const toUpdateItem = await prisma.book.findUnique({
      where: {
        id,
      },
    });
    if (toUpdateItem) return true;
    if (!toUpdateItem) return false;
  } catch (e) {
    throw e;
  }
}

async function updateBookToServer(id, toUpdateContent) {
  try {
    const updatedBook = await prisma.book.update({
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

function newBookChecker(bookObject) {
  const newBookRequirements = [
    "title",
    "type",
    "author",
    "topic",
    "publicationdate",
  ];

  const hasAllKeys = newBookRequirements.every((item) =>
    bookObject.hasOwnProperty(item)
  );

  const lengthMatch =
    !!Object.keys(bookObject).length === newBookRequirements.length;
  if (hasAllKeys && lengthMatch) return true;
  else return false;
}

function updateBookObjChecker(bookObject) {
  const updateBookRequirements = [
    "id",
    "title",
    "type",
    "author",
    "topic",
    "publicationdate",
  ];

  for (const key of Object.keys(bookObject)) {
    const keyChecker = updateBookRequirements.includes(key);
    if (!keyChecker) return false;
  }

  return true;
}

module.exports = {
  getAllBook,
  postOneBook,
  getOneBook,
  getBookByType,
  patchOneBook,
  deleteOneBook,
  getBookOfAuthor,
  errorHandling,
};
