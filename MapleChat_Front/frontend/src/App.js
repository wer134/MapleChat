/**
 * 메인 앱: 캐릭터 검색·검색 기록·검색 결과(헤더+스탯/장비 모달)·장비 툴팁.
 */
import React, { useState } from 'react';
import './App.css';
import CharacterHeader from './components/CharacterHeader';
import StatModal from './components/StatModal';
import EquipmentModal from './components/EquipmentModal';
import EquipmentTooltip from './components/EquipmentTooltip';

/** 검색 기록 localStorage 키. 최근 검색한 캐릭터명 목록 저장 */
const SEARCH_HISTORY_KEY = 'maplechat_search_history';
const MAX_SEARCH_HISTORY = 10;

/** 앱 로드 시 저장된 검색 기록 불러오기 */
function loadSearchHistory() {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function App() {
  const [characterName, setCharacterName] = useState('');
  const [searchHistory, setSearchHistory] = useState(loadSearchHistory);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
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
  const [equipmentError, setEquipmentError] = useState(false);
  const [androidInfo, setAndroidInfo] = useState(null);

  const handleSearch = async (nameOverride) => {
    const searchName = (nameOverride ?? characterName).trim();
    if (!searchName) {
      setError('Please enter a character name');
      return;
    }

    setShowSearchHistory(false);
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
    setEquipmentError(false);
    setAndroidInfo(null);

  try {
    // 기본 정보 → 상단 캐릭터 헤더(이름, 레벨, 직업, 월드, 아바타) 표시용
    const basicResponse = await fetch(`/character/basic?name=${encodeURIComponent(searchName)}`);
    if (!basicResponse.ok) {
      throw new Error('Character not found');
    }
    const basicData = await basicResponse.json();
    setCharacterInfo(basicData);

    // 검색 성공 시만 검색창 드롭다운용 최근 검색 목록에 추가
    setSearchHistory((prev) => {
      const next = [searchName, ...prev.filter((n) => n !== searchName)].slice(0, MAX_SEARCH_HISTORY);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
      return next;
    });

    // 장비 목록 모달에 표시할 아이템 장비 데이터
    const equipmentResponse = await fetch(`/character/equipment?name=${encodeURIComponent(searchName)}`);
    if (equipmentResponse.ok) {
      const equipmentData = await equipmentResponse.json();
      setEquipmentInfo(equipmentData);
      setEquipmentError(false);
    } else {
      setEquipmentError(true);
      console.error('Equipment fetch failed:', equipmentResponse.status);
    }

    // 장비 목록 모달의 '안드로이드' 슬롯 표시용 (일반 장비 API에 없을 때 사용)
    const androidResponse = await fetch(`/character/android-equipment?name=${encodeURIComponent(searchName)}`);
    if (androidResponse.ok) {
      setAndroidInfo(await androidResponse.json());
    } else {
      setAndroidInfo(null);
    }

    // 스탯 모달의 어빌리티 탭 표시용
    const abilityResponse = await fetch(`/character/ability?name=${encodeURIComponent(searchName)}`);
    if (abilityResponse.ok) {
      setAbilityInfo(await abilityResponse.json());
    } else {
      setAbilityError(true);
      console.error('Ability fetch failed:', abilityResponse.status);
    }

    // 스탯 모달의 성향 탭 표시용
    const propensityResponse = await fetch(`/character/propensity?name=${encodeURIComponent(searchName)}`);
    if (propensityResponse.ok) {
      const data = await propensityResponse.json();
      console.log('Propensity Data:', data);
      setPropensityInfo(data);
    } else {
      setPropensityError(true);
      console.error('Propensity fetch failed:', propensityResponse.status);
    }

    // 스탯 모달의 스탯 탭 표시용
    const statResponse = await fetch(`/character/stat?name=${encodeURIComponent(searchName)}`);
    if (statResponse.ok) {
      setStatInfo(await statResponse.json());
    } else {
      setStatError(true);
      console.error('Stat fetch failed:', statResponse.status);
    }

    // 하이퍼 스탯 정보 조회
    const hyperStatResponse = await fetch(`/character/hyper-stat?name=${encodeURIComponent(searchName)}`);
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

  const removeSearchHistoryItem = (index) => {
    setSearchHistory((prev) => {
      const next = prev.filter((_, i) => i !== index);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const retryEquipment = async () => {
    if (!characterInfo) return;
    setEquipmentError(false);
    try {
      const response = await fetch(`/character/equipment?name=${encodeURIComponent(characterInfo.character_name)}`);
      if (response.ok) {
        const data = await response.json();
        setEquipmentInfo(data);
      } else {
        setEquipmentError(true);
      }
    } catch (error) {
      setEquipmentError(true);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>MapleStory Character information</h1>
        <div className="search-box">
          <div className="search-input-wrap">
            <input
              type="text"
              placeholder="Enter character name"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSearchHistory(true)}
              onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
            />
            {showSearchHistory && searchHistory.length > 0 && (
              <ul className="search-history">
                {searchHistory.map((name, i) => (
                  <li key={`${name}-${i}`} onMouseDown={(e) => e.preventDefault()}>
                    <span
                      className="search-history-text"
                      onClick={() => {
                        setCharacterName(name);
                        setShowSearchHistory(false);
                        handleSearch(name);
                      }}
                    >
                      {name}
                    </span>
                    <button
                      type="button"
                      className="search-history-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSearchHistoryItem(i);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      title="삭제"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={() => handleSearch()} disabled={loading}>
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
                equipmentError={equipmentError}
                retryEquipment={retryEquipment}
                androidInfo={androidInfo}
                characterImage={characterInfo?.character_image}
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
              />

              {/* 장비 슬롯 호버/클릭 시 뜨는 상세 툴팁 (이름, 옵션, 잠재 등) */}
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