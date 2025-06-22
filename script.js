document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatMessages = document.getElementById('messages');
    const userList = document.getElementById('users');
    const usernameInput = document.getElementById('username');
    const setUsernameBtn = document.getElementById('set-username');
    const clearHistoryBtn = document.getElementById('clear-history');
    const historyList = document.getElementById('history-list');
    
    let username = '';
    let socket;
    
    // Connect to WebSocket server
    function connectWebSocket() {
        socket = new WebSocket(`ws://${window.location.hostname}:8080`);
        
        socket.onopen = () => {
            console.log('Connected to WebSocket server');
            if (username) {
                socket.send(JSON.stringify({
                    type: 'setUsername',
                    username
                }));
            }
        };
        
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
                case 'message':
                    displayMessage(data);
                    break;
                case 'userList':
                    updateUserList(data.users);
                    break;
                case 'chatHistory':
                    displayChatHistory(data.history);
                    break;
                case 'historyCleared':
                    historyList.innerHTML = '<p>No chat history available</p>';
                    break;
            }
        };
        
        socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
            setTimeout(connectWebSocket, 5000); // Try to reconnect after 5 seconds
        };
    }
    
    // Set username
    setUsernameBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const newUsername = usernameInput.value.trim();
        
        if (newUsername) {
            username = newUsername;
            usernameInput.disabled = true;
            setUsernameBtn.disabled = true;
            
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: 'setUsername',
                    username
                }));
            }
        }
    });
    
    // Send message
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msgInput = document.getElementById('msg');
        const message = msgInput.value.trim();
        
        if (message && username && socket && socket.readyState === WebSocket.OPEN) {
            const msgData = {
                type: 'message',
                username,
                message,
                timestamp: new Date().toISOString()
            };
            
            socket.send(JSON.stringify(msgData));
            msgInput.value = '';
        }
    });
    
    // Clear chat history
    document.getElementById('clear-history').addEventListener('click', () => {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '<p>No chat history available</p>';
    });
    
    // Display message in chat
    function displayMessage(data) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        
        if (data.username === username) {
            messageDiv.classList.add('user-message');
        } else {
            messageDiv.classList.add('other-message');
        }
        
        const messageInfo = document.createElement('div');
        messageInfo.classList.add('message-info');
        messageInfo.innerHTML = `
            <span class="sender">${data.username}</span>
            <span class="time">${formatTime(data.timestamp)}</span>
        `;
        
        const messageText = document.createElement('div');
        messageText.textContent = data.message;
        
        messageDiv.appendChild(messageInfo);
        messageDiv.appendChild(messageText);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Update user list
    function updateUserList(users) {
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user;
            userList.appendChild(li);
        });
    }
    
    // Display chat history
    function displayChatHistory(history) {
        historyList.innerHTML = '';

        if (!Array.isArray(history) || history.length === 0) {
            historyList.innerHTML = '<p>No chat history available</p>';
            return;
        }

        history.forEach(item => {
            // Defensive: check for required fields
            if (!item.username || !item.message || !item.timestamp) return;

            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.innerHTML = `
                <p><strong>${escapeHTML(item.username)}</strong> (${formatTime(item.timestamp)}):</p>
                <p>${escapeHTML(item.message)}</p>
            `;
            historyItem.addEventListener('click', () => {
                // Optional: Load history message into chat input
                document.getElementById('msg').value = item.message;
            });
            historyList.appendChild(historyItem);
        });
    }
    
    // Format timestamp
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Helper to escape HTML (prevent XSS)
    function escapeHTML(str) {
        return String(str).replace(/[&<>"']/g, function(m) {
            return ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            })[m];
        });
    }
    
    // Initialize WebSocket connection
    connectWebSocket();
});
