async function getAllBook(req, res) {
  const result = await req.prisma.book.findMany();
  res.json(result);
}

async function postOneBook(req, res) {
  const newBook = req.body;
  const { title, type, author, topic, publicationdate } = newBook;
  const validBook = bookObjChecker("new", newBook);
  if (!validBook) return res.json({ ERROR: "BOOK info invalid" });

  const result = await req.prisma.book.create({
    data: {
      title,
      type,
      author,
      topic,
      publicationdate,
    },
  });
  res.json(result);
}

async function getOneBook(req, res) {
  const id = Number(req.params.id);
  const result = await req.prisma.book.findUnique({
    where: {
      id,
    },
  });
  res.json(result);
}

async function getBookByType(req, res) {
  const { type } = req.params;
  const { topic } = req.query;
  if (!topic) {
    const result = await req.prisma.book.findMany({
      where: {
        type,
      },
    });
    res.json(result);
  }
  if (topic) {
    const result = await req.prisma.book.findMany({
      where: {
        type,
        topic,
      },
    });
    res.json(result);
  }
}

async function getBookOfAuthor(req, res) {
  const author = req.params.authorName;
  const { order } = req.query;
  if (!order) {
    const result = await req.prisma.book.findMany({
      where: {
        author,
      },
    });
    res.json(result);
  }
  if (order) {
    const result = await req.prisma.book.findMany({
      where: {
        author,
      },
      orderBy: {
        publicationdate: "desc",
      },
    });
    res.json(result);
  }
}

async function deleteOneBook(req, res) {
  const id = Number(req.params.id);
  const deleteBook = await req.prisma.book.delete({
    where: {
      id,
    },
  });

  res.json({ DeletedItem: deleteBook });
}

async function patchOneBook(req, res) {
  const id = Number(req.params.id);
  const toUpdateItem = await req.prisma.book.findUnique({
    where: {
      id,
    },
  });
  if (!toUpdateItem) return res.json({ ERROR: `BOOK NOT FOUND bookId:${id}` });

  const toUpdateContent = req.body;
  const contentValid = bookObjChecker("update", toUpdateContent);
  if (!contentValid) return res.json({ ERROR: `Update info incorrect` });

  const updatedBook = await req.prisma.book.update({
    where: {
      id,
    },
    data: toUpdateContent,
  });

  res.json(updatedBook);
}

function bookObjChecker(checkerType, bookObject) {
  const newBookRequirements = [
    "title",
    "type",
    "author",
    "topic",
    "publicationdate",
  ];
  const updateBookRequirements = [
    "id",
    "title",
    "type",
    "author",
    "topic",
    "publicationdate",
  ];
  if (checkerType === "new") {
    const hasAllKeys = newBookRequirements.every((item) =>
      bookObject.hasOwnProperty(item)
    );
    if (
      hasAllKeys &&
      Object.keys(bookObject).length === newBookRequirements.length
    )
      return true;
    else return false;
  } else if (checkerType === "update") {
    for (const key of Object.keys(bookObject)) {
      const keyChecker = updateBookRequirements.includes(key);
      if (!keyChecker) return false;
    }

    return true;
    // const hasAllKeys = UpdateBookRequirements.every((item) =>
    //   bookObject.hasOwnProperty(item)
    // );
    // if (
    //   hasAllKeys &&
    //   Object.keys(bookObject).length === UpdateBookRequirements.length
    // )
    //   return true;
    // else return false;
  } else return false;
}

module.exports = {
  getAllBook,
  postOneBook,
  getOneBook,
  getBookByType,
  patchOneBook,
  deleteOneBook,
  getBookOfAuthor,
};
