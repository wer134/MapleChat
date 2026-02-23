// 검색 결과 상단: 아바타·이름·레벨·직업·월드·길드·액션 버튼
import React from 'react';
import { getWorldIcon } from '../utils/worldIcons';

const CharacterHeader = ({ characterInfo, onOpenStat, onOpenEquipment, onOpenUnion, onOpenGuild }) => {
  const guildName = characterInfo.guild_name ?? characterInfo.guildName ?? '';
  const worldName = characterInfo.world_name ?? characterInfo.worldName ?? '';

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
              {getWorldIcon(worldName) && (
                <img
                  src={getWorldIcon(worldName)}
                  alt={worldName}
                  className="world-icon"
                />
              )}
              {worldName}
            </span>
            <span>LV.{characterInfo.character_level}</span>
            <span>{characterInfo.character_class}</span>
          </div>
          {guildName && (
            <div className="character-guild">
              <span className="character-guild-label">길드</span>
              <span className="character-guild-name">{guildName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-btn" onClick={onOpenStat}>스탯 정보</button>
        <button className="action-btn" onClick={onOpenEquipment}>장비 정보</button>
        <button className="action-btn" onClick={onOpenUnion}>유니온 정보</button>
        <button
          className="action-btn"
          onClick={guildName && onOpenGuild ? () => onOpenGuild(guildName, worldName) : undefined}
          disabled={!guildName}
          title={!guildName ? '해당 캐릭터는 길드에 소속되어 있지 않습니다' : '길드 정보 보기'}
        >
          길드 정보
        </button>
      </div>
    </>
  );
};

export default CharacterHeader;