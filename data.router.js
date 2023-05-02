const express = require("express");
const userController = require("./controllers/user.controller.js");
const chatController = require("./controllers/chat.controller.js");
const scheduleController = require("./controllers/schedule.controller.js");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./schedules/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const dataRouter = express.Router();

dataRouter.get("/messages/:room", chatController.getMessages);

dataRouter.get(
  "/:username&:password",
  userController.getUserByUsernameAndPassword
);

dataRouter.get("/chatusers/:username", userController.getAllUsersChat);
dataRouter.get("/delusers/:username", userController.getAllUsersDel);
dataRouter.post("/new", userController.saveNewUser);
dataRouter.delete("/del:username", userController.deleteUser);
dataRouter.post("/newChat", chatController.createANewChat);
dataRouter.get("/allRooms/:username", chatController.getAllRooms);
dataRouter.get("/schedule/:name", scheduleController.get);
dataRouter.post(
  "/schedule/:name/:role",
  upload.single("image"),
  scheduleController.Save
);

module.exports = { dataRouter };
