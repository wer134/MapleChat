// 표(6행×7열) + 병합 구조: 셀마다 row/col, 필요 시 rowSpan/colSpan
export const equipmentCells = [
  // --- Left (C1~C2) ---
  { type: 'slot', row: 1, col: 1, label: 'Ring I', slot: '반지', slotIndex: 1 },
  { type: 'slot', row: 1, col: 2, label: 'Face', slot: '얼굴장식' },

  { type: 'slot', row: 2, col: 1, label: 'Ring II', slot: '반지', slotIndex: 2 },
  { type: 'slot', row: 2, col: 2, label: 'Eye', slot: '눈장식' },

  { type: 'slot', row: 3, col: 1, label: 'Ring III', slot: '반지', slotIndex: 3 },
  { type: 'slot', row: 3, col: 2, label: 'Ear', slot: '귀고리' },

  { type: 'slot', row: 4, col: 1, label: 'Ring IV', slot: '반지', slotIndex: 4 },
  { type: 'slot', row: 4, col: 2, label: 'Pendant 1', slot: '펜던트', slotIndex: 1 },

  { type: 'slot', row: 5, col: 1, label: 'Belt', slot: '벨트' },
  { type: 'slot', row: 5, col: 2, label: 'Pendant 2', slot: '펜던트', slotIndex: 2 },

  { type: 'slot', row: 6, col: 1, label: 'Pocket', slot: '포켓아이템' },
  { type: 'empty', row: 6, col: 2 },

  // --- Center preview merged (R1~R4, C3~C4) ---
  { type: 'preview', row: 1, col: 3, rowSpan: 4, colSpan: 3 },

  // --- Under preview row (R5, C3~C5) ---
  { type: 'slot', row: 5, col: 3, label: 'Weapon', slot: '무기' },
  { type: 'slot', row: 5, col: 4, label: 'Sub', slot: '보조무기' },
  { type: 'slot', row: 5, col: 5, label: 'Emblem', slot: '엠블렘' },

  // --- Bottom merged empty area (R6, C3~C5) ---
  { type: 'mergedEmpty', row: 6, col: 3, rowSpan: 1, colSpan: 3 },

  // --- Right (C6~C7) ---
  { type: 'slot', row: 1, col: 6, label: 'Hat', slot: '모자' },
  { type: 'slot', row: 1, col: 7, label: 'Cape', slot: '망토' },

  { type: 'slot', row: 2, col: 6, label: 'Top', slot: '상의' },
  { type: 'slot', row: 2, col: 7, label: 'Glove', slot: '장갑' },

  { type: 'slot', row: 3, col: 6, label: 'Bottom', slot: '하의' },
  { type: 'slot', row: 3, col: 7, label: 'Shoe', slot: '신발' },

  { type: 'slot', row: 4, col: 6, label: 'Shoulder', slot: '어깨장식' },
  { type: 'slot', row: 4, col: 7, label: 'Medal', slot: '훈장' },

  { type: 'slot', row: 5, col: 6, label: 'Android', slot: '안드로이드' },
  { type: 'slot', row: 5, col: 7, label: 'Heart', slot: '기계심장' },

  { type: 'empty', row: 6, col: 6 },
  { type: 'slot', row: 6, col: 7, label: 'Badge', slot: '뱃지' },
];
