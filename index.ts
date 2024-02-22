import express from "express";

import path from "path";
import { Server, Socket } from "socket.io";
import bodyParser from "body-parser";
import http from "http";
const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);
const IO = new Server(server);

IO.on("connect", (socket) => {
  console.log("connected");
});

server.listen(8080, () => {
  console.log("listening");
});
