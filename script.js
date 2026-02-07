// script.js
let myStream;
let peer;
const videoGrid = document.getElementById('video-grid');

// ৩ সেকেন্ড পর ইন্ট্রো স্ক্রিন হাইড হবে
setTimeout(() => {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('login-container').classList.remove('hidden');
}, 3000);

async function startSession() {
    const roomId = document.getElementById('room-id').value;
    const roomPass = document.getElementById('room-pass').value;
    const userName = document.getElementById('user-name').value;
    
    if(!roomId || !roomPass || !userName) return alert("Please fill all fields!");

    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('classroom').classList.remove('hidden');
    document.getElementById('display-room').innerText = roomId;

    try {
        myStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        document.getElementById('local-video').srcObject = myStream;

        // Secure Room ID Creation
        const finalKey = roomId.trim().toLowerCase() + "-" + roomPass.trim();
        peer = new Peer(finalKey); 

        peer.on('call', call => {
            call.answer(myStream);
            const video = document.createElement('video');
            call.on('stream', userStream => {
                video.srcObject = userStream;
                video.play();
                videoGrid.append(video);
            });
        });
    } catch (err) {
        alert("Camera access denied or error: " + err);
    }
}
