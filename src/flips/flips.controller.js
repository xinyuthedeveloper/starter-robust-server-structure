const flips = require("../data/flips-data");
const counts = require("../data/counts-data");

let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0)

function bodyHasResultProperty(req, res, next) {
  const { data: { result } = {} } = req.body;
  if (result) {
    return next();
  }
  next({
    status: 400,
    message: "A 'result' property is required.",
  });
}

function resultPropertyIsValid(req, res, next) {
  const { data: { result } = {} } = req.body;
  const validResult = ["heads", "tails", "edge"];
  if (validResult.includes(result)) return next();
  next({
    status: 400,
    message: `Value of the 'result' property must be one of ${validResult}. Received: ${result}`,
  })
}

function create(req, res) {
  const { data: { result } = {} } = req.body;
  const newFlip = {
    id: ++lastFlipId, // Increment last ID, then assign as the current ID
    result,
  };
  flips.push(newFlip);
  counts[result] = counts[result] + 1;
  res.status(201).json({ data: newFlip });
}

function list(req, res) {
  res.json({ data: flips });
}

function flipExists(req, res, next) {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));
  if (foundFlip) return next();
  next({
    status: 404,
    message: `Flip id not found: ${flipId}`,
  })
}

function read(req, res) {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));
  res.json({ data: foundFlip });
}

function update(req, res) {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));

  const originalResult = foundFlip.result;
  const { data: { result } = {} } = req.body;

  if (originalResult !== result) {
    // update the flip
    foundFlip.result = result;
    // Adjust the counts
    counts[originalResult] --;
    counts[result] ++;
  }

  res.json({ data: foundFlip });
}

function destory(req, res) {
  const { flipId } = req.params;
  const indexDeleteFrom = flips.findIndex((flip) => flip.id === Number(flipId));
  const deletedFlips = flips.splice(indexDeleteFrom, 1);
  deletedFlips.forEach((deletedFlip) => {
    counts[deletedFlip.result] --;
  });

  res.sendStatus(204);
}

module.exports = {
  list,
  create: [bodyHasResultProperty, resultPropertyIsValid, create],
  read: [flipExists, read],
  update: [flipExists, bodyHasResultProperty, resultPropertyIsValid, update],
  delete: [flipExists, destory],
};