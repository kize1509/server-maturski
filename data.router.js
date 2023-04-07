const express = require("express");

const userController = require("./controllers/user.controller.js");
const chatController = require("./controllers/chat.controller.js");

const dataRouter = express.Router();


dataRouter.get("/messages/:room", chatController.getMessages);
dataRouter.get("/:username&:password", userController.getUserByUsernameAndPassword);
dataRouter.get("/:username", userController.getAllUsers);
dataRouter.post("/new", userController.saveNewUser);
dataRouter.delete("/del:username", userController.deleteUser);
dataRouter.post("/newChat", chatController.createANewChat);
dataRouter.get("/allRooms/:username", chatController.getAllRooms);

module.exports = { dataRouter };