const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create HTTP server for serving static files
const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Page not found
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf8');
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Chat history file path
const CHAT_HISTORY_FILE = path.join(__dirname, 'chat-history.json');

// Initialize chat history
let chatHistory = [
  {"username":"Alice","message":"Hello!","timestamp":"2024-06-21T12:00:00.000Z"},
  {"username":"Bob","message":"Hi!","timestamp":"2024-06-21T12:01:00.000Z"}
];
if (fs.existsSync(CHAT_HISTORY_FILE)) {
    chatHistory = JSON.parse(fs.readFileSync(CHAT_HISTORY_FILE, 'utf8'));
}

// Connected users
const users = new Set();

// Broadcast to all clients
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Save chat history to file
function saveChatHistory() {
    fs.writeFileSync(CHAT_HISTORY_FILE, JSON.stringify(chatHistory, null, 2));
}

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    // Send current user list and chat history to new client
    ws.send(JSON.stringify({
        type: 'userList',
        users: Array.from(users)
    }));
    
    ws.send(JSON.stringify({
        type: 'chatHistory',
        history: chatHistory
    }));
    
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        switch (data.type) {
            case 'setUsername':
                if (!users.has(data.username)) {
                    users.add(data.username);
                    broadcast({
                        type: 'userList',
                        users: Array.from(users)
                    });
                }
                break;
                
            case 'message':
                // Add message to history
                chatHistory.push({
                    username: data.username,
                    message: data.message,
                    timestamp: data.timestamp
                });
                
                // Keep only the last 100 messages
                if (chatHistory.length > 100) {
                    chatHistory = chatHistory.slice(chatHistory.length - 100);
                }
                
                saveChatHistory();
                
                // Broadcast message to all clients
                broadcast({
                    type: 'message',
                    username: data.username,
                    message: data.message,
                    timestamp: data.timestamp
                });
                break;
                
            case 'clearHistory':
                chatHistory = [];
                saveChatHistory();
                broadcast({
                    type: 'historyCleared'
                });
                break;
        }
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});