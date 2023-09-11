const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

const welcome = document.getElementById("welcome");
const call = document.getElementById("call");

call.hidden = true;  // 입장 전까지 hidden

let myStream;  // 유저의 미디어 스트림
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;  // WebRTC 피어 커넥션

// 카메라 목록을 가져오는 함수
const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];

    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;

      if (currentCamera.label == camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (err) {
    console.log(err);
  }
};

// 미디어 스트림을 가져오는 함수(변경시 deviceId 미디어 스트림을 설정)
const getMedia = async (deviceId) => {
  const initialConstraints = {
    audio: false,
    video: { facingMode: "user" },
  };
  const cameraConstraints = {
    audio: false,
    video: { deviceId: { exact: deviceId } },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstraints
    );

    myFace.srcObject = myStream;

    if (!deviceId) {
      await getCameras();
    }
  } catch (err) {
    console.log(err);
  }
};

const handleMuteClick = () => {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));

  if (!muted) {
    muteBtn.innerText = "음소거 해제(Unmute)";
    muted = true;
  } else {
    muteBtn.innerText = "음소거(Mute)";
    muted = false;
  }
};

const handleCameraClick = () => {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));

  if (cameraOff) {
    cameraBtn.innerText = "카메라 끄기(Turn Camera Off)";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "카메라 켜기(Turn Camera On)";
    cameraOff = true;
  }
};

const handleCameraChange = async () => {
  console.log("카메라 변경");
  await getMedia(camerasSelect.value);
};

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);

welcomeForm = welcome.querySelector("form");

// 방 입장 시 실행되는 함수
const initCall = async () => {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();  // 나의 미디어 스트림을 설정
  makeConnection();  // STUN 서버와 연결
}

// 방 입장 폼 제출 시 실행 함수
const handleWelcomeSubmit = async (e) => {
  e.preventDefault();

  const input = welcomeForm.querySelector("input");
  await initCall();
  socket.emit("join_room", input.value);  // 방 입장 및 해당 방의 다른 유저들에게 welcome 이벤트 실행
  roomName = input.value;
  input.value= "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// 현재 방에 다른 유저가 들어왔을때 실행됨
socket.on("welcome", async () => {
  console.log("다른 유저가 들어옴")
  // WebRTC 피어 간의 통신을 설정하고 제어하는데 사용되는 SDF 형식의 메시지(미디어 스트림 및 연결에 대한 정보를 포함)을 생성 및 설정
  const offer = await myPeerConnection.createOffer();
  console.log("나의 offer 생성", offer)
  myPeerConnection.setLocalDescription(offer);  // 로컬 미디어 스트림을 설정
  // 내 offer를 나를 제외한 방 유저에게 제공
  socket.emit("offer", offer, roomName);
})

// 다른 유저가 들어와서 내 offer를 다른 유저에게 제공한 후, 다른 사람의 offer를 받으면서 실행
socket.on("offer", async (offer) => {
  console.log("받은 offer", offer)
  // 원격 미디어 스트림(다른 유저의 offer)을 설정
  myPeerConnection.setRemoteDescription(offer);
  // 받은 offer를 기반으로 생성한 answer를 로컬 설명에 설정 후 answer을 전송
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
})

// 다른 유저가 다른 유저의 offer를 받아 생성한 answer을 내 로컬에 설정
socket.on("answer", (answer) => {
  console.log("받은 answer", answer)
  // 로컬 미디어 스트림에 대한 SDP 정보를 설정하는 메서드
  myPeerConnection.setLocalDescription(answer);
})

socket.on("ice", (ice) => {
  console.log("받은 ice", ice);
  // ICE(Interactive Connectivity Establishment, P2P 연결을 설정하고 관리) 후보를 추가
  myPeerConnection.addIceCandidate(ice);
});

const makeConnection = () => {
  // 공용 주소를 사용하기 위해 STUN 서버를 사용(구글 무료 지원, 프로덕션의 경우 STUN 서버를 따로 생성해야함)
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ]
      }
    ] 
  });

  // ICE 프로토콜을 통해 P2P 연결을 설정하고 관리할 때 발생하는 이벤트
  myPeerConnection.addEventListener("icecandidate", handleIce);
  // 상대방의 미디어 스트림을 수신할 때 발생하는 이벤트
  myPeerConnection.addEventListener("addstream", handleAddStream);
  console.log(myStream.getTracks().forEach(track => myPeerConnection.addTrack(track,myStream)));
}

// 후보 정보가 존재할 경우, 다른 유저에게 전달(받은 유저는 후보를 추가)
function handleIce(data) {
    console.log("send candidate", data.candidate);
    socket.emit("ice", data.candidate, roomName);
}

// 상대방의 미디어 스트림을 view
function handleAddStream(data) {
    console.log('상대방의 미디어 스트림을 보여줌')
    const peersStream = document.getElementById("peerFace");
    peersStream.srcObject = data.stream;
}