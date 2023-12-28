const socket = io('/')
const screenShareContainer = document.getElementById('screen-container')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true

const currentWindow = window

const peers = {}

const microphoneButton = document.getElementById('microphoneButton');
const cameraButton = document.getElementById('cameraButton');
const chatButton = document.getElementById('chatButton');
const exitButton = document.getElementById('exitButton');

var chatOpened = false

// chatButton.addEventListener('click', toggleChat)
exitButton.addEventListener('click',function (){
  exitChat()
})

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })

  microphoneButton.addEventListener('click',function (){
    toggleMicrophone(stream)
  })

  cameraButton.addEventListener('click',function (){
    toggleCamera(stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
    shareScreen()
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call

  microphoneButton.addEventListener('click',toggleMicrophone)
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

function toggleMicrophone(stream){
  const microphoneAccess = stream.getTracks().find(track => track.kind =='audio')
    if(microphoneAccess.enabled){
      microphoneAccess.enabled = false
      microphoneButton.innerHTML = '<i class="fa-solid fa-microphone-slash icon"></i>'
      microphoneButton.style.background = 'var(--color-01)'
      microphoneButton.style.transition = '0.2s ease-in-out'
    }
    else{
      microphoneAccess.enabled = true
      microphoneButton.innerHTML = '<i class="fa-solid fa-microphone icon"></i>'
      microphoneButton.style.background = 'var(--color-04)'
      microphoneButton.style.transition = '0.2s ease-in-out'


    }
}

function toggleCamera(stream){
  const cameraAccess = stream.getTracks().find(track => track.kind =='video')
    if(cameraAccess.enabled){
      cameraAccess.enabled = false
      cameraButton.innerHTML = '<i class="fa-solid fa-video-slash icon"></i>'
      cameraButton.style.background = 'var(--color-01)'
      cameraButton.style.transition = 'background 0.2s ease-in-out'
    }
    else{
      cameraAccess.enabled = true
      cameraButton.innerHTML = '<i class="fa-solid fa-video icon"></i>'
      cameraButton.style.background = 'var(--color-04)'
      cameraButton.style.transition = 'background 0.2s ease-in-out'

    }
}

// function toggleChat(){
//   const chatContainer = document.getElementById('chat-container')
//   if(chatOpened == false){
//     chatContainer.style.display = 'flex'
//     chatButton.style.background = 'var(--color-01)'
//     chatOpened = true
//   }
//   else{
//     chatContainer.style.display = 'none'
//     chatButton.style.background = 'var(--color-04)'
//     chatOpened = false
//   }
// }

function exitChat(){
  currentWindow.location = '/lobby'
}

