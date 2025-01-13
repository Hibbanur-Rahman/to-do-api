const TaskModel = require("../models/taskModel"); // Import Task model
const UserModel = require("../models/userModel");
const httpStatusCode = require("../constant/httpStatusCode");

// Function to add a task to a user
const AddTask = async (req, res) => {
  try {
    const { taskName, completed, tags } = req.body;
    const userId = req.user._id; // Assuming you have a middleware to extract user info (req.user)

    // Find the user by ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Create a new task
    const newTask = new TaskModel({
      userId, // Associate task with the user
      taskName,
      completed,
      tags,
    });

    // Save the new task
    const savedTask = await newTask.save();

    // Push task ID to user's tasks array
    user.tasks.push(savedTask._id);
    await user.save();

    return res.status(httpStatusCode.CREATED).json({
      success: true,
      message: "Task added successfully",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error adding task:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const EditTask = async (req, res) => {
  try {
    const { taskId, taskName, completed, tags } = req.body;
    const userId = req.user._id; // Assuming you have middleware to extract user from request

    // Find the user by ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the task index in the user's tasks array
    const taskIndex = user.tasks.findIndex((task) => task._id === taskId);

    if (taskIndex === -1) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Task not found",
      });
    }

    // Update task details
    user.tasks[taskIndex].taskName = taskName;
    user.tasks[taskIndex].completed = completed;
    user.tasks[taskIndex].tags = tags;

    await user.save();

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Task updated successfully",
      task: user.tasks[taskIndex], // Return the updated task
    });
  } catch (error) {
    console.error("Error editing task:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const ViewTask = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    // Find the user and populate their tasks
    const user = await UserModel.findById(userId).populate("tasks");
    if (!user) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "user is not found",
      });
    }

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "view successfully",
      data: user.tasks,
    });
  } catch (error) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "something went wrong !",
      error: error.message,
    });
  }
};

const UpdateCompleted = async (req, res) => {
  try {
    const {taskItemId } = req.body;
    if (!taskItemId) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "taskItemId value is not defined!!",
      });
    }
    const userId = req.user._id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "user is not found!!",
      });
    }

    const task=await TaskModel.findByIdAndUpdate({taskItemId},{
      completed:true
    })
    if(!task){
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "task is not found!!",
      });
    }
    

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "updated successfully !!",
      data: task,
    });
  } catch (error) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "something went wrong!!",
      error: error.message,
    });
  }
};

const DeleteTask = async (req, res) => {
  try {
    const taskId = req.params.id; // Access taskId from route params
    const userId = req.user._id;  // Assuming you have a middleware to extract user info (req.user)

    // Find the user by ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the task and delete it
    const deletedTask = await TaskModel.findOneAndDelete({ _id: taskId, userId });

    if (!deletedTask) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Task not found or you do not have permission to delete it",
      });
    }

    // Remove the task reference from the user's tasks array
    user.tasks.pull(taskId);
    await user.save();

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

module.exports = { AddTask, EditTask, ViewTask, UpdateCompleted,DeleteTask };
