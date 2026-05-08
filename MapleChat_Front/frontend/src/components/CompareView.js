import React, { useMemo } from 'react';
import SearchBox from './SearchBox';
import { useCharacterCompare } from '../hooks/useCharacterCompare';
import { getWorldIcon } from '../utils/worldIcons';
import { formatStatValue } from '../utils/formatters';

const STAT_TARGETS = [
  { label: '전투력', names: ['전투력'] },
  { label: '공격력/마력', names: ['공격력', '마력', '스탯 공격력'] },
  { label: 'STR', names: ['STR'] },
  { label: 'DEX', names: ['DEX'] },
  { label: 'INT', names: ['INT'] },
  { label: 'LUK', names: ['LUK'] },
];

function normalizeNumber(value) {
  if (value === null || value === undefined) return null;
  const stringValue = String(value);
  const firstNumeric = stringValue.split('~')[0]?.replace(/,/g, '').trim();
  const parsed = Number(firstNumeric);
  return Number.isFinite(parsed) ? parsed : null;
}

function getStatByNames(statInfo, names) {
  const list = statInfo?.final_stat ?? [];
  return list.find((item) => names.includes(item.stat_name)) ?? null;
}

function getEquipmentSummary(equipmentInfo) {
  const items = equipmentInfo?.item_equipment ?? [];
  const slotCount = items.length;
  const starforceTotal = items.reduce((sum, item) => {
    const star = Number(item.starforce ?? item.star_force ?? 0);
    return sum + (Number.isFinite(star) ? star : 0);
  }, 0);
  return { slotCount, starforceTotal };
}

function CompareColumn({ title, side }) {
  const character = side.characterInfo;
  const worldName = character?.world_name ?? character?.worldName ?? '';
  const worldIcon = worldName ? getWorldIcon(worldName) : null;
  const summary = getEquipmentSummary(side.equipmentInfo);

  return (
    <section className="compare-column dashboard-panel">
      <div className="dashboard-panel__title">{title}</div>
      <div className="dashboard-panel__body compare-column__body">
        <SearchBox
          value={side.characterName}
          onChange={side.setCharacterName}
          onSearch={side.search}
          loading={side.loading}
          searchHistory={[]}
          onRemoveHistoryItem={() => {}}
        />

        {side.loading && <div className="compare-status">불러오는 중...</div>}
        {!side.loading && side.error && (
          <div className="compare-status compare-status--error">{side.error}</div>
        )}

        {!side.loading && !side.error && character && (
          <div className="compare-character">
            <div className="compare-character__image">
              {character.character_image ? (
                <img
                  src={character.character_image}
                  alt={character.character_name || '캐릭터'}
                />
              ) : null}
            </div>
            <div className="compare-character__meta">
              <div className="compare-character__name">{character.character_name}</div>
              <div className="compare-character__line">
                LV.{character.character_level} {character.character_class}
              </div>
              <div className="compare-character__line">
                {worldIcon ? <img src={worldIcon} alt={worldName} className="world-icon" /> : null}
                <span>{worldName}</span>
              </div>
            </div>
          </div>
        )}

        {!side.loading && !side.error && !character && (
          <div className="compare-status">캐릭터를 검색해 주세요.</div>
        )}

        <div className="compare-equipment-summary">
          <div>장비 슬롯 수: {summary.slotCount}</div>
          <div>스타포스 합계: {summary.starforceTotal}</div>
        </div>
      </div>
    </section>
  );
}

export default function CompareView() {
  const { left, right } = useCharacterCompare();

  const rows = useMemo(
    () =>
      STAT_TARGETS.map((target) => {
        const leftStat = getStatByNames(left.statInfo, target.names);
        const rightStat = getStatByNames(right.statInfo, target.names);
        const leftNumber = normalizeNumber(leftStat?.stat_value);
        const rightNumber = normalizeNumber(rightStat?.stat_value);
        return {
          label: target.label,
          left: leftStat,
          right: rightStat,
          leftHigh:
            leftNumber !== null && rightNumber !== null && leftNumber > rightNumber,
          rightHigh:
            leftNumber !== null && rightNumber !== null && rightNumber > leftNumber,
        };
      }),
    [left.statInfo, right.statInfo]
  );

  return (
    <div className="compare-view">
      <div className="compare-grid">
        <CompareColumn title="왼쪽 캐릭터" side={left} />
        <CompareColumn title="오른쪽 캐릭터" side={right} />
      </div>

      <section className="compare-stats dashboard-panel">
        <div className="dashboard-panel__title">주요 스탯 비교</div>
        <div className="dashboard-panel__body">
          <table className="compare-stats__table">
            <thead>
              <tr>
                <th>항목</th>
                <th>왼쪽</th>
                <th>오른쪽</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td
                    className={
                      row.leftHigh ? 'compare-value compare-value--high' : 'compare-value compare-value--low'
                    }
                  >
                    {row.left
                      ? formatStatValue(row.left.stat_name, row.left.stat_value)
                      : '-'}
                  </td>
                  <td
                    className={
                      row.rightHigh ? 'compare-value compare-value--high' : 'compare-value compare-value--low'
                    }
                  >
                    {row.right
                      ? formatStatValue(row.right.stat_name, row.right.stat_value)
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
