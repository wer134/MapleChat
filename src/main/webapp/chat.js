class ChatClient {
    constructor() {
        this.ws = null;
        this.clientId = null;
        this.username = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = CONFIG.RECONNECT.MAX_ATTEMPTS;
        
        // Java 서버 연동 준비
        this.api = api; // api.js의 전역 인스턴스 사용
        
        this.initializeElements();
        this.initializeEventListeners();
        this.connect();
    }

    initializeElements() {
        this.messagesContainer = document.getElementById('messages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.usernameInput = document.getElementById('usernameInput');
        this.statusElement = document.getElementById('status');
        this.userListElement = document.getElementById('userList');
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.setUsername();
            }
        });
        this.usernameInput.addEventListener('blur', () => this.setUsername());
    }

    connect() {
        // Java 서버 WebSocket 연결
        // 현재: 토큰 없이 연결 (기본 채팅)
        // 향후: 인증 토큰 사용 시 아래 주석 해제
        // const token = this.api.token;
        const token = null; // 현재는 토큰 없이 연결
        const wsUrl = CONFIG.getWebSocketUrl(token);
        
        console.log('Java 서버 연결 시도:', wsUrl);
        
        try {
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('WebSocket 연결 성공');
                this.updateStatus('connected', '연결됨');
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                this.handleMessage(JSON.parse(event.data));
            };

            this.ws.onclose = () => {
                console.log('WebSocket 연결 종료');
                this.updateStatus('disconnected', '연결 끊김 - 재연결 시도 중...');
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket 오류:', error);
                this.updateStatus('disconnected', '연결 오류');
            };
        } catch (error) {
            console.error('연결 실패:', error);
            this.updateStatus('disconnected', '연결 실패');
            this.attemptReconnect();
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < CONFIG.RECONNECT.MAX_ATTEMPTS) {
            this.reconnectAttempts++;
            const delay = Math.min(
                CONFIG.RECONNECT.INITIAL_DELAY * Math.pow(2, this.reconnectAttempts),
                CONFIG.RECONNECT.MAX_DELAY
            );
            console.log(`${delay}ms 후 재연결 시도... (${this.reconnectAttempts}/${CONFIG.RECONNECT.MAX_ATTEMPTS})`);
            
            setTimeout(() => {
                this.connect();
            }, delay);
        } else {
            this.updateStatus('disconnected', '재연결 실패. 페이지를 새로고침하세요.');
        }
    }

    handleMessage(data) {
        switch (data.type) {
            case 'SYSTEM':
                if (data.clientId) {
                    this.clientId = data.clientId;
                }
                this.addSystemMessage(data.message);
                break;
            
            case 'CHAT':
                this.addChatMessage(data.message, data.username, data.clientId, data.timestamp);
                break;
            
            case 'USER_JOINED':
            case 'USER_LEFT':
            case 'USERNAME_CHANGED':
                this.addSystemMessage(data.message);
                if (data.onlineUsers) {
                    this.updateUserList(data.onlineUsers);
                }
                break;
        }
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return;
        }

        this.ws.send(JSON.stringify({
            type: 'chat',
            message: message
        }));

        this.messageInput.value = '';
    }

    setUsername() {
        const username = this.usernameInput.value.trim();
        if (!username || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return;
        }

        this.ws.send(JSON.stringify({
            type: 'set-username',
            username: username
        }));

        this.username = username;
    }

    addChatMessage(message, username, senderId, timestamp) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${senderId === this.clientId ? 'own' : 'other'}`;
        
        const time = timestamp ? new Date(timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        }) : new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageDiv.innerHTML = `
            <div class="message-header">${username} • ${time}</div>
            <div class="message-content">${this.escapeHtml(message)}</div>
        `;

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addSystemMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system';
        messageDiv.textContent = message;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    updateUserList(users) {
        this.userListElement.innerHTML = '';
        if (users && users.length > 0) {
            users.forEach(user => {
                const li = document.createElement('li');
                li.className = 'user-item';
                li.textContent = user.username;
                this.userListElement.appendChild(li);
            });
        }
    }

    updateStatus(status, message) {
        this.statusElement.className = `status ${status}`;
        this.statusElement.textContent = message;
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new ChatClient();
});