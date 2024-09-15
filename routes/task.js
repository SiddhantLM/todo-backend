const express = require("express");
const router = express.Router();
const {
  createTask,
  deleteTask,
  markComplete,
  showAllTasks,
  updateTask,
} = require("../controllers/task");
const { isAuth } = require("../middlewares/auth");

router.post("/create-task", isAuth, createTask);
router.post("/delete-task", isAuth, deleteTask);
router.post("/show-all-tasks", isAuth, showAllTasks);

router.post("/mark-complete", isAuth, markComplete);

router.post("/update-task", isAuth, updateTask);

module.exports = router;
