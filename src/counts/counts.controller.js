const counts = require("../data/counts-data");

function countExists(request, response, next) {
  const { countId } = request.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    return next({
      status: 404,
      message: `Count id not found: ${countId}`,
    });
  }
  response.locals.count = foundCount;
  next();
}

function read(request, response, next) {
  response.json({
    data: response.locals.count,
  });
}

function list(request, response) {
  response.json({ data: counts });
}

module.exports = {
  list,
  read: [countExists, read],
  countExists,
};
