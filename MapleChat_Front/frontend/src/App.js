// 메인 앱: 캐릭터 검색·길드 검색·검색 결과·모달·유니온 지도
import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import CharacterHeader from './components/CharacterHeader';
import StatModal from './components/StatModal';
import EquipmentModal from './components/EquipmentModal';
import UnionMapViewer from './components/UnionMapViewer';
import EquipmentTooltip from './components/EquipmentTooltip';
import SearchBox from './components/SearchBox';
import GuildSearchBox from './components/GuildSearchBox';
import GuildInfoModal from './components/GuildInfoModal';
import { useSearchHistory } from './hooks/useSearchHistory';
import { useCharacterData } from './hooks/useCharacterData';
import { fetchGuildBasic } from './api/guildApi';

function App() {
  const { searchHistory, addToHistory, removeFromHistory } = useSearchHistory();
  const [guildInfo, setGuildInfo] = useState(null);
  const [guildError, setGuildError] = useState(false);
  const [guildLoading, setGuildLoading] = useState(false);
  const [isGuildModalOpen, setIsGuildModalOpen] = useState(false);
  const [lastGuildSearch, setLastGuildSearch] = useState({ guildName: '', worldName: '' });

  const handleGuildSearch = useCallback(async (guildName, worldName) => {
    setGuildLoading(true);
    setGuildError(false);
    setGuildInfo(null);
    try {
      const data = await fetchGuildBasic(guildName, worldName);
      setGuildInfo(data);
      setLastGuildSearch({ guildName, worldName });
      setIsGuildModalOpen(true);
    } catch {
      setGuildError(true);
      setLastGuildSearch({ guildName, worldName });
      setIsGuildModalOpen(true);
    } finally {
      setGuildLoading(false);
    }
  }, []);

  const handleGuildRetry = useCallback(() => {
    if (lastGuildSearch.guildName && lastGuildSearch.worldName) {
      handleGuildSearch(lastGuildSearch.guildName, lastGuildSearch.worldName);
    }
  }, [lastGuildSearch, handleGuildSearch]);

  const {
    characterName,
    setCharacterName,
    loading,
    error,
    characterInfo,
    activeTooltip,
    setActiveTooltip,
    isStatModalOpen,
    setIsStatModalOpen,
    isEquipmentModalOpen,
    setIsEquipmentModalOpen,
    isUnionViewerOpen,
    setIsUnionViewerOpen,
    equipmentInfo,
    equipmentError,
    androidInfo,
    abilityInfo,
    abilityError,
    propensityInfo,
    propensityError,
    statInfo,
    statError,
    hyperStatInfo,
    hyperStatError,
    handleSearch,
    goHome,
    isBlackWhite,
    toggleBlackWhite,
    retryStat,
    retryHyperStat,
    retryAbility,
    retryPropensity,
    retryEquipment,
  } = useCharacterData(addToHistory);

  useEffect(() => {
    const theme = isBlackWhite ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isBlackWhite]);

  return (
    <div className="App">
      <button type="button" className="app-theme-toggle" onClick={toggleBlackWhite} aria-label="테마 전환">
        <span className="app-theme-icon">{isBlackWhite ? '☀️' : '🌙'}</span>
        <span className="app-theme-text">{isBlackWhite ? '라이트 모드' : '다크 모드'}</span>
      </button>
      <button type="button" className="app-home-btn" onClick={goHome} title="홈">
        🏠
      </button>
      <div className="container">
        <h1>MapleStory Character information</h1>
        <SearchBox
          value={characterName}
          onChange={setCharacterName}
          onSearch={handleSearch}
          loading={loading}
          searchHistory={searchHistory}
          onRemoveHistoryItem={removeFromHistory}
        />

        {!characterInfo && (
          <GuildSearchBox onSearch={handleGuildSearch} loading={guildLoading} />
        )}

        {error && <div className="error">{error}</div>}

        {characterInfo && (
          <div className="character-info">
            <CharacterHeader
              characterInfo={characterInfo}
              onOpenStat={() => setIsStatModalOpen(true)}
              onOpenEquipment={() => setIsEquipmentModalOpen(true)}
              onOpenUnion={() => setIsUnionViewerOpen(true)}
              onOpenGuild={handleGuildSearch}
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

            {isUnionViewerOpen && (
              <UnionMapViewer
                characterName={characterInfo?.character_name}
                onClose={() => setIsUnionViewerOpen(false)}
                darkMode={isBlackWhite}
              />
            )}

            {activeTooltip.equipment && (
              <EquipmentTooltip
                equipment={activeTooltip.equipment}
                position={activeTooltip.position}
                isPinned={activeTooltip.pinned}
                onClose={() =>
                  setActiveTooltip({ equipment: null, pinned: false, position: null })
                }
                characterClass={characterInfo?.character_class}
              />
            )}
          </div>
        )}

        <GuildInfoModal
          isOpen={isGuildModalOpen}
          onClose={() => setIsGuildModalOpen(false)}
          guildInfo={guildInfo}
          guildError={guildError}
          onRetry={handleGuildRetry}
        />
      </div>
    </div>
  );
}

export default App;
