// 



const crypto = require('crypto');
const socket = require('socket.io-client')('http://localhost:3000');
const data = require('../common/data.json');

const encryptionKey = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16); // 128-bit IV

function encryptMessage(message) {
    const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
    const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return { encrypted, authTag };
}

setInterval(() => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const message = JSON.stringify(data[randomIndex]);
    const { encrypted, authTag } = encryptMessage(message);
    const messageToSend = { encrypted: encrypted.toString('hex'), authTag: authTag.toString('hex') };
    socket.emit('data_stream', messageToSend);
}, 10000); // Send every 10 seconds
