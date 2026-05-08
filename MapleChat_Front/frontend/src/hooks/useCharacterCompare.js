import { useCallback, useMemo, useState } from 'react';
import { fetchBasic, fetchEquipment, fetchStat } from '../api/characterApi';

function createInitialState() {
  return {
    characterName: '',
    characterInfo: null,
    statInfo: null,
    equipmentInfo: null,
    loading: false,
    error: null,
  };
}

function useCompareSide() {
  const [state, setState] = useState(createInitialState);

  const setCharacterName = useCallback((name) => {
    setState((prev) => ({ ...prev, characterName: name }));
  }, []);

  const search = useCallback(async (nameOverride) => {
    const searchName = (nameOverride ?? state.characterName).trim();
    if (!searchName) {
      setState((prev) => ({ ...prev, error: 'Please enter a character name' }));
      return;
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      characterInfo: null,
      statInfo: null,
      equipmentInfo: null,
    }));

    try {
      const basic = await fetchBasic(searchName);
      const [statResult, equipmentResult] = await Promise.allSettled([
        fetchStat(searchName),
        fetchEquipment(searchName),
      ]);

      setState((prev) => ({
        ...prev,
        characterInfo: basic,
        statInfo: statResult.status === 'fulfilled' ? statResult.value : null,
        equipmentInfo:
          equipmentResult.status === 'fulfilled' ? equipmentResult.value : null,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err?.message || 'Search failed',
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [state.characterName]);

  return useMemo(
    () => ({
      characterInfo: state.characterInfo,
      statInfo: state.statInfo,
      equipmentInfo: state.equipmentInfo,
      loading: state.loading,
      error: state.error,
      search,
      characterName: state.characterName,
      setCharacterName,
    }),
    [search, setCharacterName, state]
  );
}

export function useCharacterCompare() {
  const left = useCompareSide();
  const right = useCompareSide();
  return { left, right };
}
