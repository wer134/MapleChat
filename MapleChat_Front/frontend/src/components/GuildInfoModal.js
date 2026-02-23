// 길드 정보 모달
import React from 'react';

function get(guild, snakeKey, camelKey) {
  return guild[snakeKey] ?? guild[camelKey] ?? '-';
}

export default function GuildInfoModal({ isOpen, onClose, guildInfo, guildError, onRetry }) {
  if (!isOpen) return null;

  const members = guildInfo?.guild_member ?? guildInfo?.guildMember ?? [];
  const skills = guildInfo?.guild_skill ?? guildInfo?.guildSkill ?? [];
  const noblesseSkills = guildInfo?.guild_noblesse_skill ?? guildInfo?.guildNoblesseSkill ?? [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content guild-info-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>×</button>
        <h2>길드 정보</h2>

        {guildError && (
          <div className="guild-info-error">
            <p>길드 정보를 불러올 수 없습니다.</p>
            {onRetry && (
              <button type="button" className="retry-btn" onClick={onRetry}>다시 시도</button>
            )}
          </div>
        )}

        {!guildError && guildInfo && (
          <div className="guild-info-sections">
            <div className="guild-info-section guild-info-header">
              <h3>{get(guildInfo, 'guild_name', 'guildName')}</h3>
              <p className="guild-info-world">월드: {get(guildInfo, 'world_name', 'worldName')}</p>
              <div className="guild-info-stats">
                <span>Lv.{get(guildInfo, 'guild_level', 'guildLevel')}</span>
                <span>명성 {get(guildInfo, 'guild_fame', 'guildFame')}</span>
                <span>포인트 {get(guildInfo, 'guild_point', 'guildPoint')}</span>
                <span>마스터 {get(guildInfo, 'guild_master_name', 'guildMasterName')}</span>
                <span>멤버 {get(guildInfo, 'guild_member_count', 'guildMemberCount')}명</span>
              </div>
            </div>

            {Array.isArray(members) && members.length > 0 && (
              <div className="guild-info-section">
                <h3>길드원</h3>
                <ul className="guild-member-list">
                  {members.map((name, i) => (
                    <li key={`${name}-${i}`}>{name}</li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(skills) && skills.length > 0 && (
              <div className="guild-info-section">
                <h3>길드 스킬</h3>
                <ul className="guild-skill-list">
                  {skills.map((s, i) => (
                    <li key={i} className="guild-skill-item">
                      <span className="guild-skill-name">{s.skill_name ?? s.skillName ?? '-'}</span>
                      <span className="guild-skill-level">Lv.{s.skill_level ?? s.skillLevel ?? 0}</span>
                      {(s.skill_effect ?? s.skillEffect) && (
                        <span className="guild-skill-effect">{s.skill_effect ?? s.skillEffect}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(noblesseSkills) && noblesseSkills.length > 0 && (
              <div className="guild-info-section">
                <h3>노블레스 스킬</h3>
                <ul className="guild-skill-list">
                  {noblesseSkills.map((s, i) => (
                    <li key={i} className="guild-skill-item">
                      <span className="guild-skill-name">{s.skill_name ?? s.skillName ?? '-'}</span>
                      <span className="guild-skill-level">Lv.{s.skill_level ?? s.skillLevel ?? 0}</span>
                      {(s.skill_effect ?? s.skillEffect) && (
                        <span className="guild-skill-effect">{s.skill_effect ?? s.skillEffect}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
