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
