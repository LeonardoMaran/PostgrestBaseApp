const { Client } = require("pg");
const { io } = require("../index.js");

const dbUser = process.env.dbUser;
const dbPW = process.env.dbPW;
const dbName = process.env.dbName;

const db_port = process.env.db_port;

const client = new Client({
  host: "db_host",
  port: 5432,
  user: dbUser,
  password: dbPW,
  database: dbName
});

client.connect(function(err, client) {
  console.log("db connected", err);
});

client.query("LISTEN db_notifications");

client.on("notification", function(msg) {
  io.emit("new application", msg.payload);
});
