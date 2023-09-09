import express from "express";
import http from "http";
//import { WebSocket } from "ws";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.render("/")); // 404 방지

/*

@WebSocket

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
      */

const server = http.createServer(app);
const wsServer = new Server(server);

wsServer.on("connection", (socket) => {
  console.log("Connected to Browser");
  socket["nickName"] = "익명유저";
  // 이벤트 발생 시 항상 실행
  socket.onAny((e) => {
    console.log(`Socket Event: ${e}`);
  });

  // roomName 채팅방 입장
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done(roomName); // 클라이언트에서 argument로 보낸 함수를 '클라이언트'에서 실행시킴
    socket.to(roomName).emit("welcome", socket.nickName); // 해당 room의 전체 유저에게 메시지를 보냄
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickName)
    );
  });

  socket.on("new_message", (roomName, msg, done) => {
    socket.to(roomName).emit("new_message", `${socket.nickName}: ${msg}`);
    done();
  });

  socket.on("nickName", (nickName) => {
    socket["nickName"] = nickName;
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);

server.listen(3000, handleListen);
