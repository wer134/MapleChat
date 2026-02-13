// 검색 결과 상단: 아바타·이름·레벨·직업·월드·액션 버튼
import React from 'react';
import { getWorldIcon } from '../utils/worldIcons';

const CharacterHeader = ({ characterInfo, onOpenStat, onOpenEquipment, onOpenUnion }) => {
  return (
    <>
      <div className="character-header">
        <div className="character-image">
          {characterInfo.character_image ? (
            <img 
              src={characterInfo.character_image} 
              alt={characterInfo.character_name}
              className="character-avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          <div className="image-placeholder" style={{display: characterInfo.character_image ? 'none' : 'block'}}>
            캐릭터 이미지
          </div>
        </div>
        <div className="character-details">
          <div className="character-name">
              {characterInfo.character_name}
          </div>
          <div className="character-basic">
            <span className="world-name">
              {getWorldIcon(characterInfo.world_name) && (
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

      <div className="action-buttons">
        <button className="action-btn" onClick={onOpenStat}>스탯 정보</button>
        <button className="action-btn" onClick={onOpenEquipment}>장비 정보</button>
        <button className="action-btn" onClick={onOpenUnion}>유니온 정보</button>
      </div>
    </>
  );
};

export default CharacterHeader;