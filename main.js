var myStream; //Caller Stream
var myStream2; //Anwser Stream

//Create Stream
function openStream() {
  const config = { audio: true, video: true };
  console.log({ navigator });
  return navigator.mediaDevices.getUserMedia(config);
}

//Play Stream
function playStream(idVideoTag, stream) {
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
}

var peer = new Peer({
  host: "0.peerjs.com",
  port: 443,
  path: "/",
  pingInterval: 5000,
});

//Send Id to browser
peer.on("open", function (id) {
  const node = document.createElement("span");
  const textnode = document.createTextNode("Your Id:" + id);
  node.appendChild(textnode);
  document.getElementById("my-peer").appendChild(node);
  console.log("My peer ID is: " + id);
});

var conn = peer.connect("dest-peer-id");

conn.on("open", function () {
  //Receive messages
  conn.on("data", function (data) {
    console.log("Received", data);
  });

  // Send messages
  conn.send("Hello!");
});

//Caller
const Call = (id) => {
  const inputValue = document.getElementById("remoteId").value;

  console.log(inputValue);
  openStream().then((stream) => {
    myStream = stream;
    playStream("localStream", stream);
    const call = peer.call(inputValue, stream);
    call.on("stream", (remoteStream) => {
      myStream2 = remoteStream;
      playStream("remoteStream", remoteStream);

      //Define VideoButton Caller
      video_button.video_onclick_caller = function () {
        myStream.getVideoTracks()[0].enabled =
          !myStream.getVideoTracks()[0].enabled;
      };
    });
  });
};

//Answer
peer.on("call", (call) => {
  openStream().then((stream) => {
    call.answer(stream);
    myStream = stream;
    playStream("localStream", stream);
    call.on("stream", (remoteStream) => {
      myStream2 = remoteStream;
      playStream("remoteStream", remoteStream);
    });
  });
  //Define VideoButton Answer
  video_button.video_onclick_answer = function () {
    myStream.getVideoTracks()[0].enabled =
      !myStream.getVideoTracks()[0].enabled;
  };
});

//Setup VideoButton
var video_button = document.createElement("video_button");
video_button.appendChild(document.createTextNode("Toggle hold"));

//Setup AudioButton
var audio_button = document.createElement("audio_button");
video_button.appendChild(document.createTextNode("Toggle hold"));

//Function Click Audio
audio_button.audio_onclick = function () {
  // myStream.getAudioTracks()[0].muted = !myStream.getAudioTracks()[0].muted;
  //console.log(myStream.getAudioTracks()[0]);

  myStream.getAudioTracks()[0].enabled = !myStream.getAudioTracks()[0].enabled;
  myStream2.getAudioTracks()[0].enabled =
    !myStream2.getAudioTracks()[0].enabled;
  console.log(myStream.getAudioTracks()[0]);
  console.log(myStream2.getAudioTracks()[0]);
};
