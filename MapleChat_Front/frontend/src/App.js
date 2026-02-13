// 메인 앱: 캐릭터 검색·검색 결과·모달·유니온 지도
import React from 'react';
import './App.css';
import CharacterHeader from './components/CharacterHeader';
import StatModal from './components/StatModal';
import EquipmentModal from './components/EquipmentModal';
import UnionMapViewer from './components/UnionMapViewer';
import EquipmentTooltip from './components/EquipmentTooltip';
import SearchBox from './components/SearchBox';
import { useSearchHistory } from './hooks/useSearchHistory';
import { useCharacterData } from './hooks/useCharacterData';

function App() {
  const { searchHistory, addToHistory, removeFromHistory } = useSearchHistory();
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
    retryStat,
    retryHyperStat,
    retryAbility,
    retryPropensity,
    retryEquipment,
  } = useCharacterData(addToHistory);

  return (
    <div className="App">
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

        {error && <div className="error">{error}</div>}

        {characterInfo && (
          <div className="character-info">
            <CharacterHeader
              characterInfo={characterInfo}
              onOpenStat={() => setIsStatModalOpen(true)}
              onOpenEquipment={() => setIsEquipmentModalOpen(true)}
              onOpenUnion={() => setIsUnionViewerOpen(true)}
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
      </div>
    </div>
  );
}

export default App;
