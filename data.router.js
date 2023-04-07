const express = require("express");

const dataController = require("./controllers/data.controller");

const dataRouter = express.Router();


dataRouter.get("/messages/:room", dataController.getMessages);
dataRouter.get("/:username&:password", dataController.getUserByUsernameAndPassword);
dataRouter.get("/:username", dataController.getAllUsers);
dataRouter.post("/new", dataController.saveNewUser);
dataRouter.delete("/del:username", dataController.deleteUser);
dataRouter.post("/newChat", dataController.createANewChat);
dataRouter.get("/allRooms/:username", dataController.getAllRooms);

module.exports = { dataRouter };