const express = require("express");
const router = express.Router();
const imageController = require("../controllers/uploadassetsController");

// Define routes
router.post("/uploadAssets", imageController.uploadFile);

router.post("/delete-file", imageController.deleteImageByPath);

module.exports = router;
