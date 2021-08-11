const express = require("express");
const app = express();

//Obtain the flip-records from the data directory
const flips = require("./data/flips-data");
const counts = require("./data/counts-data");

/******************************** ROUTES ********************************/
app.use(express.json());

/************** /coins/ paths **************/
// "/counts/:countId" Route
app.get("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];
  return foundCount === undefined
    ? next(`Count id "${countId}" not found!`)
    : res.json({ data: foundCount });
});

// "/counts" Route
app.get("/counts", (req, res) => {
  res.json({ data: counts });
});

/************** /flips/ paths **************/
let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);
// "/flips/:flipId" Route
app.get("/flips/:flipId", (req, res, next) => {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));

  return foundFlip
    ? res.json({ data: foundFlip })
    : next(`Flip id "${flipId}" not found!`);
});

// "/flips" Route
app.get("/flips", (req, res) => res.json({ data: flips }));
app.post("/flips", (req, res, next) => {
  const { data: { result } = {} } = req.body;
  const newFlip = {
    id: ++lastFlipId, // Increment last ID, then assign as the current ID
    result,
  };
  flips.push(newFlip);
  counts[result] = counts[result] + 1; // Increment the counts
  res.json({ data: newFlip });
});

// Default 404 Route
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
