const db = require("../controllers/db.controller");
const path = require("path");
const fs = require("fs");
const { log } = require("console");

function Save(req, res, next) {
  var name = req.file.originalname;
  var role = req.params.role;
  var who = req.params.name;

  const incorrectUser = { message: "the professor does not exist!" };
  const incorrectClass = { message: "the class does not exist!" };

  const scheduleSavedResponse = { message: "saved!" };
  const errResponse = { message: "not saved!" };
  const errSamePath = { message: "same path as the existing!" };
  var path = "../schedules/" + name;
  if (role === "prof") {
    db.query(
      `SELECT * FROM maturski.users WHERE username = '${who}' AND razred = 'prof'`,
      function (err, result) {
        if (err) {
          console.log(err);
          fs.unlink(req.file.path, function () {
            console.log("brisanje");
            return next();
          });
          res.send(incorrectUser);
        } else {
          if (result.length == 0) {
            res.send(incorrectUser);
            fs.unlink(req.file.path, function () {
              console.log("brisanje");
              return next();
            });
          } else {
            db.query(
              `INSERT INTO maturski.scedules (name, date, path) VALUES ('${who}', NOW(), '${path}')`,
              function (err, result) {
                if (err) {
                  if (err.code === "ER_DUP_ENTRY") {
                    res.send(errSamePath);
                    fs.unlink(req.file.path, function () {
                      console.log("brisanje");
                      return next();
                    });
                  }
                  if (err.code !== "ER_DUP_ENTRY" && err) {
                    console.log("====================================");
                    console.log(err);
                    console.log("====================================");
                    fs.unlink(req.file.path, function () {
                      console.log("brisanje");
                      return next();
                    });
                    res.send(errResponse);
                  }
                } else {
                  console.log("====================================");
                  console.log(result);
                  console.log("====================================");
                  res.send(scheduleSavedResponse);
                }
              }
            );
          }
        }
      }
    );
  }
  if (role === "stud") {
    db.query(
      `SELECT * FROM maturski.users WHERE razred = '${who}'`,
      function (err, result) {
        if (err) {
          console.log(err);
          fs.unlink(req.file.path, function () {
            console.log("brisanje");
            return next();
          });
          res.send(incorrectClass);
        } else {
          if (result.length == 0) {
            fs.unlink(req.file.path, function () {
              console.log("brisanje");
              return next();
            });
            res.send(incorrectClass);
          } else {
            db.query(
              `INSERT INTO maturski.scedules (name, date, path) VALUES ('${who}', NOW(), '${path}')`,
              function (err, result) {
                if (err) {
                  if (err.code === "ER_DUP_ENTRY") {
                    fs.unlink(req.file.path, function () {
                      console.log("brisanje");
                      return next();
                    });
                    res.send(errSamePath);
                  }
                  if (err.code !== "ER_DUP_ENTRY" && err) {
                    console.log("====================================");
                    console.log(err);
                    console.log("====================================");
                    fs.unlink(req.file.path, function () {
                      console.log("brisanje");
                      return next();
                    });
                    res.send(errResponse);
                  }
                } else {
                  console.log("====================================");
                  console.log(result);
                  console.log("====================================");
                  res.send(scheduleSavedResponse);
                }
              }
            );
          }
        }
      }
    );
  }
}

function get(req, res) {
  const errResponse = { message: "not able to get!" };
  var name = req.params.name;
  console.log("====================================");
  console.log(name);
  console.log("====================================");
  db.query(
    `SELECT path
    FROM maturski.scedules
    WHERE name = '${name}' and date = (SELECT MAX(date) FROM maturski.scedules where name = '${name}');`,
    function (err, result) {
      if (err) {
        console.log("====================================");
        console.log(err);
        res.send(errResponse);
        console.log("====================================");
      } else {
        if (result.length == 0) {
          res.send("no schedule");
        } else {
          console.log("====================================");
          console.log(result);
          var fileName = result[0].path;
          var filePath = path.join(__dirname, fileName);
          res.sendFile(filePath, function (err) {
            if (err) {
              console.log("error while sending...");
            } else {
              console.log("Sent:", fileName);
            }
          });
          console.log("====================================");
        }
      }
    }
  );
}

module.exports = { Save, get };
