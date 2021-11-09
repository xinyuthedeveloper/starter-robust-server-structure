const counts = require("../data/counts-data");

function list(req, res) {
    res.json({ data: counts });
}

function countExists(req, res, next) {
    const { countId } = req.params;
    const foundCount = counts[countId];
    if (foundCount !== undefined) return next();
    next({
        status: 404,
        message: `Count id not found: ${countId}`,
    })
}

function validateCountId(req, res, next) {
    const { countId } = req.params;
    const validResult = ["heads", "tails", "edge"];
    if (validResult.includes(countId)) return next();
    next({
        status: 400,
        message: `Value of the 'countId' property must be one of ${validResult}. Received: ${countId}`,
      })
}

function read(req, res) {
    const { countId } = req.params;
    const foundCount = counts[countId];
    res.json({ data: foundCount })
}

module.exports = {
    list,
    read: [validateCountId, countExists, read]
}
