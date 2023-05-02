const db = require("../controllers/db.controller");

function getMessages(req, res) {
  const errorMessage = {
    message: "UNABLE TO GET MESSAGES!",
  };
  console.log(req.params.room);
  db.query(
    `SELECT 
    messages.message, 
    users.username, 
    chatRoom, 
    CONVERT_TZ(messageDateTime, '+00:00', '+02:00') AS messageDateTime 
  FROM 
    messages 
  JOIN 
    users ON users.id = messages.sentFrom 
  WHERE 
    messages.chatRoom = '${req.params.room}' 
  ORDER BY 
    messageDateTime ASC;
  `,
    function (err, result) {
      if (err) {
        console.log(err);
        res.send(errorMessage);
      } else {
        console.log(result);

        res.send(result);
      }
    }
  );
}

function createANewChat(req, res) {
  const member1 = req.body.member1;
  const member2 = req.body.member2;

  const chatRoomExistsResponse = { message: "exists", id: "" };
  const chatRoomCreatedResponse = { message: "successfuly created", id: "" };
  const processFailedMessage = { message: "failed" };

  db.query(
    `SELECT id FROM maturski.users WHERE username = '${member1}' or username = '${member2}'`,
    function (err, result) {
      if (result) {
        const id_member_1 = result[0].id;
        const id_member_2 = result[1].id;
        console.log(id_member_1, id_member_2);
        db.query(
          `SELECT * FROM maturski.chat_rooms where (chat_member1 = '${id_member_1}' and chat_member2 = '${id_member_2}') or (chat_member1 = '${id_member_2}' and chat_member2 = '${id_member_1}')`,
          function (err, result) {
            if (result.length > 0) {
              chatRoomExistsResponse.id = result[0].id;
              res.send(chatRoomExistsResponse);
            } else {
              db.query(
                `INSERT INTO maturski.chat_rooms (chat_member1, chat_member2) VALUES ('${id_member_1}', '${id_member_2}')`,
                function (err, result) {
                  if (result) {
                    db.query(
                      `SELECT id FROM maturski.chat_rooms WHERE chat_member1 = '${id_member_1}' and chat_member2 = '${id_member_2}'`,
                      function (err, result) {
                        if (result) {
                          chatRoomCreatedResponse.id = result[0].id;
                          res.send(JSON.stringify(chatRoomCreatedResponse));
                        } else {
                          console.log(err);
                          res.send(JSON.stringify(processFailedMessage));
                        }
                      }
                    );
                  } else {
                    console.log(err);
                    res.send(processFailedMessage);
                  }
                }
              );
            }
          }
        );
      } else {
        console.log(err);
        res.send(processFailedMessage);
      }
    }
  );
}

function getAllRooms(req, res) {
  const errResponse = { message: "failed" };

  db.query(
    `SELECT users.id FROM users WHERE  users.username = '${req.params.username}'`,
    function (err, result) {
      if (err) {
        res.send(errResponse);
      } else {
        db.query(
          `SELECT 
                CASE 
                  WHEN chat_rooms.chat_member1 = users.id THEN users2.username
                  WHEN chat_rooms.chat_member2 = users.id THEN users1.username 
                END as other_chat_member_username, chat_rooms.id
              FROM chat_rooms
              JOIN users ON users.id = '${result[0].id}'
              JOIN users as users1 ON users1.id = chat_rooms.chat_member1
              JOIN users as users2 ON users2.id = chat_rooms.chat_member2
              WHERE chat_rooms.chat_member1 = users.id OR chat_rooms.chat_member2 = users.id
              `,
          function (err, result1) {
            if (err) {
              console.log(err);
              res.send(errResponse);
            } else {
              console.log(result1);
              res.send(result1);
            }
          }
        );
      }
    }
  );
}

module.exports = { getMessages, createANewChat, getAllRooms };
