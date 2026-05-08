// 메인 앱: 캐릭터 검색·길드 검색·검색 결과·모달·유니온 지도
import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import CharacterHeader from "./components/CharacterHeader";
import StatModal from "./components/StatModal";
import EquipmentModal from "./components/EquipmentModal";
import UnionMapViewer from "./components/UnionMapViewer";
import EquipmentTooltip from "./components/EquipmentTooltip";
import SearchBox from "./components/SearchBox";
import GuildSearchBox from "./components/GuildSearchBox";
import GuildInfoModal from "./components/GuildInfoModal";
import { equipmentCells } from "./constants/equipmentSlots";
import { useSearchHistory } from "./hooks/useSearchHistory";
import { useCharacterData } from "./hooks/useCharacterData";
import { fetchGuildBasic } from "./api/guildApi";
import { getWorldIcon } from "./utils/worldIcons";
import { formatStatValue } from "./utils/formatters";
import { getRarityColor } from "./utils/gameLogic";

const normalizeSlot = (s) =>
  (s || "")
    .replace(/[0-9]/g, "")
    .replace(/\s+/g, "")
    .replace(/[()_-]/g, "")
    .trim();

function App() {
  const { searchHistory, addToHistory, removeFromHistory } = useSearchHistory();
  const [guildInfo, setGuildInfo] = useState(null);
  const [guildError, setGuildError] = useState(false);
  const [guildLoading, setGuildLoading] = useState(false);
  const [isGuildModalOpen, setIsGuildModalOpen] = useState(false);
  const [lastGuildSearch, setLastGuildSearch] = useState({
    guildName: "",
    worldName: "",
  });
  const [activeInfoTab, setActiveInfoTab] = useState("장비");

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
    const theme = isBlackWhite ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isBlackWhite]);

  const guildName =
    characterInfo?.character_guild_name ??
    characterInfo?.guild_name ??
    characterInfo?.guildName ??
    "";
  const worldName = characterInfo?.world_name ?? characterInfo?.worldName ?? "";
  const worldIcon = worldName ? getWorldIcon(worldName) : null;
  const majorStats = statInfo?.final_stat
    ? [
        ...statInfo.final_stat.filter((s) => s.stat_name === "전투력"),
        ...statInfo.final_stat.filter((s) => s.stat_name !== "전투력"),
      ].slice(0, 4)
    : null;

  return (
    <div className="App">
      <button
        type="button"
        className="app-theme-toggle"
        onClick={toggleBlackWhite}
        aria-label="테마 전환"
      >
        <span className="app-theme-icon">{isBlackWhite ? "☀️" : "🌙"}</span>
        <span className="app-theme-text">
          {isBlackWhite ? "라이트 모드" : "다크 모드"}
        </span>
      </button>
      <button
        type="button"
        className="app-home-btn"
        onClick={goHome}
        title="홈"
      >
        🏠
      </button>
      <div className="dashboard">
        <aside className="dashboard-sidebar dashboard-sidebar--left">
          <div className="dashboard-panel dashboard-panel--fill">
            <div className="dashboard-panel__title">로그인</div>
            <div className="dashboard-panel__body">
              <SearchBox
                value={characterName}
                onChange={setCharacterName}
                onSearch={handleSearch}
                loading={loading}
                searchHistory={searchHistory}
                onRemoveHistoryItem={removeFromHistory}
              />
            </div>
          </div>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-mainTop">
            <div className="dashboard-mainTopLeft dashboard-panel">
              <div className="dashboard-panel__title">캐릭터</div>
              <div className="dashboard-mainTopLeft__content">
                <div className="dashboard-characterIcon">
                  {characterInfo?.character_image ? (
                    <img
                      src={characterInfo.character_image}
                      alt={characterInfo.character_name || "캐릭터 아이콘"}
                    />
                  ) : (
                    <div className="dashboard-placeholder">캐릭터 아이콘</div>
                  )}
                </div>
                <div className="dashboard-characterMeta">
                  {characterInfo ? (
                    <div className="dashboard-placeholder">
                      <div className="dashboard-characterMeta__row">
                        <span className="dashboard-characterName">
                          {characterInfo.character_name}
                        </span>
                        <span className="dashboard-characterLevel">
                          LV.{characterInfo.character_level}
                        </span>
                      </div>
                      {worldName && (
                        <div className="dashboard-characterMeta__row">
                          {worldIcon && (
                            <img
                              className="dashboard-worldIcon"
                              src={worldIcon}
                              alt={worldName}
                            />
                          )}
                          <span>{worldName}</span>
                          {characterInfo?.character_class ? (
                            <span className="dashboard-characterClass">
                              {characterInfo.character_class}
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="dashboard-placeholder">
                      레벨, 월드 아이콘, 닉네임
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="dashboard-mainTopRight dashboard-panel">
              <div className="dashboard-panel__title">요약</div>
              <div className="dashboard-mainTopRightInner">
                <div className="dashboard-majorStats dashboard-panel dashboard-panel--sub">
                  {majorStats ? (
                    <ul className="dashboard-majorStats__list">
                      {majorStats.map((stat) => (
                        <li
                          key={stat.stat_name}
                          className="dashboard-majorStats__item"
                        >
                          <span className="label">{stat.stat_name}</span>
                          <span className="value">
                            {formatStatValue(stat.stat_name, stat.stat_value)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "캐릭터 전투력, 스탯 공격력 등 주요 스탯"
                  )}
                </div>
                <div className="dashboard-symbols">
                  <div className="dashboard-panel dashboard-panel--sub dashboard-symbolCard">
                    아케인 심볼
                  </div>
                  <div className="dashboard-panel dashboard-panel--sub dashboard-symbolCard">
                    어센틱 심볼
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-mainBottom dashboard-panel dashboard-panel--fill">
            <div className="dashboard-panel__title">
              정보창 (장비, 유니온, 기타스탯 등등)
            </div>
            <div className="info-tab-bar">
              {["장비", "유니온", "기타스탯", "스킬"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`info-tab-bar__btn${activeInfoTab === tab ? " info-tab-bar__btn--active" : ""}`}
                  onClick={() => setActiveInfoTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="dashboard-panel__body dashboard-scroll">
              {!characterInfo && (
                <GuildSearchBox
                  onSearch={handleGuildSearch}
                  loading={guildLoading}
                />
              )}

              {error && <div className="error">{error}</div>}

              {characterInfo && (
                <>
                  <CharacterHeader
                    characterInfo={characterInfo}
                    onOpenStat={() => setIsStatModalOpen(true)}
                    onOpenEquipment={() => setIsEquipmentModalOpen(true)}
                    onOpenUnion={() => setIsUnionViewerOpen(true)}
                    onOpenGuild={handleGuildSearch}
                  />

                  {activeInfoTab === "장비" && (
                    <section className="dashboard-inlineSection">
                      <h2 className="dashboard-inlineSection__title">
                        장비 정보
                      </h2>
                      {equipmentInfo?.item_equipment &&
                      equipmentInfo.item_equipment.length > 0 ? (
                        <div className="equipment-grid">
                          {(equipmentCells ?? []).map((cell, idx) => {
                            const style = {
                              gridRow: `${cell.row} / span ${cell.rowSpan || 1}`,
                              gridColumn: `${cell.col} / span ${cell.colSpan || 1}`,
                            };

                            if (cell.type === "preview") {
                              return (
                                <div
                                  key={idx}
                                  className="equipment-cell preview"
                                  style={style}
                                >
                                  {characterInfo?.character_image ? (
                                    <img
                                      src={characterInfo.character_image}
                                      alt="캐릭터"
                                      className="equipment-preview-character"
                                    />
                                  ) : null}
                                </div>
                              );
                            }
                            if (cell.type === "mergedEmpty") {
                              return (
                                <div
                                  key={idx}
                                  className="equipment-cell bottom-merged"
                                  style={style}
                                />
                              );
                            }
                            if (cell.type === "empty") {
                              return (
                                <div
                                  key={idx}
                                  className="equipment-item empty"
                                  style={style}
                                />
                              );
                            }

                            const itemList = equipmentInfo.item_equipment ?? [];
                            const target = normalizeSlot(cell.slot);
                            const matchingEquipments = itemList
                              .filter(
                                (item) =>
                                  normalizeSlot(item.item_equipment_slot) ===
                                  target,
                              )
                              .sort((a, b) =>
                                (a.item_equipment_slot || "").localeCompare(
                                  b.item_equipment_slot || "",
                                  "ko",
                                ),
                              );

                            let equip = null;
                            if (
                              cell.slotIndex &&
                              matchingEquipments.length >= cell.slotIndex
                            ) {
                              equip = matchingEquipments[cell.slotIndex - 1];
                            } else {
                              equip = matchingEquipments[0] || null;
                            }

                            if (
                              !equip &&
                              cell.slot === "안드로이드" &&
                              androidInfo &&
                              typeof androidInfo === "object"
                            ) {
                              const icon =
                                androidInfo.android_icon ??
                                androidInfo.androidIcon;
                              const name =
                                androidInfo.android_name ??
                                androidInfo.androidName ??
                                androidInfo.android_nickname ??
                                androidInfo.androidNickname ??
                                "안드로이드";
                              if (icon || name) {
                                equip = {
                                  item_icon: icon || null,
                                  item_name: name,
                                };
                              }
                            }

                            const rarityColor = equip
                              ? getRarityColor(equip.potential_option_grade)
                              : null;
                            return (
                              <div
                                key={idx}
                                className={`equipment-item ${!equip ? "empty" : ""}`}
                                style={{
                                  ...style,
                                  ...(rarityColor
                                    ? { "--hover-color": rarityColor }
                                    : {}),
                                }}
                                onMouseEnter={(e) => {
                                  if (equip && !activeTooltip.pinned) {
                                    setActiveTooltip({
                                      equipment: equip,
                                      pinned: false,
                                      position: {
                                        x: e.clientX + 15,
                                        y: e.clientY + 15,
                                      },
                                    });
                                  }
                                }}
                                onMouseMove={(e) => {
                                  if (equip && !activeTooltip.pinned) {
                                    setActiveTooltip((prev) => ({
                                      ...prev,
                                      position: {
                                        x: e.clientX + 15,
                                        y: e.clientY + 15,
                                      },
                                    }));
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (!activeTooltip.pinned) {
                                    setActiveTooltip({
                                      equipment: null,
                                      pinned: false,
                                      position: null,
                                    });
                                  }
                                }}
                                onClick={(e) => {
                                  if (equip) {
                                    if (
                                      activeTooltip.pinned &&
                                      activeTooltip.equipment === equip
                                    ) {
                                      setActiveTooltip({
                                        equipment: null,
                                        pinned: false,
                                        position: null,
                                      });
                                    } else {
                                      setActiveTooltip({
                                        equipment: equip,
                                        pinned: true,
                                        position: {
                                          x: e.clientX + 15,
                                          y: e.clientY + 15,
                                        },
                                      });
                                    }
                                  }
                                }}
                              >
                                {equip ? (
                                  <>
                                    {equip.item_icon ? (
                                      <img
                                        src={equip.item_icon}
                                        alt={equip.item_name || cell.label}
                                      />
                                    ) : (
                                      <span className="equipment-slot-fallback">
                                        {equip.item_name || cell.label}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <span className="slot-label">
                                    {cell.label}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : equipmentError ? (
                        <div className="dashboard-inlineError">
                          장비 정보를 불러올 수 없습니다.
                          <button
                            type="button"
                            onClick={retryEquipment}
                            className="retry-btn"
                            title="재시도"
                          >
                            ↻
                          </button>
                        </div>
                      ) : (
                        <div className="dashboard-inlinePlaceholder">
                          장비 정보를 불러오는 중이거나 없습니다.
                        </div>
                      )}
                    </section>
                  )}

                  {activeInfoTab === "유니온" && (
                    <section
                      className="dashboard-inlineSection"
                      id="union-section"
                    >
                      <h2 className="dashboard-inlineSection__title">
                        유니온 정보
                      </h2>
                      <div className="dashboard-unionInline">
                        <UnionMapViewer
                          characterName={characterInfo.character_name}
                          darkMode={isBlackWhite}
                          inline
                        />
                      </div>
                    </section>
                  )}

                  {activeInfoTab === "기타스탯" && (
                    <section className="dashboard-inlineSection">
                      <h2 className="dashboard-inlineSection__title">
                        기타스탯
                      </h2>
                      <div className="dashboard-inlinePlaceholder">
                        기타스탯 정보 준비 중
                      </div>
                    </section>
                  )}

                  {activeInfoTab === "스킬" && (
                    <section className="dashboard-inlineSection">
                      <h2 className="dashboard-inlineSection__title">스킬</h2>
                      <div className="dashboard-inlinePlaceholder">
                        스킬 정보 준비 중
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>
          </section>
        </main>

        <aside className="dashboard-sidebar dashboard-sidebar--right">
          <div className="dashboard-panel dashboard-panel--fill">
            <div className="dashboard-panel__title">
              {guildName ? "길드 채팅" : "길드 없다면 알림"}
            </div>
            <div className="dashboard-panel__body dashboard-scroll">
              <div className="dashboard-placeholder">
                길드 채팅 or 길드 없다면 알림
              </div>
            </div>
          </div>
        </aside>
      </div>

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

      <GuildInfoModal
        isOpen={isGuildModalOpen}
        onClose={() => setIsGuildModalOpen(false)}
        guildInfo={guildInfo}
        guildError={guildError}
        onRetry={handleGuildRetry}
      />
    </div>
  );
}

export default App;
