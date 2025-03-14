const socket = io('http://localhost:5000');

let username = '';
let currentRoom = '';

function setName() {
  username = document.getElementById('nameInput').value.trim();
  if (username) {
    document.getElementById('nameSection').style.display = 'none';
    document.getElementById('mainSection').style.display = 'block';
  }
}

function createRoom() {
  if (username) {
    socket.emit('create-room', username);
  }
}

socket.on('room-created', (roomCode) => {
  currentRoom = roomCode;
  document.getElementById('roomCodeDisplay').innerText = `Room Code: ${roomCode}`;
  openChat();
});

function showJoinRoom() {
  document.getElementById('joinRoomSection').style.display = 'block';
}

function joinRoom() {
  const roomCode = document.getElementById('roomCodeInput').value.trim();
  if (roomCode) {
    socket.emit('join-room', { roomCode, name: username });
  }
}

socket.on('room-joined', (roomCode) => {
  currentRoom = roomCode;
  openChat();
});

socket.on('user-joined', (message) => {
  displayMessage(message);
});

socket.on('error', (message) => {
  alert(message);
});

function openChat() {
  document.getElementById('mainSection').style.display = 'none';
  document.getElementById('chatSection').style.display = 'block';
  document.getElementById('chatRoomCode').innerText = `Room Code: ${currentRoom}`;
}

function sendMessage() {
  const message = document.getElementById('messageInput').value.trim();
  if (message) {
    socket.emit('send-message', { roomCode: currentRoom, name: username, message });
    document.getElementById('messageInput').value = '';
  }
}

socket.on('receive-message', (message) => {
  displayMessage(message);
});

function displayMessage(message) {
  const messages = document.getElementById('messages');
  const msg = document.createElement('p');
  msg.innerText = message;
  messages.appendChild(msg);
}
