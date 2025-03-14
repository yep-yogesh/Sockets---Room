const socket = io();

const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const nameInput = document.getElementById('nameInput');
const roomCodeInput = document.getElementById('roomCodeInput');
const chatBox = document.getElementById('chatBox');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

let currentRoom = '';
let userName = '';

createRoomBtn.addEventListener('click', () => {
    userName = nameInput.value.trim();
    if (!userName) {
        alert('Please enter your name');
        return;
    }
    currentRoom = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
    alert(`Room created! Code: ${currentRoom}`);
    socket.emit('join-room', { room: currentRoom, name: userName });
    openChat();
});

joinRoomBtn.addEventListener('click', () => {
    userName = nameInput.value.trim();
    const roomCode = roomCodeInput.value.trim();

    if (!userName || !roomCode) {
        alert('Please enter your name and room code');
        return;
    }

    currentRoom = roomCode;
    socket.emit('join-room', { room: currentRoom, name: userName });
    openChat();
});

sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('message', message);
        messageInput.value = '';
    }
});

socket.on('message', (data) => {
    const msg = document.createElement('div');
    msg.textContent = `${data.name}: ${data.message}`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('user-joined', (name) => {
    const msg = document.createElement('div');
    msg.textContent = `${name} joined the room`;
    messages.appendChild(msg);
});

socket.on('user-left', (name) => {
    const msg = document.createElement('div');
    msg.textContent = `${name} left the room`;
    messages.appendChild(msg);
});

function openChat() {
    chatBox.style.display = 'block';
}
