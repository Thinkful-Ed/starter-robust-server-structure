const express = require("express");
const app = express();

const flips = require("./data/flips-data");
const counts = require("./data/counts-data");

app.use(express.json());

app.get("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    next({
      status: 404,
      message: `Count id not found: ${countId}`,
    });
  } else {
    res.json({ data: foundCount });
  }
});

app.get("/counts", (req, res) => {
  res.json({ data: counts });
});

app.get("/flips/:flipId", (req, res, next) => {
  const { flipId } = req.params;
  const foundFlip = flips.find(flip => flip.id === Number(flipId));

  if (foundFlip) {
    res.json({ data: foundFlip });
  } else {
    next({
      status: 404,
      message: `Flip id not found: ${flipId}`,
    });
  }
});

app.get("/flips", (req, res) => {
  res.json({ data: flips });
});

const bodyHasResultProperty = (req, res, next) => {
  const { data: { result } = {} } = req.body;
  if (result) {
    return next();
  }
  next({
    status: 400,
    message: "A 'result' property is required.",
  });
};

app.post("/flips", bodyHasResultProperty, (req, res, next) => {
  const { data: { result } = {} } = req.body;
  const newFlip = {
    id: flips.length + 1, // Assign the next ID
    result,
  };
  flips.push(newFlip);
  counts[result] = counts[result] + 1; // Increment the counts
  res.status(201).json({ data: newFlip });
});

// Not found handler
app.use((req, res, next) => {
  next({ status: 404, message: `Not found: ${req.originalUrl}` });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ errors: [message] });
});

module.exports = app;
