const router = require("express").Router();
const controller = require("./counts.controller");


router.route("/")
    .get(controller.list);

router.route("/:countId")
    .get(controller.read)

module.exports = router;