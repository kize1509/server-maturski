const mysql = require("mysql");
const path = require("path");

var pool = mysql.createPool({
  connectionLimit:10,
  host: "localhost",
  user: "root",
  password: "zoranrepic10",
  database:"maturski"
});

pool.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Database connected successfully');
  connection.release();
});

module.exports = pool;