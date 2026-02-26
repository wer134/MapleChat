// 유니온 API 및 Payload 매핑
import { getApiBase } from '../api/apiBase';
import { SHAPES } from './unionShapes';

const JOB_MAP = {
  전사: 'WARRIOR',
  마법사: 'MAGE',
  궁수: 'ARCHER',
  도적: 'THIEF',
  해적: 'PIRATE',
  제논: 'XENON',
  메이플M: 'ETC',
};
const BLOCK_TYPE_TO_JOB = {
  히어로: 'WARRIOR', 팔라딘: 'WARRIOR', 다크나이트: 'WARRIOR', 아란: 'WARRIOR', 소울마스터: 'WARRIOR', 미하일: 'WARRIOR', 데몬슬레이어: 'WARRIOR', 데몬어벤저: 'WARRIOR', 카이저: 'WARRIOR', 제로: 'WARRIOR', 블래스터: 'WARRIOR', 아델: 'WARRIOR', 일리움: 'WARRIOR', 라라: 'WARRIOR', 모험가전사: 'WARRIOR', 전사: 'WARRIOR',
  아크메이지: 'MAGE', 비숍: 'MAGE', 플레임위자드: 'MAGE', 배틀메이지: 'MAGE', 루미너스: 'MAGE', 키네시스: 'MAGE', 라이딩: 'MAGE', 모험가마법사: 'MAGE', 마법사: 'MAGE',
  보우마스터: 'ARCHER', 신궁: 'ARCHER', 패스파인더: 'ARCHER', 윈드브레이커: 'ARCHER', 와일드헌터: 'ARCHER', 메르세데스: 'ARCHER', 카인: 'ARCHER', 모험가궁수: 'ARCHER', 궁수: 'ARCHER',
  나이트로드: 'THIEF', 섀도어: 'THIEF', 듀얼블레이더: 'THIEF', 나이트워커: 'THIEF', 팬텀: 'THIEF', 카데나: 'THIEF', 호영: 'THIEF', 모험가도적: 'THIEF', 도적: 'THIEF',
  캡틴: 'PIRATE', 바이퍼: 'PIRATE', 캐논마스터: 'PIRATE', 스트라이커: 'PIRATE', 메카닉: 'PIRATE', 은월: 'PIRATE', 엔젤릭버스터: 'PIRATE', 모험가해적: 'PIRATE', 해적: 'PIRATE',
  제논: 'XENON',
  메이플M: 'ETC', 모험가: 'ETC', 기타: 'ETC',
};
const DEFAULT_JOB = 'ETC';
const DEFAULT_RANK = 'S';

function toJobGroup(blockClass, blockTypeFallback) {
  if (blockClass) {
    const s = String(blockClass).trim();
    const fromClass = JOB_MAP[s];
    if (fromClass) return fromClass;
  }
  if (blockTypeFallback) {
    const t = String(blockTypeFallback).trim();
    if (BLOCK_TYPE_TO_JOB[t]) return BLOCK_TYPE_TO_JOB[t];
    for (const [name, job] of Object.entries(BLOCK_TYPE_TO_JOB)) {
      if (t.startsWith(name)) return job;
    }
  }
  return DEFAULT_JOB;
}

function toRank(blockLevel) {
  if (blockLevel == null) return DEFAULT_RANK;
  const l = Number(blockLevel);
  if (l >= 250) return 'SSS';
  if (l >= 200) return 'SS';
  if (l >= 140) return 'S';
  if (l >= 100) return 'A';
  return 'B';
}

const UNION_LEVEL_MIN = 500;
const UNION_LEVEL_MAX = 12500;
const GRID_SIZE_MIN = { width: 18, height: 12 };
const GRID_SIZE_MAX = { width: 36, height: 24 };

function getGridSizeByUnionLevel(unionLevel) {
  const level = Number(unionLevel);
  if (!Number.isFinite(level) || level <= UNION_LEVEL_MIN) {
    return { width: GRID_SIZE_MIN.width, height: GRID_SIZE_MIN.height };
  }
  if (level >= UNION_LEVEL_MAX) {
    return { width: GRID_SIZE_MAX.width, height: GRID_SIZE_MAX.height };
  }
  const t = (level - UNION_LEVEL_MIN) / (UNION_LEVEL_MAX - UNION_LEVEL_MIN);
  const width = Math.round(
    GRID_SIZE_MIN.width + t * (GRID_SIZE_MAX.width - GRID_SIZE_MIN.width)
  );
  const height = Math.round(
    GRID_SIZE_MIN.height + t * (GRID_SIZE_MAX.height - GRID_SIZE_MIN.height)
  );
  return { width, height };
}

