const adminMiddleware = (req, res, next) => {
  try {
    // Asumsi `req.user` telah diisi oleh authMiddleware
    const user = req.user;

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next(); // Lanjut ke handler berikutnya jika user adalah admin
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = adminMiddleware;
