const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

const getCameras = async () => {
  console.log("카메라 목록을 가져옴");
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

const getMedia = async (deviceId) => {
  console.log("카메라를 가져옴");
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

getMedia();

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
