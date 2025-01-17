const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
  getUser,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware"); // Optional: Middleware to verify JWT token
const adminMiddleware = require("../middlewares/adminMiddleware");

// Register user
router.post("/register", createUser);

// Get all users (admin only)
router.get("/all", authMiddleware, adminMiddleware, getAllUsers);

// Get a single user (admin or self)
router.get("/:userId", authMiddleware, getUser);

// delete user (by admin)
router.delete("/:userId", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
