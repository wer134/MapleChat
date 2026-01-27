import React, { useState } from 'react';
import './App.css';
import CharacterHeader from './components/CharacterHeader';
import StatModal from './components/StatModal';
import EquipmentModal from './components/EquipmentModal';
import EquipmentTooltip from './components/EquipmentTooltip';

function App() {
  const [characterName, setCharacterName] = useState('');
  const [characterInfo, setCharacterInfo] = useState(null);
  const [equipmentInfo, setEquipmentInfo] = useState(null);
  const [abilityInfo, setAbilityInfo] = useState(null);
  const [propensityInfo, setPropensityInfo] = useState(null);
  const [statInfo, setStatInfo] = useState(null);
  const [hyperStatInfo, setHyperStatInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState({
    equipment: null,
    position: null,
    pinned: false,
  });
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [abilityError, setAbilityError] = useState(false);
  const [hyperStatError, setHyperStatError] = useState(false);
  const [propensityError, setPropensityError] = useState(false);
  const [statError, setStatError] = useState(false);

  const handleSearch = async () => {
    if (!characterName.trim()) {
      setError('Please enter a character name');
      return;
    }
  
    setLoading(true);
    setError(null);
    setCharacterInfo(null);
    setEquipmentInfo(null);
    setAbilityInfo(null);
    setPropensityInfo(null);
    setStatInfo(null);
    setHyperStatInfo(null);
    setActiveTooltip({ equipment: null, position: null, pinned: false });
    setIsStatModalOpen(false);
    setIsEquipmentModalOpen(false);
    setAbilityError(false);
    setHyperStatError(false);
    setPropensityError(false);
    setStatError(false);

  try {
    // 캐릭터 이름으로 바로 기본 정보 조회
    const basicResponse = await fetch(`/character/basic?name=${encodeURIComponent(characterName)}`);
    if (!basicResponse.ok) {
      throw new Error('Character not found');
    }
    const basicData = await basicResponse.json();
    setCharacterInfo(basicData);

    // 장비 정보도 함께 가져오기
    const equipmentResponse = await fetch(`/character/equipment?name=${encodeURIComponent(characterName)}`);
    if (equipmentResponse.ok) {
      const equipmentData = await equipmentResponse.json();
      setEquipmentInfo(equipmentData);
    }

    // 어빌리티 정보 조회
    const abilityResponse = await fetch(`/character/ability?name=${encodeURIComponent(characterName)}`);
    if (abilityResponse.ok) {
      setAbilityInfo(await abilityResponse.json());
    } else {
      setAbilityError(true);
      console.error('Ability fetch failed:', abilityResponse.status);
    }

    // 성향 정보 조회
    const propensityResponse = await fetch(`/character/propensity?name=${encodeURIComponent(characterName)}`);
    if (propensityResponse.ok) {
      const data = await propensityResponse.json();
      console.log('Propensity Data:', data);
      setPropensityInfo(data);
    } else {
      setPropensityError(true);
      console.error('Propensity fetch failed:', propensityResponse.status);
    }

    // 스탯 정보 조회
    const statResponse = await fetch(`/character/stat?name=${encodeURIComponent(characterName)}`);
    if (statResponse.ok) {
      setStatInfo(await statResponse.json());
    } else {
      setStatError(true);
      console.error('Stat fetch failed:', statResponse.status);
    }

    // 하이퍼 스탯 정보 조회
    const hyperStatResponse = await fetch(`/character/hyper-stat?name=${encodeURIComponent(characterName)}`);
    if (hyperStatResponse.ok) {
      setHyperStatInfo(await hyperStatResponse.json());
    } else {
      setHyperStatError(true);
      console.error('HyperStat fetch failed:', hyperStatResponse.status);
    }
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

  const retryStat = async () => {
    if (!characterInfo) return;
    setStatError(false);
    try {
      const response = await fetch(`/character/stat?name=${encodeURIComponent(characterInfo.character_name)}`);
      if (response.ok) {
        setStatInfo(await response.json());
      } else {
        setStatError(true);
      }
    } catch (error) {
      setStatError(true);
    }
  };

  const retryHyperStat = async () => {
    if (!characterInfo) return;
    setHyperStatError(false);
    try {
      const response = await fetch(`/character/hyper-stat?name=${encodeURIComponent(characterInfo.character_name)}`);
      if (response.ok) {
        setHyperStatInfo(await response.json());
      } else {
        setHyperStatError(true);
      }
    } catch (error) {
      setHyperStatError(true);
    }
  };

  const retryAbility = async () => {
    if (!characterInfo) return;
    setAbilityError(false);
    try {
      const response = await fetch(`/character/ability?name=${encodeURIComponent(characterInfo.character_name)}`);
      if (response.ok) {
        setAbilityInfo(await response.json());
      } else {
        setAbilityError(true);
      }
    } catch (error) {
      setAbilityError(true);
    }
  };

  const retryPropensity = async () => {
    if (!characterInfo) return;
    setPropensityError(false);
    try {
      const response = await fetch(`/character/propensity?name=${encodeURIComponent(characterInfo.character_name)}`);
      if (response.ok) {
        setPropensityInfo(await response.json());
      } else {
        setPropensityError(true);
      }
    } catch (error) {
      setPropensityError(true);
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
              <CharacterHeader 
                characterInfo={characterInfo} 
                onOpenStat={() => setIsStatModalOpen(true)}
                onOpenEquipment={() => setIsEquipmentModalOpen(true)}
              />

              <StatModal 
                isOpen={isStatModalOpen}
                onClose={() => setIsStatModalOpen(false)}
                statInfo={statInfo}
                statError={statError}
                retryStat={retryStat}
                hyperStatInfo={hyperStatInfo}
                hyperStatError={hyperStatError}
                retryHyperStat={retryHyperStat}
                abilityInfo={abilityInfo}
                abilityError={abilityError}
                retryAbility={retryAbility}
                propensityInfo={propensityInfo}
                propensityError={propensityError}
                retryPropensity={retryPropensity}
              />

              <EquipmentModal
                isOpen={isEquipmentModalOpen}
                onClose={() => setIsEquipmentModalOpen(false)}
                equipmentInfo={equipmentInfo}
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
              />

              {/* 장비 툴팁 */}
              {activeTooltip.equipment && (
                <EquipmentTooltip 
                  equipment={activeTooltip.equipment} 
                  position={activeTooltip.position}
                  isPinned={activeTooltip.pinned}
                  onClose={() => setActiveTooltip({ equipment: null, pinned: false, position: null })}
                  characterClass={characterInfo?.character_class}
                />
              )}
            </div>
          )}
        </div>
      </div>

  );
}

export default App;