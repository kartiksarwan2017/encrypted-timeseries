const io = require('socket.io')();
const crypto = require('crypto');
const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/encrypted-timeseries-db';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const DataSchema = new mongoose.Schema({
    name: String,
    origin: String,
    destination: String,
    secret_key: String,
    timestamp: Date
});

const DataModel = mongoose.model('Data', DataSchema);

io.on('connection', (socket) => {
    console.log('Emitter connected:', socket.id);

    socket.on('data_stream', (messageStream) => {
        const { encrypted, authTag } = messageStream;
        const decipher = crypto.createDecipheriv('aes-256-gcm', 'YourEncryptionPassKey', iv);
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);

        const messages = decrypted.toString().split('|');

        messages.forEach((encryptedMessage) => {
            try {
                const message = JSON.parse(encryptedMessage);
                const computedKey = crypto.createHash('sha256').update(message.name + message.origin + message.destination).digest('hex');

                if (computedKey === message.secret_key) {
                    const data = new DataModel({
                        ...message,
                        timestamp: new Date()
                    });
                    data.save();
                }
            } catch (error) {
                console.error('Error processing message:', error.message);
            }
        });
    });
});

io.listen(3000);
