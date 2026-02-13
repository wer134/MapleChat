// 직업군·레어리티·스타포스 등 게임 로직
export const getJobCategory = (jobName) => {
  const jobMap = {
    '히어로': '전사', '팔라딘': '전사', '다크나이트': '전사', '소울마스터': '전사',
    '미하일': '전사', '블래스터': '전사', '데몬슬레이어': '전사', '데몬어벤져': '전사',
    '아란': '전사', '카이저': '전사', '제로': '전사', '아델': '전사',
    
    '비숍': '마법사', '아크메이지(불,독)': '마법사', '아크메이지(썬,콜)': '마법사',
    '플레임위자드': '마법사', '배틀메이지': '마법사', '에반': '마법사',
    '루미너스': '마법사', '일리움': '마법사', '라라': '마법사', '키네시스': '마법사',
    '보우마스터': '궁수', '신궁': '궁수', '패스파인더': '궁수', '윈드브레이커': '궁수',
    '와일드헌터': '궁수', '메르세데스': '궁수', '카인': '궁수',
    '나이트로드': '도적', '섀도어': '도적', '듀얼블레이드': '도적', '나이트워커': '도적',
    '팬텀': '도적', '카데나': '도적', '칼리': '도적', '호영': '도적',
    '바이퍼': '해적', '캡틴': '해적', '캐논슈터': '해적', '스트라이커': '해적',
    '은월': '해적', '메카닉': '해적', '제논': '해적', '엔젤릭버스터': '해적', '아크': '해적',
  };
  return jobMap[jobName] || '전 직업';
};

export const getMaxStarforce = (equipment) => {
  if (equipment.amazing_scroll_flag === '사용') {
    return 15;
  }
  const baseLevel = parseInt(equipment.item_base_option?.base_equipment_level) || 0;
  if(baseLevel >= 138) return 30;
  if(baseLevel >= 128) return 20;
  if(baseLevel >= 118) return 15;
  if(baseLevel >= 108) return 10;
  if(baseLevel >= 95) return 8;
  return 5;
};

export const getRarityColor = (grade) => {
  const colors = {
    '레어': '#66FFFF',
    '에픽': '#9966FF',
    '유니크': '#FFCC00',
    '레전드리': '#CCFF00'
  };
  return colors[grade] || null;
};

export const getRarityInitial = (grade) => {
  const initials = {
    '레어': 'R',
    '에픽': 'E',
    '유니크': 'U',
    '레전드리': 'L'
  };
  return initials[grade] || '';
};