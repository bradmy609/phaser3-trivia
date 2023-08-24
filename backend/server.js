// backend/server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid'); // Import the uuid library

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = new Map(); // To store client WebSocket instances
const groupManagement = {}; // Declare the group management data structure

wss.on('connection', (ws) => {
    const clientID = uuidv4();; // Implement your unique ID generation logic
    console.log('WebSocket connection established.');
    clients.set(clientID, ws);
    ws.clientID = clientID;
    ws.send(JSON.stringify({ type: 'clientID', clientID })); // Send the client identifier to the client

    const dataToSend = { message: 'Hello from server!' };
    ws.send(JSON.stringify(dataToSend));

    ws.on('message', (message) => {
        const messageString = message.toString('utf8'); // Convert buffer to string
        const messageObject = JSON.parse(messageString);
        const senderClientID = clientID;
        console.log(`Message received from client: ${senderClientID}`, messageObject);
        // Handle received messages from the client
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed.');
    });
});

wss.on('connection', (ws) => {
    console.log('WebSocket connection established. Client ID:', clientID);

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.action === 'createGroup') {
            console.log('Creating group.... groupCode:', data.value, 'Client ID:', clientID);
            const groupCode = data.value;
            groupManagement[groupCode] = { participants: [ws] };
            // Notify the creator about successful group creation
            ws.send(JSON.stringify({ message: 'Group created successfully' }));
        } else if (data.action === 'joinGroup') {
            const groupCode = data.value;
            const group = groupManagement[groupCode];
            if (group) {
                group.participants.push(ws);
                console.log('Current group consists of:', group.participants.length);
                group.participants.forEach(ws => {
                    console.log(ws.clientID);
                })
                // Notify all participants about a new member joining
                group.participants.forEach(participant => {
                    participant.send(JSON.stringify({ message: 'New member joined' }));
                });
            } else {
                // Handle group not found
                ws.send(JSON.stringify({ message: 'Group not found' }));
            }
        }
    });
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000.');
});
