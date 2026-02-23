// 길드 검색: 캐릭터 검색창과 동일한 크기/스타일, 길드명 + 월드 드롭다운(한 번에 5개, 휠 스크롤) + 검색
import React, { useState, useRef, useEffect } from 'react';

const WORLD_OPTIONS = [
  '스카니아', '베라', '루나', '제니스', '크로아', '유니온', '엘리시움', '이노시스',
  '레드', '오로라', '아케인', '노바', '에오스', '챌린저스', '핼리오스',
];

export default function GuildSearchBox({ onSearch, loading }) {
  const [guildName, setGuildName] = useState('');
  const [worldName, setWorldName] = useState(WORLD_OPTIONS[0] || '');
  const [worldDropdownOpen, setWorldDropdownOpen] = useState(false);
  const worldDropdownRef = useRef(null);

  useEffect(() => {
    if (!worldDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (worldDropdownRef.current && !worldDropdownRef.current.contains(e.target)) {
        setWorldDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [worldDropdownOpen]);

  const handleSubmit = () => {
    const g = guildName.trim();
    const w = worldName.trim();
    if (g && w) onSearch(g, w);
  };

  const selectWorld = (w) => {
    setWorldName(w);
    setWorldDropdownOpen(false);
  };

  return (
    <div className="guild-search-wrap">
      <div className="search-box guild-search-box">
        <div className="search-input-wrap guild-search-inputs">
          <input
            type="text"
            className="guild-search-input"
            placeholder="길드명"
            value={guildName}
            onChange={(e) => setGuildName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <div className="guild-world-dropdown" ref={worldDropdownRef}>
            <button
              type="button"
              className="guild-search-world-trigger"
              onClick={() => setWorldDropdownOpen((o) => !o)}
              aria-expanded={worldDropdownOpen}
              aria-haspopup="listbox"
              aria-label="월드 선택"
            >
              {worldName}
              <span className="guild-world-dropdown-arrow" aria-hidden>▼</span>
            </button>
            {worldDropdownOpen && (
              <ul
                className="guild-world-dropdown-list"
                role="listbox"
                aria-label="월드 목록"
              >
                {WORLD_OPTIONS.map((w) => (
                  <li
                    key={w}
                    role="option"
                    aria-selected={w === worldName}
                    className={w === worldName ? 'selected' : ''}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectWorld(w)}
                  >
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <button
          type="button"
          className="guild-search-btn"
          onClick={handleSubmit}
          disabled={loading || !guildName.trim()}
        >
          {loading ? '검색 중...' : '검색'}
        </button>
      </div>
    </div>
  );
}
