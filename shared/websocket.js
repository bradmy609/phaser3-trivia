class WebSocketClient {
    constructor() {
        this.url = 'ws://localhost:3000';
        this.isConnecting = true;
        this.socket = new WebSocket(this.url);
        this.clientID = null;

        this.socket.addEventListener('open', () => {
            this.isConnecting = false;
            console.log('WebSocket connection established.');
        });

        this.socket.addEventListener('message', (event) => {
            console.log('Received message:', event.data);
            const data = JSON.parse(event.data); // Parse the JSON data
            if (data.clientID) {
                this.setClientID(data.clientID)
            }
            // Handle received messages from the server
        });

        this.socket.addEventListener('close', (event) => {
            console.log('WebSocket connection closed:', event);
            if (!this.isConnecting) {
                console.log('Connection lost, attempting to re-establish in 2 seconds...');
                setTimeout(() => this.connectWebSocket(), 2000);
            }
        });

        this.socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    connectWebSocket() {
        this.socket = new WebSocket(this.url);

        this.socket.addEventListener('open', () => {
            this.isConnecting = false;
            console.log('WebSocket connection re-established.');
        });
    }

    setClientID(clientID) {
        this.clientID = clientID;
    }

    send(data) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }
}

const socket = new WebSocketClient();

export default socket;
