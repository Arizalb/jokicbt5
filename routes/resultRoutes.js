const express = require("express");
const {
  submitAnswer,
  getResult,
  getAllResults,
} = require("../controllers/resultController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

// Endpoint untuk submit jawaban
router.post("/submit-answer", authMiddleware, submitAnswer);

// Endpoint untuk mengambil hasil user tertentu
router.get("/:userId", authMiddleware, getResult);

// Endpoint untuk admin melihat semua hasil
router.get("/admin/all", authMiddleware, adminMiddleware, getAllResults);

module.exports = router;
