const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const db = require("./config/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const TaskRoutes = require("./routes/task");
require("dotenv").config();
db.connect();

const port = process.env.PORT || 4000;
// Middleware to parse JSON request bodies

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", TaskRoutes);
app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});