require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const resultRoutes = require("./routes/resultRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running, Database connected");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
