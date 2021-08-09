const exp = require("constants");
const express = require("express");
const morgan = require("morgan");

const bookRouter = require("./resources/book/router");
const petRouter = require("./resources/pet/router");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/books", bookRouter);
app.use("/pets", petRouter);

app.get("*", (req, res) => {
  res.json({ ok: "true" });
});

const port = 3030;
app.listen(port, () => {
  console.log(`[SERVER] Running on http://localhost:${port}/`);
});
