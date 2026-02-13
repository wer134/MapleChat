// 유니온 지도 뷰어 (3열: 리스트·그리드·필터)
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchUnionPayload } from '../utils/unionApi';
import { rotateShape } from '../utils/unionShapes';
import { JOB_GROUP_LABELS, RANK_ORDER, STAT_ROW_LABELS } from '../types/unionTypes';
import './UnionMapViewer.css';

const GRID_DEFAULT = { width: 20, height: 20 };
const TILE_PX = 18;
const POLL_INTERVAL_MS = 45000;

const JOB_COLORS = {
  WARRIOR: '#c8a060',
  MAGE: '#6b9bd1',
  ARCHER: '#7bc96a',
  THIEF: '#d4a574',
  PIRATE: '#e8b923',
  XENON: '#9d7bc4',
  ETC: '#9e9e9e',
};

const RANK_BORDER = { B: '1px', A: '1px', S: '2px', SS: '2px', SSS: '3px' };

export default function UnionMapViewer({ characterName, onClose }) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState([]); // 리스트에서 선택한 캐릭터 → 배치도 하이라이트
  const [hoverBlockId, setHoverBlockId] = useState(null);
  const [jobFilter, setJobFilter] = useState([]); // ['WARRIOR', 'MAGE', ...]
  const [rankFilter, setRankFilter] = useState([]); // ['B', 'A', 'S', ...]
  const [searchQuery, setSearchQuery] = useState('');
  const [realtimeOn, setRealtimeOn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const fetchData = useCallback(async () => {
    if (!characterName) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUnionPayload(characterName);
      setPayload(data);
    } catch (e) {
      setError(e.message || '오류');
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, [characterName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!realtimeOn || !characterName) return;
    const id = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [realtimeOn, characterName, fetchData]);

  const gridSize = useMemo(
    () => ({
      width: payload?.grid?.width ?? GRID_DEFAULT.width,
      height: payload?.grid?.height ?? GRID_DEFAULT.height,
    }),
    [payload]
  );

  const blocksWithCells = useMemo(() => {
    if (!payload?.blocks) return [];
    return payload.blocks.map((b) => {
      const cells = b.shapeCells?.length
        ? rotateShape(b.shapeCells, b.rotation || 0)
        : [];
      return { ...b, renderedCells: cells };
    });
  }, [payload?.blocks]);

  const filteredCharacters = useMemo(() => {
    let list = payload?.characters ?? [];
    if (jobFilter.length) list = list.filter((c) => jobFilter.includes(c.jobGroup));
    if (rankFilter.length) list = list.filter((c) => rankFilter.includes(c.rank));
    if (searchQuery.trim())
      list = list.filter((c) =>
        (c.name || '').toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    return [...list].sort((a, b) => (b.level ?? 0) - (a.level ?? 0));
  }, [payload?.characters, jobFilter, rankFilter, searchQuery]);

  const highlightedCharacterIds =
    selectedBlockId && payload?.blocks
      ? (payload.blocks.find((b) => b.id === selectedBlockId)?.characterIds ?? [])
      : [];

  const blockIdsHighlightedByList = useMemo(() => {
    if (!selectedCharacterIds.length || !payload?.blocks) return new Set();
    const set = new Set();
    payload.blocks.forEach((b) => {
      if (b.characterIds?.some((id) => selectedCharacterIds.includes(id))) set.add(b.id);
    });
    return set;
  }, [payload?.blocks, selectedCharacterIds]);

  const toggleCharacterSelection = (characterId) => {
    setSelectedCharacterIds((prev) =>
      prev.includes(characterId)
        ? prev.filter((id) => id !== characterId)
        : [...prev, characterId]
    );
  };

  const statsByRow = useMemo(() => {
    const counts = {};
    STAT_ROW_LABELS.forEach((label) => { counts[label] = 0; });
    const chars = payload?.characters ?? [];
    chars.forEach((c) => {
      const jobLabel = JOB_GROUP_LABELS[c.jobGroup];
      const lvl = c.level;
      if (lvl <= 60) counts['Lvl 60'] = (counts['Lvl 60'] || 0) + 1;
      else if (lvl <= 100) counts['Lvl 100'] = (counts['Lvl 100'] || 0) + 1;
      else if (lvl <= 140 && (c.jobGroup === 'WARRIOR' || c.jobGroup === 'PIRATE')) counts['Lvl 140 (전사/해적)'] = (counts['Lvl 140 (전사/해적)'] || 0) + 1;
      else if (lvl <= 140) counts['Lvl 140 (마법사/도적/궁수/메이플M)'] = (counts['Lvl 140 (마법사/도적/궁수/메이플M)'] || 0) + 1;
      else if (lvl <= 200 && c.jobGroup === 'WARRIOR') counts['Lvl 200 전사'] = (counts['Lvl 200 전사'] || 0) + 1;
      else if (lvl <= 200 && (c.jobGroup === 'ARCHER' || c.jobGroup === 'ETC')) counts['Lvl 200 궁수/메이플M(SS)'] = (counts['Lvl 200 궁수/메이플M(SS)'] || 0) + 1;
      else if (lvl <= 200 && c.jobGroup === 'THIEF') counts['Lvl 200 도적/Lab'] = (counts['Lvl 200 도적/Lab'] || 0) + 1;
      else if (lvl <= 200 && c.jobGroup === 'MAGE') counts['Lvl 200 마법사'] = (counts['Lvl 200 마법사'] || 0) + 1;
      else if (lvl <= 200 && c.jobGroup === 'PIRATE') counts['Lvl 200 해적'] = (counts['Lvl 200 해적'] || 0) + 1;
      else if (lvl >= 250) counts['Lvl 250 전사/궁수/도적/마법사/해적/제논'] = (counts['Lvl 250 전사/궁수/도적/마법사/해적/제논'] || 0) + 1;
    });
    return counts;
  }, [payload?.characters]);

  const totalCells = useMemo(
    () => blocksWithCells.reduce((s, b) => s + b.renderedCells.length, 0),
    [blocksWithCells]
  );

  const toggleJob = (job) => {
    setJobFilter((prev) =>
      prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job]
    );
  };
  const toggleRank = (r) => {
    setRankFilter((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };
  const resetFilters = () => {
    setJobFilter([]);
    setRankFilter([]);
    setSearchQuery('');
  };

  const rootClass = darkMode ? 'union-map-viewer dark' : 'union-map-viewer';

  if (loading && !payload) {
    return (
      <div className={rootClass}>
        {onClose && <button type="button" className="union-viewer-close" onClick={onClose}>×</button>}
        <div className="union-viewer-loading">유니온 정보 불러오는 중...</div>
      </div>
    );
  }

  if (error && !payload) {
    return (
      <div className={rootClass}>
        {onClose && <button type="button" className="union-viewer-close" onClick={onClose}>×</button>}
        <div className="union-viewer-error">
          {error}
          <button type="button" onClick={fetchData}>다시 시도</button>
        </div>
      </div>
    );
  }

  const empty = !payload?.blocks?.length && !payload?.characters?.length;

  return (
    <div className={rootClass}>
      {onClose && (
        <button type="button" className="union-viewer-close" onClick={onClose}>
          ×
        </button>
      )}

      <div className="union-viewer-layout">
        {/* (A) 좌측 패널 */}
        <aside className="union-viewer-left">
          <div className="union-viewer-summary">
            <h3>유니온 요약</h3>
            <div className="union-viewer-summary-row">
              <span>유니온 레벨</span>
              <strong>{payload?.summary?.unionLevel ?? '-'}</strong>
            </div>
            <div className="union-viewer-summary-row">
              <span>총 캐릭터 수</span>
              <strong>{payload?.summary?.totalCharacters ?? 0}</strong>
            </div>
            {payload?.summary?.score != null && (
              <div className="union-viewer-summary-row">
                <span>유니온 점수</span>
                <strong>{payload.summary.score}</strong>
              </div>
            )}
            <div className="union-viewer-summary-row">
              <span>마지막 갱신</span>
              <span className="union-viewer-time">
                {payload?.summary?.lastUpdatedAt
                  ? new Date(payload.summary.lastUpdatedAt).toLocaleString('ko-KR')
                  : '-'}
              </span>
            </div>
          </div>

          <div className="union-viewer-stats">
            <h3>직업군/등급별 블록 개수</h3>
            <ul>
              {STAT_ROW_LABELS.map((label) => (
                <li key={label} className="union-viewer-stat-row">
                  <span className="union-viewer-stat-label">{label}</span>
                  <span className="union-viewer-stat-badge">{statsByRow[label] ?? 0}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="union-viewer-char-section">
            <h3>캐릭터 리스트</h3>
            <div className="union-viewer-table-wrap">
              <table className="union-viewer-table">
                <thead>
                  <tr>
                    <th>직업군</th>
                    <th>레벨</th>
                    <th>등급</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCharacters.length === 0 ? (
                    <tr>
                      <td colSpan={3}>목록 없음</td>
                    </tr>
                  ) : (
                    filteredCharacters.map((c) => (
                      <tr
                        key={c.id}
                        className={[
                          highlightedCharacterIds.includes(c.id) ? 'highlight' : '',
                          selectedCharacterIds.includes(c.id) ? 'selected-from-list' : '',
                        ].filter(Boolean).join(' ')}
                        onClick={() => toggleCharacterSelection(c.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && toggleCharacterSelection(c.id)}
                      >
                        <td>{c.name ?? '—'}</td>
                        <td>{c.level}</td>
                        <td><span className={`rank-badge rank-${c.rank}`}>{c.rank}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </aside>

        {/* (B) 중앙 그리드 뷰어 */}
        <main className="union-viewer-center">
          <div
              className="union-viewer-grid-wrap"
              style={{
                '--cols': gridSize.width,
                '--rows': gridSize.height,
                '--tile': TILE_PX + 'px',
              }}
            >
              <div className="union-viewer-grid">
                {Array.from({ length: gridSize.width * gridSize.height }, (_, i) => {
                  const gx = i % gridSize.width;
                  const gy = Math.floor(i / gridSize.width);
                  const isCrossH = gy === Math.floor(gridSize.height / 2);
                  const isCrossV = gx === Math.floor(gridSize.width / 2);
                  let blockCell = null;
                  blocksWithCells.forEach((b) => {
                    b.renderedCells.forEach((c) => {
                      if (b.x + c.x === gx && b.y + c.y === gy) {
                        blockCell = b;
                      }
                    });
                  });
                  return (
                    <div
                      key={i}
                      className={`union-viewer-cell ${isCrossH ? 'cross-h' : ''} ${isCrossV ? 'cross-v' : ''}`}
                      data-x={gx}
                      data-y={gy}
                    >
                      {blockCell && (
                        <div
                          className={`union-viewer-block-cell ${selectedBlockId === blockCell.id ? 'selected' : ''} ${blockIdsHighlightedByList.has(blockCell.id) ? 'highlight-from-list' : ''} ${hoverBlockId === blockCell.id ? 'hover' : ''}`}
                          style={{
                            background: JOB_COLORS[blockCell.jobGroup] || JOB_COLORS.ETC,
                            borderWidth: RANK_BORDER[blockCell.rank] || '1px',
                          }}
                          onClick={() => setSelectedBlockId(blockCell.id)}
                          onMouseEnter={() => setHoverBlockId(blockCell.id)}
                          onMouseLeave={() => setHoverBlockId(null)}
                          title={`${JOB_GROUP_LABELS[blockCell.jobGroup]} / ${blockCell.rank} / ${blockCell.characterIds?.length ?? 0}명`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          {empty && (
            <div className="union-viewer-empty-overlay">배치된 블록이 없습니다.</div>
          )}
          {hoverBlockId && (
            <div className="union-viewer-tooltip">
              {(() => {
                const b = payload?.blocks?.find((x) => x.id === hoverBlockId);
                if (!b) return null;
                const chars = (payload?.characters ?? []).filter((c) => b.characterIds?.includes(c.id));
                return (
                  <>
                    <div>{JOB_GROUP_LABELS[b.jobGroup]} / {b.rank}</div>
                    <div>포함: {chars.length}명 {chars[0]?.name}</div>
                  </>
                );
              })()}
            </div>
          )}
        </main>

        {/* (C) 우측 패널 */}
        <aside className="union-viewer-right">
          <div className="union-viewer-desc">
            <h3>설명</h3>
            <ol>
              <li>중앙 그리드는 유니온 공격대 배치를 표시합니다.</li>
              <li>블록에 마우스를 올리면 직업군·등급·캐릭터 수를 볼 수 있습니다.</li>
              <li>블록을 클릭하면 좌측 캐릭터 리스트에서 해당 블록에 포함된 캐릭터가 강조됩니다.</li>
              <li>캐릭터 리스트에서 행을 클릭하면 배치도에서 해당 캐릭터가 있는 블록이 녹색 테두리로 표시됩니다.</li>
              <li>우측 필터로 직업군·등급·이름 검색이 가능합니다.</li>
              <li>실시간 보기를 켜면 주기적으로 데이터를 다시 불러옵니다.</li>
            </ol>
          </div>
          <div className="union-viewer-filters">
            <h3>필터</h3>
            <div className="union-viewer-filter-group">
              <span>직업군</span>
              {Object.keys(JOB_GROUP_LABELS).map((job) => (
                <label key={job} className="union-viewer-check">
                  <input
                    type="checkbox"
                    checked={jobFilter.includes(job)}
                    onChange={() => toggleJob(job)}
                  />
                  {JOB_GROUP_LABELS[job]}
                </label>
              ))}
            </div>
            <div className="union-viewer-filter-group">
              <span>등급</span>
              {RANK_ORDER.map((r) => (
                <label key={r} className="union-viewer-check">
                  <input
                    type="checkbox"
                    checked={rankFilter.includes(r)}
                    onChange={() => toggleRank(r)}
                  />
                  {r}
                </label>
              ))}
            </div>
            <div className="union-viewer-filter-group">
              <span>캐릭터명 검색</span>
              <input
                type="text"
                className="union-viewer-search"
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="union-viewer-toggles">
            <label className="union-viewer-check">
              <input
                type="checkbox"
                checked={realtimeOn}
                onChange={(e) => setRealtimeOn(e.target.checked)}
              />
              실시간 보기 (약 45초마다 재조회)
            </label>
            <label className="union-viewer-check">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              다크모드
            </label>
          </div>
        </aside>
      </div>

      {/* (D) 하단 상태바 */}
      <footer className="union-viewer-footer">
        <span>배치된 블록 수: {payload?.blocks?.length ?? 0}</span>
        <span>차지한 칸 수: {totalCells}</span>
        <span>
          마지막 갱신: {payload?.summary?.lastUpdatedAt
            ? new Date(payload.summary.lastUpdatedAt).toLocaleString('ko-KR')
            : '-'}
        </span>
        <button type="button" className="union-viewer-refresh" onClick={fetchData}>
          새로고침
        </button>
        <button type="button" className="union-viewer-reset-filters" onClick={resetFilters}>
          필터 초기화
        </button>
      </footer>

      {/* 우측 아래 다크모드 토글 느낌은 우측 패널 내 체크박스로 구현 */}
    </div>
  );
}
