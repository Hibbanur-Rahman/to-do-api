const Router = require("express").Router();
const { register, login } = require("../controller/userController");
const {
  AddTask,
  ViewTask,
  UpdateCompleted,
  DeleteTask,
  getTasksByGroup,
} = require("../controller/taskController");
const { verifyToken } = require("../middleware/authMiddleware");

Router.post("/register", register);
Router.post("/login", login);
Router.post("/tasks", verifyToken, AddTask);
Router.get("/tasks", verifyToken, ViewTask);
Router.get("/tasks/:groupName", verifyToken, getTasksByGroup);
Router.post("/tasks/complete-todo", verifyToken, UpdateCompleted);
Router.delete("/tasks/:id", verifyToken, DeleteTask);
module.exports = Router;
