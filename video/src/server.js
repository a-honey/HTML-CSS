import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.render("/"));

const server = http.createServer(app);
const wsServer = new Server(server);

wsServer.on("connection", (socket) => {
    socket.onAny((e) => {
        console.log(`Socket Event: ${e}`);
      });

    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName) => {
        console.log(offer);
        socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName) => {
        console.log(answer);
        socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
        console.log(ice);
        socket.to(roomName).emit("ice", ice);
    });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);

server.listen(3000, handleListen);