function apiToGrid(apiX, apiY, centerX, centerY) {
  const gx = centerX + (Number(apiX) || 0);
  const gy = centerY - (Number(apiY) ?? 0); // y 반전
  return { gx, gy };
}

export function mapToUnionPayload(unionRes, raiderRes, characterName) {
  const unionLevel = Number(unionRes?.union_level ?? unionRes?.unionLevel ?? 0);
  const gridSize = getGridSizeByUnionLevel(unionLevel);
  const centerX = Math.floor(gridSize.width / 2);
  const centerY = Math.floor(gridSize.height / 2);

  const presetNo = Number(raiderRes?.use_preset_no ?? raiderRes?.usePresetNo ?? 1);
  const presetKey = `union_raider_preset_${presetNo}`;
  const presetKeyCamel = `unionRaiderPreset${presetNo}`;
  const preset = raiderRes?.[presetKey] ?? raiderRes?.[presetKeyCamel] ?? null;
  const rawBlocks = preset?.union_block ?? preset?.unionBlock ?? [];

  const blocks = [];
  const characterIdSet = new Set();
  const characters = [];

  rawBlocks.forEach((raw, index) => {
    const blockClass = raw.block_class ?? raw.blockClass;
    const blockType = raw.block_type ?? raw.blockType;
    const blockLevel = raw.block_level ?? raw.blockLevel;
    const blockPosition = raw.block_position ?? raw.blockPosition ?? [];
    const controlPoint = raw.block_control_point ?? raw.blockControlPoint;

    const jobGroup = toJobGroup(blockClass, blockType);
    const rank = toRank(blockLevel);

    const anchorFromPos = blockPosition[0];
    const anchorFromCtrl = controlPoint && (controlPoint.x != null || controlPoint.y != null)
      ? { x: controlPoint.x ?? 0, y: controlPoint.y ?? 0 }
      : null;
    const anchor = anchorFromPos ?? anchorFromCtrl ?? { x: 0, y: 0 };
    const ax = Number(anchor.x) ?? 0;
    const ay = Number(anchor.y) ?? 0;

    const { gx: blockGx, gy: blockGy } = apiToGrid(ax, ay, centerX, centerY);

    let shapeCells = blockPosition.map((p) => {
      const px = Number(p.x) ?? 0;
      const py = Number(p.y) ?? 0;
      return {
        x: px - ax,
        y: ay - py,
      };
    });

    if (shapeCells.length === 0 && SHAPES[rank]?.[jobGroup]) {
      shapeCells = (SHAPES[rank][jobGroup] || []).map((c) => ({ ...c }));
    }

    const blockId = `block-${index}-${characterName}`;
    const charId = `char-${blockId}`;
    characterIdSet.add(charId);

    blocks.push({
      id: blockId,
      jobGroup,
      rank,
      x: blockGx,
      y: blockGy,
      rotation: 0,
      shapeCells,
      characterIds: [charId],
    });

    characters.push({
      id: charId,
      name: blockType || `블록 ${index + 1}`,
      level: Number(blockLevel) || 0,
      jobGroup,
      rank,
    });
  });

  const lastUpdatedAt = new Date().toISOString();

  return {
    summary: {
      unionLevel: unionLevel || Number(unionRes?.union_level ?? unionRes?.unionLevel ?? 0),
      totalCharacters: characters.length,
      score: undefined,
      lastUpdatedAt,
    },
    characters,
    grid: { width: gridSize.width, height: gridSize.height },
    blocks,
  };
}

export async function fetchUnionPayload(characterName) {
  const base = getApiBase();
  const name = encodeURIComponent(characterName);
  const [unionRes, raiderRes] = await Promise.all([
    fetch(`${base}/union/union?name=${name}`).then((r) => (r.ok ? r.json() : null)),
    fetch(`${base}/union/union-raider?name=${name}`).then((r) => (r.ok ? r.json() : null)),
  ]);

  if (!raiderRes) {
    throw new Error('유니온 공격대 정보를 불러올 수 없습니다.');
  }

  return mapToUnionPayload(unionRes || {}, raiderRes, characterName);
}
