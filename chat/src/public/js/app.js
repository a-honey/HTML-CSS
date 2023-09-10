/*

@WebSocket

const MessageBox = document.querySelector("ul");
const MessageForm = document.querySelector("form");

const handleMessage = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};

// 서버와 연결 socket
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server");
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  MessageBox.append(li);
});

MessageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = MessageForm.querySelector("input");
  socket.send(handleMessage("content", input.value));
  input.value = "";
});
*/

const socket = io();

const welcome = document.getElementById("welcome");
const roomNameForm = welcome.querySelector("form");
const room = document.getElementById("room");
const nickName = document.getElementById("nickName");
const nickNameForm = nickName.querySelector("form");

// 첫 입장시 닉네임 입력창만 띄움
room.hidden = true;
welcome.hidden = true;

let roomName;

const handleMessageFrom = (msg) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
};

// roomName 채팅방 form 제출시 메시지 보내기 실행(argument: 채팅방 이름, 메시지내용, 나의 메시지 ul 추가 콜백)
const handleMessageSubmit = (e) => {
  e.preventDefault();

  const input = room.querySelector("input");
  const value = input.value; // 실행 시점 이전에 input.value가 초기화되기 때문에, 임시 보관
  socket.emit("new_message", roomName, input.value, () => {
    handleMessageFrom(`나: ${value}`);
    input.value = "";
  });
};

// roomName 입력 후 roomName 채팅방 입장
const handleSubmitDone = (name) => {
  welcome.hidden = true;
  room.hidden = false;
  roomName = name;
  const h3 = room.querySelector("h3");
  h3.innerText = `${roomName} 채팅방`;

  const form = room.querySelector("form");

  // roomName 채팅방 form 제출시 메시지 보내기 실행
  form.addEventListener("submit", handleMessageSubmit);
};

// 닉네임 입력 폼
nickNameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  nickName.hidden = true;
  welcome.hidden = false;

  const input = nickNameForm.querySelector("input");
  socket.emit("nickName", input.value);
});

// 채팅방 이름 입력 폼
roomNameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const input = roomNameForm.querySelector("input");
  socket.emit("enter_room", input.value, handleSubmitDone);
  input.value = "";
});

socket.on("welcome", (nickName) => {
  handleMessageFrom(`${nickName} 유저가 입장했습니다.`);
});

socket.on("bye", (nickName) => {
  handleMessageFrom(`${nickName} 유저가 퇴장했습니다.`);
});

// 메시지를 받으면 메시지 ul 추가 콜백 실행
socket.on("new_message", handleMessageFrom);
