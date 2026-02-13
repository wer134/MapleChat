// 검색 기록 훅 (localStorage)
import { useState, useCallback } from 'react';

const SEARCH_HISTORY_KEY = 'maplechat_search_history';
const MAX_SEARCH_HISTORY = 10;

function loadSearchHistory() {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState(loadSearchHistory);

  const addToHistory = useCallback((name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const next = [trimmed, ...prev.filter((n) => n !== trimmed)].slice(0, MAX_SEARCH_HISTORY);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromHistory = useCallback((index) => {
    setSearchHistory((prev) => {
      const next = prev.filter((_, i) => i !== index);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { searchHistory, addToHistory, removeFromHistory };
}
