// 캐릭터 검색·모달 데이터 훅
import { useState, useCallback } from 'react';
import {
  fetchBasic,
  fetchEquipment,
  fetchAndroidEquipment,
  fetchAbility,
  fetchPropensity,
  fetchStat,
  fetchHyperStat,
} from '../api/characterApi';

export function useCharacterData(addToHistory) {
  const [characterName, setCharacterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [characterInfo, setCharacterInfo] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState({
    equipment: null,
    position: null,
    pinned: false,
  });
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isUnionViewerOpen, setIsUnionViewerOpen] = useState(false);
  const [isBlackWhite, setIsBlackWhite] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });

  const [equipmentInfo, setEquipmentInfo] = useState(null);
  const [equipmentError, setEquipmentError] = useState(false);
  const [androidInfo, setAndroidInfo] = useState(null);
  const [abilityInfo, setAbilityInfo] = useState(null);
  const [abilityError, setAbilityError] = useState(false);
  const [propensityInfo, setPropensityInfo] = useState(null);
  const [propensityError, setPropensityError] = useState(false);
  const [statInfo, setStatInfo] = useState(null);
  const [statError, setStatError] = useState(false);
  const [hyperStatInfo, setHyperStatInfo] = useState(null);
  const [hyperStatError, setHyperStatError] = useState(false);

  const clearForNewSearch = useCallback(() => {
    setError(null);
    setCharacterInfo(null);
    setActiveTooltip({ equipment: null, position: null, pinned: false });
    setIsStatModalOpen(false);
    setIsEquipmentModalOpen(false);
    setEquipmentInfo(null);
    setEquipmentError(false);
    setAndroidInfo(null);
    setAbilityInfo(null);
    setAbilityError(false);
    setPropensityInfo(null);
    setPropensityError(false);
    setStatInfo(null);
    setStatError(false);
    setHyperStatInfo(null);
    setHyperStatError(false);
  }, []);

  // eslint-disable-next-line no-unused-vars -- used in return, consumed by App.js
  const goHome = useCallback(() => {
    clearForNewSearch();
    setLoading(false);
  }, [clearForNewSearch]);

  const toggleBlackWhite = useCallback(() => {
    setIsBlackWhite((prev) => !prev);
  }, []);

  const handleSearch = useCallback(
    async (nameOverride) => {
      const searchName = (nameOverride ?? characterName).trim();
      if (!searchName) {
        setError('Please enter a character name');
        return;
      }

      setLoading(true);
      clearForNewSearch();

      try {
        const basicData = await fetchBasic(searchName);
        setCharacterInfo(basicData);
        addToHistory(searchName);

        const nameParam = searchName;

        const [equipmentRes, androidRes, abilityRes, propensityRes, statRes, hyperStatRes] =
          await Promise.all([
            fetchEquipment(nameParam).then((d) => ({ ok: true, data: d })).catch(() => ({ ok: false })),
            fetchAndroidEquipment(nameParam),
            fetchAbility(nameParam).then((d) => ({ ok: true, data: d })).catch(() => ({ ok: false })),
            fetchPropensity(nameParam).then((d) => ({ ok: true, data: d })).catch(() => ({ ok: false })),
            fetchStat(nameParam).then((d) => ({ ok: true, data: d })).catch(() => ({ ok: false })),
            fetchHyperStat(nameParam).then((d) => ({ ok: true, data: d })).catch(() => ({ ok: false })),
          ]);

        if (equipmentRes.ok) {
          setEquipmentInfo(equipmentRes.data);
        } else {
          setEquipmentError(true);
        }
        setAndroidInfo(androidRes);

        if (abilityRes.ok) {
          setAbilityInfo(abilityRes.data);
        } else {
          setAbilityError(true);
        }
        if (propensityRes.ok) {
          setPropensityInfo(propensityRes.data);
        } else {
          setPropensityError(true);
        }
        if (statRes.ok) {
          setStatInfo(statRes.data);
        } else {
          setStatError(true);
        }
        if (hyperStatRes.ok) {
          setHyperStatInfo(hyperStatRes.data);
        } else {
          setHyperStatError(true);
        }
      } catch (err) {
        setError(err.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    },
    [characterName, addToHistory, clearForNewSearch]
  );

  const retryStat = useCallback(async () => {
    if (!characterInfo) return;
    setStatError(false);
    try {
      const data = await fetchStat(characterInfo.character_name);
      setStatInfo(data);
    } catch {
      setStatError(true);
    }
  }, [characterInfo]);

  const retryHyperStat = useCallback(async () => {
    if (!characterInfo) return;
    setHyperStatError(false);
    try {
      const data = await fetchHyperStat(characterInfo.character_name);
      setHyperStatInfo(data);
    } catch {
      setHyperStatError(true);
    }
  }, [characterInfo]);

  const retryAbility = useCallback(async () => {
    if (!characterInfo) return;
    setAbilityError(false);
    try {
      const data = await fetchAbility(characterInfo.character_name);
      setAbilityInfo(data);
    } catch {
      setAbilityError(true);
    }
  }, [characterInfo]);

  const retryPropensity = useCallback(async () => {
    if (!characterInfo) return;
    setPropensityError(false);
    try {
      const data = await fetchPropensity(characterInfo.character_name);
      setPropensityInfo(data);
    } catch {
      setPropensityError(true);
    }
  }, [characterInfo]);

  const retryEquipment = useCallback(async () => {
    if (!characterInfo) return;
    setEquipmentError(false);
    try {
      const data = await fetchEquipment(characterInfo.character_name);
      setEquipmentInfo(data);
    } catch {
      setEquipmentError(true);
    }
  }, [characterInfo]);

  return {
    characterName,
    setCharacterName,
    loading,
    error,
    characterInfo,
    activeTooltip,
    setActiveTooltip,
    isStatModalOpen,
    setIsStatModalOpen,
    isEquipmentModalOpen,
    setIsEquipmentModalOpen,
    isUnionViewerOpen,
    setIsUnionViewerOpen,
    equipmentInfo,
    equipmentError,
    androidInfo,
    abilityInfo,
    abilityError,
    propensityInfo,
    propensityError,
    statInfo,
    statError,
    hyperStatInfo,
    hyperStatError,
    handleSearch,
    goHome,
    isBlackWhite,
    toggleBlackWhite,
    retryStat,
    retryHyperStat,
    retryAbility,
    retryPropensity,
    retryEquipment,
  };
}
