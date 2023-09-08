import express from "express";
import http from "http";
import { WebSocket } from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.render("/")); // 404 방지

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// http 서버 생성
const server = http.createServer(app);
// ws 서버 생성(하나의 port에서 두 개의 protocol 사용)
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  // 브라우저와 연결된 socket
  sockets.push(socket);
  socket["nickname"] = "익명";
  console.log("Connected to Browser");

  socket.on("close", () => console.log("Disconnected from Server"));

  socket.on("message", (message) => {
    const msg = JSON.parse(message);
    switch (msg.type) {
      case "content":
        sockets.forEach((item) => {
          item.send(`${socket.nickname}의 메시지: ${msg.payload}`);
        });
        break;
      case "nickname":
        socket["nickname"] = msg.payload;
        break;
      default:
        break;
    }
  });
});

server.listen(3000, handleListen);
