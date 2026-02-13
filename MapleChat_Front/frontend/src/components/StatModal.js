// 스탯 상세 모달 (스탯/하이퍼/어빌리티/성향)
import React from 'react';
import { formatStatValue } from '../utils/formatters';

const StatModal = ({ isOpen, onClose, statInfo, statError, retryStat, hyperStatInfo, hyperStatError, retryHyperStat, abilityInfo, abilityError, retryAbility, propensityInfo, propensityError, retryPropensity }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>스탯 상세 정보</h2>
        <div className="info-sections">
          {statInfo ? (
            <div className="info-section">
              <h3>스탯 정보</h3>
              <div className="stat-grid">
                {[
                  ...statInfo.final_stat.filter(s => s.stat_name === '전투력'),
                  ...statInfo.final_stat.filter(s => s.stat_name !== '전투력')
                ].map((stat, index) => (
                  <div key={index} className="stat-row">
                    <span className="label">{stat.stat_name}</span>
                    <span className="value">{formatStatValue(stat.stat_name, stat.stat_value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : statError ? (
            <div className="info-section">
              <h3>스탯 정보</h3>
              <div className="error-message">
                정보를 불러올 수 없습니다.
                <button onClick={retryStat} className="retry-btn" title="재시도">↻</button>
              </div>
            </div>
          ) : null}

          <div className="sub-info-group">
            {hyperStatInfo ? (
              <div className="info-section">
                <h3>하이퍼 스탯</h3>
                <div className="stat-grid">
                  {(hyperStatInfo[`hyper_stat_preset_${hyperStatInfo.use_preset_no}`] || [])
                    .filter(stat => stat.stat_level > 0)
                    .map((stat, index) => (
                      <div key={index} className="stat-row">
                        <span className="label">{stat.stat_type}</span>
                        <span className="value">Lv.{stat.stat_level}</span>
                      </div>
                    ))}
                </div>
              </div>
            ) : hyperStatError ? (
              <div className="info-section">
                <h3>하이퍼 스탯</h3>
                <div className="error-message">
                  정보를 불러올 수 없습니다.
                  <button onClick={retryHyperStat} className="retry-btn" title="재시도">↻</button>
                </div>
              </div>
            ) : null}

            {abilityInfo ? (
              <div className="info-section">
                <h3>어빌리티 ({abilityInfo.ability_grade})</h3>
                <div className="ability-list">
                  {abilityInfo.ability_info.map((ability, index) => (
                    <div key={index} className="ability-row">
                      <span className="ability-grade">[{ability.ability_grade}]</span>
                      <span className="ability-value">{ability.ability_value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : abilityError ? (
              <div className="info-section">
                <h3>어빌리티</h3>
                <div className="error-message">
                  정보를 불러올 수 없습니다.
                  <button onClick={retryAbility} className="retry-btn" title="재시도">↻</button>
                </div>
              </div>
            ) : null}

            {propensityInfo ? (
              <div className="info-section">
                <h3>성향</h3>
                <div className="propensity-grid">
                  <div className="stat-row"><span className="label">카리스마</span><span className="value">{propensityInfo.charisma_level}</span></div>
                  <div className="stat-row"><span className="label">감성</span><span className="value">{propensityInfo.sensibility_level}</span></div>
                  <div className="stat-row"><span className="label">통찰력</span><span className="value">{propensityInfo.insight_level}</span></div>
                  <div className="stat-row"><span className="label">의지</span><span className="value">{propensityInfo.willingness_level}</span></div>
                  <div className="stat-row"><span className="label">손재주</span><span className="value">{propensityInfo.handicraft_level}</span></div>
                  <div className="stat-row"><span className="label">매력</span><span className="value">{propensityInfo.charm_level}</span></div>
                </div>
              </div>
            ) : propensityError ? (
              <div className="info-section">
                <h3>성향</h3>
                <div className="error-message">
                  정보를 불러올 수 없습니다.
                  <button onClick={retryPropensity} className="retry-btn" title="재시도">↻</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatModal;