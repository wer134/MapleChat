// 캐릭터명 검색 입력 + 최근 검색 드롭다운
import React, { useState } from 'react';

export default function SearchBox({
  value,
  onChange,
  onSearch,
  loading,
  searchHistory = [],
  onRemoveHistoryItem,
}) {
  const [showHistory, setShowHistory] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  const handleHistorySelect = (name) => {
    onChange(name);
    setShowHistory(false);
    onSearch(name);
  };

  return (
    <div className="search-box">
      <div className="search-input-wrap">
        <input
          type="text"
          placeholder="Enter character name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowHistory(true)}
          onBlur={() => setTimeout(() => setShowHistory(false), 200)}
        />
        {showHistory && searchHistory.length > 0 && (
          <ul className="search-history">
            {searchHistory.map((name, i) => (
              <li key={`${name}-${i}`} onMouseDown={(e) => e.preventDefault()}>
                <span
                  className="search-history-text"
                  onClick={() => handleHistorySelect(name)}
                >
                  {name}
                </span>
                <button
                  type="button"
                  className="search-history-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveHistoryItem(i);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  title="삭제"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={() => onSearch()} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
}
