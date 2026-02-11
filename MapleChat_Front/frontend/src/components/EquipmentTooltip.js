/** 장비 슬롯 호버/클릭 시 뜨는 상세 툴팁 (이름, 아이콘, 스탯, 잠재/에디/소울 등) */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { formatExpireDate } from '../utils/formatters';
import { getJobCategory, getMaxStarforce, getRarityColor, getRarityInitial } from '../utils/gameLogic';

const FALLBACK_ICON_SVG =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect fill="#2a2a2a" width="50" height="50"/><text x="25" y="28" text-anchor="middle" fill="#666" font-size="11">?</text></svg>'
  );

const EquipmentTooltip = ({ equipment, position, isPinned, onClose, characterClass }) => {
  const tooltipRef = useRef(null);
  const [adjustedPos, setAdjustedPos] = useState({ x: -9999, y: -9999 });

  useLayoutEffect(() => {
    if (tooltipRef.current && position) {
      const { innerWidth, innerHeight } = window;
      const { offsetWidth, offsetHeight } = tooltipRef.current;
      
      let x = position.x;
      let y = position.y;

      // 툴팁이 뷰포트 밖으로 나가지 않도록 위치 보정
      if (x + offsetWidth > innerWidth) {
        x = x - offsetWidth - 20;
      }
      if (y + offsetHeight > innerHeight) {
        y = y - offsetHeight - 20;
      }
      if (y < 0) {
        y = 10;
      }

      setAdjustedPos({ x, y });
    }
  }, [position, equipment]);

  if (!equipment) return null;

  const starforce = parseInt(equipment.starforce) || 0;
  const maxStarforce = getMaxStarforce(equipment);
  const goldStars = starforce;
  const greyStars = Math.max(0, maxStarforce - starforce);

  const rarityColor = getRarityColor(equipment.potential_option_grade) || '#FFFFFF';
  const additionalRarityColor = getRarityColor(equipment.additional_potential_option_grade) || '#FFFFFF';
  const isLimitedTime = formatExpireDate(equipment.date_expire) !== null;

  const renderStarforce = () => {
    const allStars = [];
    const isAmazing = equipment.amazing_scroll_flag === '사용';
    for (let i = 0; i < goldStars; i++) {
      allStars.push(isAmazing ? 'blue' : 'gold');
    }
    for (let i = 0; i < greyStars; i++) {
      allStars.push('grey');
    }

    // 스타포스 별 5개씩 묶어 한 줄에 3묶음까지 표시
    const starGroups = [];
    for (let i = 0; i < allStars.length; i += 5) {
      starGroups.push(allStars.slice(i, i + 5));
    }
    const rows = [];
    for (let i = 0; i < starGroups.length; i += 3) {
      rows.push(starGroups.slice(i, i + 3));
    }

    return (
      <div className="starforce-stars-container">
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="star-row">
            {row.map((group, groupIndex) => (
              <div key={`group-${rowIndex}-${groupIndex}`} className="star-group">
                {group.map((type, starIndex) => (
                  <span key={`star-${rowIndex}-${groupIndex}-${starIndex}`} className={`star ${type}`}>★</span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderStat = (label, key) => {
    const total = parseInt(equipment.item_total_option?.[key] || 0);
    if (total === 0) return null;

    const base = parseInt(equipment.item_base_option?.[key] || 0);
    const add = parseInt(equipment.item_add_option?.[key] || 0);
    const etc = parseInt(equipment.item_etc_option?.[key] || 0);
    const starforce = parseInt(equipment.item_starforce_option?.[key] || 0);

    const hasBonus = add > 0 || etc > 0 || starforce > 0;

    return (
      <div className="stat-line" key={key}>
        {label}: <span className="stat-value">+{total}</span>
        {hasBonus && (
          <span className="stat-breakdown">
            ({base}
            {starforce > 0 && <span className="stat-starforce"> +{starforce}</span>}
            {etc > 0 && <span className="stat-etc"> +{etc}</span>}
            {add > 0 && <span className="stat-add"> +{add}</span>}
            )
          </span>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={tooltipRef}
      className={`equipment-tooltip ${isPinned ? 'pinned' : ''}`}
      style={{
        left: adjustedPos.x,
        top: adjustedPos.y
      }}
    >
      {isPinned && (
        <button onClick={onClose} className="tooltip-close-button">×</button>
      )}
      {/* 스타포스 강화 별 (5개 단위, 3묶음/줄) */}
      {renderStarforce()}
      {/* 장비 이름 */}
      <div className="item-name">
        {equipment.item_name}
      </div>
      {formatExpireDate(equipment.date_expire) && (
        <div className="item-trade-info" style={{ color: '#ff9933' }}>
          유효 기간 : {formatExpireDate(equipment.date_expire)}
        </div>
      )}

      <div className="tooltip-divider"></div>

      {/* 장비 아이콘 + 요구 직업/레벨 */}
      <div className="item-header">
        {equipment.item_icon && (
          <img
            src={equipment.item_icon}
            alt={equipment.item_name}
            className="item-icon"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_ICON_SVG;
            }}
          />
        )}
        <div className="item-info">
          <div className="item-category">장착 직업</div>
          <div className="item-job-req">{getJobCategory(characterClass)}</div>
          <div className="item-category">요구 레벨</div>
          <div className="item-level-req">
            {equipment.item_total_option?.equipment_level_decrease > 0 ? (
              <>
                Lv. {equipment.item_base_option?.base_equipment_level - equipment.item_total_option?.equipment_level_decrease} ({equipment.item_base_option?.base_equipment_level} - {equipment.item_total_option?.equipment_level_decrease})
              </>
            ) : (
              <>Lv. {equipment.item_base_option?.base_equipment_level || 0}</>
            )}
          </div>
        </div>
      </div>

      <div className="tooltip-divider"></div>

      {/* 스탯(STR/DEX/INT 등)·강화 정보 */}
      {(equipment.item_total_option || equipment.scroll_upgradeable_count || (parseInt(equipment.scroll_upgrade || 0) > 0 || parseInt(equipment.scroll_resilience_count || 0) > 0)) && (
        <div className="item-stats">
          <div className="item-category">장비 분류 : {equipment.item_equipment_part || equipment.item_equipment_slot.replace(/[0-9]/g, '')}</div>
          {equipment.item_total_option && (
            <>
              {renderStat('STR', 'str')}
              {renderStat('DEX', 'dex')}
              {renderStat('INT', 'int')}
              {renderStat('LUK', 'luk')}
              {renderStat('최대 HP', 'max_hp')}
              {renderStat('공격력', 'attack_power')}
              {renderStat('마력', 'magic_power')}
              {renderStat('방어력', 'armor')}
              {renderStat('이동속도', 'speed')}
              {renderStat('점프력', 'jump')}
              {equipment.item_total_option?.equipment_level_decrease > 0 && (
                <div className="stat-line">
                  <span className="stat-label">착용 가능 레벨:</span>
                  <span className="stat-value"> -{equipment.item_total_option.equipment_level_decrease}</span>
                </div>
              )}
            </>
          )}
          {(parseInt(equipment.scroll_upgrade || 0) > 0 || parseInt(equipment.scroll_resilience_count || 0) > 0) && (
            <div className="upgrade-info">
              주문서 강화 {parseInt(equipment.scroll_upgrade || 0) + parseInt(equipment.scroll_resilience_count || 0)}회 (성공 {equipment.scroll_upgrade || 0}회, 실패 {equipment.scroll_resilience_count || 0}회)
            </div>
          )}
          {equipment.golden_hammer_flag === '적용' && (
            <div className="upgrade-info">황금 망치 제련 적용</div>
          )}
          {parseInt(equipment.cuttable_count) > 0 && (
            <div className="upgrade-info">가위 사용 가능 횟수 : {parseInt(equipment.cuttable_count) === 255 ? 0 : equipment.cuttable_count}회</div>
          )}
          {equipment.scroll_upgradeable_count && (
            <div className="upgrade-info">
              업그레이드 가능 횟수: {equipment.scroll_upgradeable_count}
            </div>
          )}
        </div>
      )}

      {/* 잠재능력 (등급·옵션 3줄) */}
      {equipment.potential_option_grade && (
        <>
          <div className="tooltip-divider"></div>
          <div className="potential-header" style={{ color: rarityColor }}>
            <span className="potential-icon" style={{ backgroundColor: rarityColor, color: '#000'}}>{
            getRarityInitial(equipment.potential_option_grade)}
            </span> 잠재능력 : {equipment.potential_option_grade}{isLimitedTime && <span style={{ color: '#aaa' }}> (추가 강화 불가)</span>}
          </div>
          {equipment.potential_option_1 && (
            <div className="potential-option">{equipment.potential_option_1}</div>
          )}
          {equipment.potential_option_2 && (
            <div className="potential-option">{equipment.potential_option_2}</div>
          )}
          {equipment.potential_option_3 && (
            <div className="potential-option">{equipment.potential_option_3}</div>
          )}
        </>
      )}

      {isLimitedTime && (
        <>
          <div className="tooltip-divider"></div>
          <div className="potential-header additional" style={{ color: '#aaa' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '12px',
              height: '12px',
              backgroundColor: '#333',
              borderRadius: '3px',
              marginRight: '5px',
              border: '1px solid #000',
              verticalAlign: 'middle'
            }}>
              <span style={{
                width: '4px',
                height: '4px',
                backgroundColor: '#aaa',
                borderRadius: '50%'
              }}></span>
            </span>
            에디셔널 잠재능력 : 강화 불가
          </div>
        </>
      )}

      {/* 에디셔널 잠재능력 */}
      {equipment.additional_potential_option_grade && (
        <>
          <div className="tooltip-divider"></div>
          <div className="potential-header additional" style={{ color: additionalRarityColor }}>
            <span className="potential-icon" style={{ background: additionalRarityColor, color: '#000'}}>{
            getRarityInitial(equipment.additional_potential_option_grade)}
            </span> 에디셔널 잠재능력 : {equipment.additional_potential_option_grade}
          </div>
          {equipment.additional_potential_option_1 && (
            <div className="potential-option">{equipment.additional_potential_option_1}</div>
          )}
          {equipment.additional_potential_option_2 && (
            <div className="potential-option">{equipment.additional_potential_option_2}</div>
          )}
          {equipment.additional_potential_option_3 && (
            <div className="potential-option">{equipment.additional_potential_option_3}</div>
          )}
        </>
      )}

      {/* 소울 웨폰 (이름·옵션) */}
      {equipment.soul_name && (
        <>
          <div className="tooltip-divider"></div>
          <div className="potential-header soul-weapon" style={{ color: '#FFFF66' }}>
            <span className="potential-icon" style={{ backgroundColor: '#FFFF66', color: '#000' }}>S</span> 소울 웨폰
          </div>
          <div className="potential-option">{equipment.soul_name}</div>
          {equipment.soul_option && (
            <div className="potential-option">{equipment.soul_option}</div>
          )}
        </>
      )}
    </div>
  );
};

export default EquipmentTooltip;