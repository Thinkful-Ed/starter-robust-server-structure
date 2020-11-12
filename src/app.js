const express = require("express");
const app = express();

const flips = require("./data/flips-data");
const counts = require("./data/counts-data");

app.use(express.json());

app.get("/counts/:countId", (request, response, next) => {
  const { countId } = request.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    next({
      status: 404,
      message: `Count id not found: ${countId}`,
    });
  } else {
    response.json({ data: foundCount });
  }
});

app.get("/counts", (request, response) => {
  response.json({ data: counts });
});

app.get("/flips/:flipId", (request, response, next) => {
  const { flipId } = request.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));

  if (foundFlip) {
    response.json({ data: foundFlip });
  } else {
    next({
      status: 404,
      message: `Flip id not found: ${flipId}`,
    });
  }
});

app.get("/flips", (request, response) => {
  response.json({ data: flips });
});


function bodyHasResultProperty(request, response, next) {
  const { data: { result } = {} } = request.body;
  if (result) {
    return next();
  }
  next({
    status: 400,
    message: "A 'result' property is required.",
  });
}

let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0)

app.post("/flips", bodyHasResultProperty, (request, response, next) => {
  const { data: { result } = {} } = request.body;
  if (result) {
    const newFlip = {
      id: ++lastFlipId, // Increment last id then assign as the current ID
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
  next({ status: 404, message: `Not found: ${request.originalUrl}` });
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
});

module.exports = app;
