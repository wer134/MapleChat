// Java 서버 REST API 클라이언트 (향후 사용)
class JavaBackendAPI {
    constructor() {
        this.baseUrl = CONFIG.BACKEND_URL;
        this.token = localStorage.getItem('auth_token');
    }
    
    // 인증 토큰 설정
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }
    
    // 공통 요청 헤더
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }
    
    // 로그인 (향후 구현)
    async login(characterName) {
        try {
            const response = await fetch(CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.LOGIN), {
                method: 'POST',
                headers: this.getHeaders(false),
                body: JSON.stringify({
                    character_name: characterName
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || '로그인 실패');
            }
            
            const data = await response.json();
            this.setToken(data.token);
            
            return data;
        } catch (error) {
            console.error('로그인 오류:', error);
            throw error;
        }
    }
    
    // 메시지 히스토리 조회 (향후 구현)
    async getHistory(guildName, limit = 50, cursor = null) {
        try {
            let url = `${CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.HISTORY)}?guild_name=${encodeURIComponent(guildName)}&limit=${limit}`;
            if (cursor) {
                url += `&cursor=${encodeURIComponent(cursor)}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error('히스토리 조회 실패');
            }
            
            return await response.json();
        } catch (error) {
            console.error('히스토리 조회 오류:', error);
            throw error;
        }
    }
    
    // Nexon API 중계 - 캐릭터 정보 조회 (향후 구현)
    async getCharacterInfo(characterName) {
        try {
            const response = await fetch(
                `${CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.NEXON_CHARACTER)}/${encodeURIComponent(characterName)}`,
                {
                    method: 'GET',
                    headers: this.getHeaders()
                }
            );
            
            if (!response.ok) {
                throw new Error('캐릭터 정보 조회 실패');
            }
            
            return await response.json();
        } catch (error) {
            console.error('캐릭터 정보 조회 오류:', error);
            throw error;
        }
    }
    
    // 메시지 저장 (선택사항 - WebSocket으로도 가능)
    async saveMessage(messageData) {
        try {
            const response = await fetch(CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.MESSAGE), {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(messageData)
            });
            
            if (!response.ok) {
                throw new Error('메시지 저장 실패');
            }
            
            return await response.json();
        } catch (error) {
            console.error('메시지 저장 오류:', error);
            throw error;
        }
    }
}

// 전역 API 인스턴스 생성
const api = new JavaBackendAPI();
