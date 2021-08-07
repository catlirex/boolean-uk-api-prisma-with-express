const exp = require("constants");
const express = require("express");
const morgan = require("morgan");
const { PrismaClient } = require("@prisma/client");
const bookRouter = require("./resources/book/router");

const app = express();
const prisma = new PrismaClient();

app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

app.use("/books", bookRouter);

app.get("*", (req, res) => {
  res.json({ ok: "true" });
});

const port = 3030;
app.listen(port, () => {
  console.log(`[SERVER] Running on http://localhost:${port}/`);
});
