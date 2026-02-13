// 장비 목록 모달 (그리드·툴팁 연동)
import React from 'react';
import { equipmentCells } from '../constants/equipmentSlots';
import { getRarityColor } from '../utils/gameLogic';

const normalizeSlot = (s) =>
  (s || '')
    .replace(/[0-9]/g, '')
    .replace(/\s+/g, '')
    .replace(/[()_-]/g, '')
    .trim();

const isEquipmentIncomplete = (equip) => {
  if (!equip) return false;
  const hasIcon = !!equip.item_icon;
  const hasStats = !!(equip.item_total_option || equip.item_base_option);
  const hasName = !!equip.item_name;
  return !hasIcon || !hasStats || !hasName;
};

const EquipmentModal = ({ isOpen, onClose, equipmentInfo, equipmentError, retryEquipment, androidInfo, characterImage, activeTooltip, setActiveTooltip }) => {
  if (!isOpen) return null;

  const itemEquipment = equipmentInfo?.item_equipment ?? [];
  const hasEquipment = itemEquipment.length > 0;
  const incompleteItems = hasEquipment ? itemEquipment.filter(isEquipmentIncomplete) : [];
  const showIncompleteBanner = incompleteItems.length > 0;

  if (equipmentError && !hasEquipment) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content equipment-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          <h3>장비 목록</h3>
          <div className="error-message">
            장비 정보를 불러올 수 없습니다.
            <button onClick={retryEquipment} className="retry-btn" title="재시도">↻</button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasEquipment && !equipmentError) return null;

  const FALLBACK_ICON_SVG =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect fill="#2a2a2a" width="50" height="50"/><text x="25" y="28" text-anchor="middle" fill="#666" font-size="11">?</text></svg>'
    );

  return (
    <div className="modal-overlay" onClick={() => {
      if (activeTooltip.pinned) {
        setActiveTooltip({ equipment: null, pinned: false, position: null });
      } else {
        onClose();
      }
    }}>
      <div className="modal-content equipment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="equipment-list">
          <h3>장비 목록</h3>
          {showIncompleteBanner && (
            <div className="equipment-retry-banner">
              일부 장비의 정보(이미지, 능력치 등)가 누락되었을 수 있습니다.
              <button onClick={retryEquipment} className="retry-btn" title="장비 정보 다시 불러오기">↻ 다시 불러오기</button>
            </div>
          )}
          <div className="equipment-grid">
            {(equipmentCells ?? []).map((cell, idx) => {
              const style = {
                gridRow: `${cell.row} / span ${cell.rowSpan || 1}`,
                gridColumn: `${cell.col} / span ${cell.colSpan || 1}`,
              };

              if (cell.type === 'preview') {
                return (
                  <div key={idx} className="equipment-cell preview" style={style}>
                    {characterImage ? (
                      <img
                        src={characterImage}
                        alt="캐릭터"
                        className="equipment-preview-character"
                      />
                    ) : null}
                  </div>
                );
              }
              if (cell.type === 'mergedEmpty') {
                return <div key={idx} className="equipment-cell bottom-merged" style={style} />;
              }
              if (cell.type === 'empty') {
                return <div key={idx} className="equipment-item empty" style={style} />;
              }

              // 슬롯 셀: item_equipment에서 slot명으로 매칭해 해당 장비 표시
              let equip = null;
              const itemList = equipmentInfo?.item_equipment ?? [];
              const target = normalizeSlot(cell.slot);
              const matchingEquipments = itemList
                .filter((item) => normalizeSlot(item.item_equipment_slot) === target)
                .sort((a, b) =>
                  (a.item_equipment_slot || '').localeCompare(b.item_equipment_slot || '', 'ko')
                );
              if (cell.slotIndex && matchingEquipments.length >= cell.slotIndex) {
                equip = matchingEquipments[cell.slotIndex - 1];
              } else {
                equip = matchingEquipments[0] || null;
              }

              if (!equip && cell.slot === '안드로이드' && androidInfo && typeof androidInfo === 'object') {
                const icon = androidInfo.android_icon ?? androidInfo.androidIcon;
                const name = androidInfo.android_name ?? androidInfo.androidName ?? androidInfo.android_nickname ?? androidInfo.androidNickname ?? '안드로이드';
                if (icon || name) {
                  equip = {
                    item_icon: icon || null,
                    item_name: name,
                  };
                }
              }

              const rarityColor = equip ? getRarityColor(equip.potential_option_grade) : null;
              return (
                <div
                  key={idx}
                  className={`equipment-item ${!equip ? 'empty' : ''}`}
                  style={{ ...style, ...(rarityColor ? { '--hover-color': rarityColor } : {}) }}
                  onMouseEnter={(e) => {
                    if (equip && !activeTooltip.pinned) {
                      setActiveTooltip({
                        equipment: equip,
                        pinned: false,
                        position: { x: e.clientX + 15, y: e.clientY + 15 },
                      });
                    }
                  }}
                  onMouseMove={(e) => {
                    if (equip && !activeTooltip.pinned) {
                      setActiveTooltip((prev) => ({
                        ...prev,
                        position: { x: e.clientX + 15, y: e.clientY + 15 },
                      }));
                    }
                  }}
                  onMouseLeave={() => {
                    if (!activeTooltip.pinned) {
                      setActiveTooltip({ equipment: null, pinned: false, position: null });
                    }
                  }}
                  onClick={(e) => {
                    if (equip) {
                      if (activeTooltip.pinned && activeTooltip.equipment === equip) {
                        setActiveTooltip({ equipment: null, pinned: false, position: null });
                      } else {
                        setActiveTooltip({
                          equipment: equip,
                          pinned: true,
                          position: { x: e.clientX + 15, y: e.clientY + 15 },
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
                          onLoad={(e) => {
                            if (e.currentTarget.currentSrc && e.currentTarget.currentSrc.includes('/static/empty_img.png')) {
                              e.currentTarget.src = FALLBACK_ICON_SVG;
                            }
                          }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_ICON_SVG;
                          }}
                        />
                      ) : (
                        <span className="equipment-slot-fallback">{equip.item_name || cell.label}</span>
                      )}
                      <div className="equipment-name">{equip.item_name}</div>
                    </>
                  ) : (
                    <span className="slot-label">{cell.label}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentModal;