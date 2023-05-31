const express = require("express");
const { dataRouter } = require("./data.router");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const db = require("./controllers/db.controller");
const moment = require("moment-timezone");
const { log } = require("console");

const PORT = 80;

moment.tz.setDefault("Europe/Belgrade");

app.use(express.json());

app.use("/data", dataRouter);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (data) => {
    console.log(data.username);
    db.query(
      `SELECT * FROM maturski.users WHERE username = '${data.username}'`,
      function (err, result) {
        if (result) {
          let id = result[0].id;
          console.log("--------------------");
          console.log("KORISNIK: ");
          console.log(result);
          console.log("--------------------");
          db.query(
            `INSERT INTO maturski.messages (message, sentFrom, chatRoom, messageDateTime) VALUES ('${data.message}', '${id}', '${data.room}', NOW())`,
            function (err, result) {
              console.log(result);
              if (err) {
                console.log(err);
              } else {
                var now = moment().format();
                data.messageDateTime = now;
                socket.emit("returnMessage", data);
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
