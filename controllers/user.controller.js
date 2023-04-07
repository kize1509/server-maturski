const db = require("../controllers/db.controller");

function getUserByUsernameAndPassword(req, res) {
  const user = req.params.username;
  const pass = req.params.password;

  db.query(
    `SELECT * FROM maturski.users WHERE username='${user}' AND password='${pass}';`,
    function (err, result) {
      if (err) {
        console.log(err);
        res.send("error");
      } else {
        res.send(result);
      }
    }
  );
}

function saveNewUser(req, res) {
  const afirmativeResponse = {
    message: "Successfully appended the database!",
  };

  const rejectionResponse = {
    message: "Unable to save the user!",
  };

  const invalidCredentials = {
    message: "Uslovi nisu ispunjeni!",
  };

  let username = req.body.username;
  let password = req.body.password;
  let razredOdeljenje = req.body.razred;

  let mailFormat =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let passFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
  let razredFormat =
    /^(I(V|I{0,2})-([1-9]|11|10))$|^((V\I{2,3})\-[1-2])|adm|prof$/;

  if (
    username.toLowerCase().match(mailFormat) &&
    razredOdeljenje.match(razredFormat) &&
    password.match(passFormat)
  ) {
    db.query(
      `SELECT * FROM users WHERE username='${username}'`,
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          if (result.length > 0) {
            let response = JSON.stringify(rejectionResponse);
            res.send(response);
          } else {
            db.query(
              `INSERT INTO users (username, password, razred) VALUES ('${username}', '${password}', '${razredOdeljenje}')`,
              function (err, result) {
                if (err) {
                  let response = JSON.stringify(rejectionResponse);
                  res.send(response);
                  console.log(err);
                } else {
                  let response = JSON.stringify(afirmativeResponse);
                  res.send(response);
                }
              }
            );
          }
        }
      }
    );
  } else {
    res.send(invalidCredentials);
  }
}

function getAllUsers(req, res) {
  const errorJson = { message: "error while reading the database" };
  let username = req.params.username;

  db.query(
    `SELECT * FROM users WHERE username != '${username}'`,
    function (err, result) {
      if (err) {
        let errorMessage = JSON.stringify(errorJson);
        res.send(errorMessage);
      } else {
        res.send(result);
      }
    }
  );
}

function deleteUser(req, res) {
  const errorMessage = {
    message: "UNABLE TO DELETE THE USER!",
  };

  const successMessage = {
    message: "SUCCESS!",
  };

  let username = req.params.username;

  db.query(
    `DELETE FROM users WHERE username = '${username}'`,
    function (err, result) {
      if (err) {
        res.send(JSON.stringify(errorMessage));
      }
      if (result) {
        res.send(JSON.stringify(successMessage));
      }
    }
  );
}

module.exports = {
  getUserByUsernameAndPassword,
  saveNewUser,
  getAllUsers,
  deleteUser,
};
