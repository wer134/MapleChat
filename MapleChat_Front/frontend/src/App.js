import React, { useState } from 'react';
import './App.css';


import 노바 from './worldicon/노바.png';
import 레드 from './worldicon/레드.png';
import 루나 from './worldicon/루나.png';
import 베라 from './worldicon/베라.png';
import 스카니아 from './worldicon/스카니아.png';
import 아케인 from './worldicon/아케인.png';
import 에오스 from './worldicon/에오스.png';
import 엘리시움 from './worldicon/엘리시움.png';
import 오로라 from './worldicon/오로라.png';
import 유니온 from './worldicon/유니온.png';
import 이노시스 from './worldicon/이노시스.png';
import 제니스 from './worldicon/제니스.png';
import 챌린저스 from './worldicon/챌린저스.png';
import 크로아 from './worldicon/크로아.png';
import 핼리오스 from './worldicon/핼리오스.png';

function App() {
  const [characterName, setCharacterName] = useState('');
  const [characterInfo, setCharacterInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getWorldIcon = (worldName) => {
    const worldIconMap = {
      '노바': 노바,
      '레드': 레드,
      '루나': 루나,
      '베라': 베라,
      '스카니아': 스카니아,
      '아케인': 아케인,
      '에오스': 에오스,
      '엘리시움': 엘리시움,
      '오로라': 오로라,
      '유니온': 유니온,
      '이노시스': 이노시스,
      '제니스': 제니스,
      '챌린저스': 챌린저스,
      '크로아': 크로아,
      '핼리오스': 핼리오스
    };
    
    return worldIconMap[worldName] || null;
  };
  const handleSearch = async () => {
    if (!characterName.trim()) {
      setError('Please enter a character name');
      return;
    }
  
    setLoading(true);
    setError(null);
    setCharacterInfo(null);

  try {
    // 캐릭터 이름으로 바로 기본 정보 조회
    const basicResponse = await fetch(`/character/basic?name=${encodeURIComponent(characterName)}`);
    if (!basicResponse.ok) {
      throw new Error('Character not found');
    }
    const basicData = await basicResponse.json();

    setCharacterInfo(basicData);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
};

  return (
    <div className="App">
      <div className="container">
        <h1>MapleStory Character information</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter character name"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          {characterInfo && (
            <div className="character-info">
              <div className="character-image">
                <div className="image-placeholder">
                  캐릭터 이미지
                </div>
              </div>
              <div className="character-details">
                <div className="character-name">
                    {characterInfo.character_name}
                </div>
                <div className="character-basic">
                  <span className="world-name">
                    {getWorldIcon(characterInfo.world_name)&&(
                      <img
                      src={getWorldIcon(characterInfo.world_name)}
                      alt={characterInfo.world_name}
                      className="world-icon"
                      />
                    )}
                    {characterInfo.world_name}
                  </span>
                  <span>LV.{characterInfo.character_level}</span>
                  <span>{characterInfo.character_class}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

  );
}

export default App;