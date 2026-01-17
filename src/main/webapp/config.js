// Java 서버 연동 설정
const CONFIG = {
    // 서버 URL (개발 환경)
    BACKEND_URL: window.location.origin || 'http://localhost:8080',
    
    // WebSocket 엔드포인트
    WS_ENDPOINT: '/chat',
    
    // REST API 엔드포인트 (향후 사용)
    API_ENDPOINTS: {
        LOGIN: '/api/auth/login',
        HISTORY: '/api/chat/history',
        MESSAGE: '/api/chat/message',
        NEXON_CHARACTER: '/api/nexon/character'
    },
    
    // WebSocket 재연결 설정
    RECONNECT: {
        MAX_ATTEMPTS: 5,
        INITIAL_DELAY: 1000,
        MAX_DELAY: 10000
    },
    
    // 메시지 설정
    MESSAGE: {
        MAX_LENGTH: 500,
        USERNAME_MAX_LENGTH: 20
    }
};

// WebSocket URL 생성 함수
CONFIG.getWebSocketUrl = function(token = null) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let url = `${protocol}//${window.location.host}${this.WS_ENDPOINT}`;
    
    // 토큰이 있으면 쿼리 파라미터로 추가 (향후 인증 사용 시)
    if (token) {
        url += `?token=${encodeURIComponent(token)}`;
    }
    
    return url;
};

// REST API URL 생성 함수
CONFIG.getApiUrl = function(endpoint) {
    return `${this.BACKEND_URL}${endpoint}`;
};
