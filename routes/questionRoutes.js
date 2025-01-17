// routes/questionRoutes.js
const express = require("express");
const {
  createQuestionSet,
  getQuestionsByCode,
  updateQuestionSet,
  deleteQuestionSet,
  getAllQuestion,
} = require("../controllers/questionController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

// Endpoint untuk membuat set soal baru (admin)
router.post("/create", authMiddleware, adminMiddleware, createQuestionSet);

// Endpoint untuk mengambil semua soal (admin)
router.get("/all", authMiddleware, adminMiddleware, getAllQuestion);

// Endpoint untuk mengambil soal berdasarkan kode
router.get("/:code", getQuestionsByCode);

// Endpoint untuk update soal berdasarkan kode (admin)
router.put("/:code", authMiddleware, adminMiddleware, updateQuestionSet);

// Endpoint untuk menghapus soal berdasarkan kode (admin)
router.delete("/:code", authMiddleware, adminMiddleware, deleteQuestionSet);

module.exports = router;
