const { response } = require("express");
const db = require("../controllers/db.controller");

function getUserByUsernameAndPassword(req, res){
    const user = req.params.username;
    const pass = req.params.password;


    db.query(`SELECT * FROM maturski.users WHERE username='${user}' AND password='${pass}';`, function(err, result){
        if(err){
            console.log(err);
            res.send("error");
        }else{
            res.send(result);
        }
    });
}


function saveNewUser(req, res){

    const afirmativeResponse = {
        message: "Successfully appended the database!"
    }

    const rejectionResponse = {
        message: "Unable to save the user!"
    }
    
    const invalidCredentials = {
        message: "Uslovi nisu ispunjeni!"
    }

    let username = req.body.username;
    let password = req.body.password;
    let razredOdeljenje = req.body.razred;

    let mailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let passFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    let razredFormat = /^(I(V|I{0,2})-([1-9]|11|10))$|^((V\I{2,3})\-[1-2])|adm|prof$/;

    if(username.toLowerCase().match(mailFormat) && razredOdeljenje.match(razredFormat) && password.match(passFormat)){

        db.query(`SELECT * FROM users WHERE username='${username}'`, function(err, result){
            if(err){
                
                res.send(err);
            }else{
                if(result.length>0){
                    let response = JSON.stringify(rejectionResponse);
                    res.send(response);
                }else{
                    
                    db.query(`INSERT INTO users (username, password, razred) VALUES ('${username}', '${password}', '${razredOdeljenje}')`, function(err, result){
                            if (err) {
                                let response = JSON.stringify(rejectionResponse);
                                res.send(response);
                                console.log(err);
                            }else{
                                let response = JSON.stringify(afirmativeResponse);
                                res.send(response);
                            }
                });
                }
            }
        });
    }else{

        res.send(invalidCredentials);
    }

}

function getAllUsers(req, res){

    const errorJson = {message:"error while reading the database"}
    let username = req.params.username;

    db.query(`SELECT * FROM users WHERE username != '${username}'`, function (err, result) {
       if(err){
        let errorMessage = JSON.stringify(errorJson);
        res.send(errorMessage);
       } else {
            res.send(result);
       }
    });
}

function deleteUser(req, res) {
    const errorMessage = {
        message: "UNABLE TO DELETE THE USER!"
    }    

    const successMessage = {
        message: "SUCCESS!"
    }

    let username = req.params.username;

    db.query(`DELETE FROM users WHERE username = '${username}'`, function(err, result){
        if(err){
            res.send(JSON.stringify(errorMessage));
        }
        if(result){
            res.send(JSON.stringify(successMessage));
        }
    })
}

function getMessages(req, res){
    const errorMessage = {
        message: "UNABLE TO GET MESSAGES!"
    }    
    console.log(req.params.room);
    db.query(`SELECT messages.message, users.username, chatRoom, messageDateTime FROM messages JOIN users ON users.id = messages.sentFrom WHERE messages.chatRoom = '${req.params.room} ORDER BY messageDate ASC;'`, function(err, result){
            if(err){
                console.log(err);
                res.send(errorMessage);
            }else{
                
                console.log(result);

                res.send(result);  
            }
    });
}

function createANewChat(req, res){
    const member1 = req.body.member1;
    const member2 = req.body.member2;

    const chatRoomExistsResponse = {message: "exists", id:""};
    const chatRoomCreatedResponse = {message: "successfuly created", id:""};
    const processFailedMessage = {message: "failed"};

    db.query(`SELECT id FROM maturski.users WHERE username = '${member1}' or username = '${member2}'`, function(err, result){
        if(result){
            const id_member_1 = result[0].id;
            const id_member_2 = result[1].id;
            console.log(id_member_1, id_member_2);
            db.query(`SELECT * FROM maturski.chat_rooms where (chat_member1 = '${id_member_1}' and chat_member2 = '${id_member_2}') or (chat_member1 = '${id_member_2}' and chat_member2 = '${id_member_1}')`, function(err, result){
                    if(result.length > 0){
                        chatRoomExistsResponse.id = result[0].id;
                        res.send(chatRoomExistsResponse);
                    }else{
                        db.query(`INSERT INTO maturski.chat_rooms (chat_member1, chat_member2) VALUES ('${id_member_1}', '${id_member_2}')`, function(err, result){
                            if(result){
                                db.query(`SELECT id FROM maturski.chat_rooms WHERE chat_member1 = '${id_member_1}' and chat_member2 = '${id_member_2}'`, function (err, result) {
                                    if(result){
                                        chatRoomCreatedResponse.id = result[0].id;
                                        res.send(JSON.stringify(chatRoomCreatedResponse));
                                    }else{
                                        console.log(err);
                                        res.send(JSON.stringify(processFailedMessage));
                                    }
                                });
                            }else{
                                console.log(err);
                                res.send(processFailedMessage);
                            }
                        })
                    }
            })
        }else{
            console.log(err);
            res.send(processFailedMessage);
        }   
    });
}

function getAllRooms(req, res){
    const errResponse = {message: "failed"};
    
    db.query(`SELECT users.id FROM users WHERE  users.username = '${req.params.username}'`, function(err, result){
            if(err){
                res.send(errResponse);
            }else{
                db.query(`SELECT 
                CASE 
                  WHEN chat_rooms.chat_member1 = users.id THEN users2.username
                  WHEN chat_rooms.chat_member2 = users.id THEN users1.username 
                END as other_chat_member_username, chat_rooms.id
              FROM chat_rooms
              JOIN users ON users.id = '${result[0].id}'
              JOIN users as users1 ON users1.id = chat_rooms.chat_member1
              JOIN users as users2 ON users2.id = chat_rooms.chat_member2
              WHERE chat_rooms.chat_member1 = users.id OR chat_rooms.chat_member2 = users.id
              `, function(err, result1) {
                    if(err){
                        console.log(err);
                        res.send(errResponse);
                    }else{
                        console.log(result1);
                        res.send(result1)
                    }
                    
                });
            }
    })
    
}

module.exports = {getUserByUsernameAndPassword, saveNewUser, getAllUsers, deleteUser, getMessages, createANewChat, getAllRooms}