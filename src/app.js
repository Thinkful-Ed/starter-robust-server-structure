const express = require("express");
const app = express();

const flips = require("./data/flips-data");
const counts = require("./data/counts-data");

app.use(express.json());

app.use("/counts/:countId", (request, response, next) => {
  const { countId } = request.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    next(`Count id not found: ${countId}`);
  } else {
    response.json({ data: foundCount });
  }
});

app.use("/counts", (request, response) => {
  response.json({ data: counts });
});

app.use("/flips/:flipId", (request, response, next) => {
  const { flipId } = request.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));

  if (foundFlip) {
    response.json({ data: foundFlip });
  } else {
    next(`Flip id not found: ${flipId}`);
  }
});

app.get("/flips", (request, response) => {
  response.json({ data: flips });
});

app.post("/flips", (request, response, next) => {
  const { data: { result } = {} } = request.body;
  if (result) {
    const newFlip = {
      id: flips.length + 1, // Assign the next ID
      result,
    };
    flips.push(newFlip);
    counts[result] = counts[result] + 1; // Increment the counts
    response.status(201).json({ data: newFlip });
  } else {
    response.sendStatus(400);
  }
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
