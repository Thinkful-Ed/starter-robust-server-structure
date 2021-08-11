const express = require("express");
const app = express();

//Obtain the flip-records from the data directory
const flips = require("./data/flips-data");
const counts = require("./data/counts-data");

/******************************** ROUTES ********************************/

/************** /coins/ paths **************/
// "/counts/:countId" Route
app.use("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];
  return foundCount === undefined
    ? next(`Count id "${countId}" not found!`)
    : res.json({ data: foundCount });
});

// "/counts" Route
app.use("/counts", (req, res) => {
  res.json({ data: counts });
});

/************** /flips/ paths **************/
// "/flips/:flipId" Route
app.use("/flips/:flipId", (req, res, next) => {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));

  return foundFlip
    ? res.json({ data: foundFlip })
    : next(`Flip id "${flipId}" not found!`);
});

// "/flips" Route
app.use("/flips", (req, res) => res.json({ data: flips }));

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
