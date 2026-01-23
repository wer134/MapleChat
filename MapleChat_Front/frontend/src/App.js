import React, { useState } from 'react';
import './App.css';

function App() {
  const [characterName, setCharacterName] = useState('');
  const [characterInfo, setCharacterInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
                    {characterInfo.characterName}
                </div>
                <div className="character-basic">
                  <span>{characterInfo.worldName}</span>
                  <span>LV.{characterInfo.characterLevel}</span>
                  <span>{characterInfo.characterClass}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

  );
}

export default App;