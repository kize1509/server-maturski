const express = require("express");
const bodyParser = require("body-parser");
const { dataRouter } = require("./data.router");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const db = require("./controllers/db.controller");
const { log } = require("console");

const PORT = 80;

app.use(express.json());

app.use("/data", dataRouter);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (data) => {
    console.log(data.username);
    var today = new Date();
    data.messageDateTime = today;
    db.query(
      `SELECT * FROM maturski.users WHERE username = '${data.username}'`,
      function (err, result) {
        if (result) {
          var id = result[0].id;
          console.log(result);
          db.query(
            `INSERT INTO maturski.messages (message, sentFrom, chatRoom, messageDateTime) VALUES ('${data.message}', '${id}', '${data.room}', NOW())`,
            function (err, result) {
              if (!err) {
                console.log("message: " + data.messageDateTime);
                socket.emit("returnMessage", data);
              } else {
                console.log(err);
              }
            }
          );
        }
      }
    );
  });
});

server.listen(PORT, () => {
  console.log("LISTENING ON PORT: " + PORT + "...");
});
