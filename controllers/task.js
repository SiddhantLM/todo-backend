const Task = require("../models/Task");
const User = require("../models/User");

const createTask = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    const newTask = await Task.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      email: email,
    });
    if (!newTask) {
      return res.status(500).send({
        success: false,
        message: "Failed to create task object",
      });
    }
    const existingUser = await User.findOneAndUpdate(
      { email: email },
      {
        $push: { Tasks: newTask._id },
      },
      {
        new: true,
      }
    );
    if (!existingUser) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(201).send({
      success: true,
      message: "Task created successfully",
      existingUser,
    });
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Failed to create task",
      error: error,
    });
  }
};

const showAllTasks = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.find({ email: email }).populate("Tasks").exec();
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Tasks retrieved successfully",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to retrieve tasks",
      error: error,
    });
  }
};

const markComplete = async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).send({
        success: false,
        message: "Task ID is required",
      });
    }

    const task = await Task.findByIdAndUpdate(taskId, { completed: true });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    const user = await User.findOne({ email: task.email })
      .populate("Tasks")
      .exec();
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Task marked as complete",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to mark task as complete",
      error: error,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).send({
        success: false,
        message: "Task ID is required",
      });
    }
    const task = await Task.findByIdAndDelete(taskId);
    // const task = await Task.;
    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }
    const user = await User.findOneAndUpdate(
      { email: task.email },
      {
        $pull: { Tasks: taskId },
      },
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Task deleted successfully",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to delete task",
      error: error,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId, title, description, dueDate } = req.body;

    if (!taskId) {
      return res.status(400).send({
        success: false,
        message: "Task ID is required",
      });
    }
    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        title: title || task.title,
        description: description || task.description,
        dueDate: dueDate || task.dueDate,
      },
      {
        new: true,
      }
    );

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to update task",
      error: error,
    });
  }
};

module.exports = {
  createTask,
  showAllTasks,
  deleteTask,
  markComplete,
  updateTask,
};
