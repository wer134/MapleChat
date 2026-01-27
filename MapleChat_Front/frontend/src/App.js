import React, { useState } from 'react';
import './App.css';
import 노바 from './worldicon/노바.png';
import 레드 from './worldicon/레드.png';
import 루나 from './worldicon/루나.png';
import 베라 from './worldicon/베라.png';
import 스카니아 from './worldicon/스카니아.png';
import 아케인 from './worldicon/아케인.png';
import 에오스 from './worldicon/에오스.png';
import 엘리시움 from './worldicon/엘리시움.png';
import 오로라 from './worldicon/오로라.png';
import 유니온 from './worldicon/유니온.png';
import 이노시스 from './worldicon/이노시스.png';
import 제니스 from './worldicon/제니스.png';
import 챌린저스 from './worldicon/챌린저스.png';
import 크로아 from './worldicon/크로아.png';
import 핼리오스 from './worldicon/핼리오스.png';

// 장비 툴팁 컴포넌트
const EquipmentTooltip = ({ equipment, position, isPinned, onClose, characterClass }) => {
  const tooltipRef = React.useRef(null);
  const [adjustedPos, setAdjustedPos] = React.useState({ x: -9999, y: -9999 });
  const getJobCategory = (jobName) => {
    const jobMap = {
      // 전사
      '히어로': '전사',
      '팔라딘': '전사',
      '다크나이트': '전사',
      '소울마스터': '전사',
      '미하일': '전사',
      '블래스터': '전사',
      '데몬슬레이어': '전사',
      '데몬어벤져': '전사',
      '아란': '전사',
      '카이저': '전사',
      '제로': '전사',
      '아델': '전사',
      
      // 마법사
      '비숍': '마법사',
      '아크메이지(불,독)': '마법사',
      '아크메이지(썬,콜)': '마법사',
      '플레임위자드': '마법사',
      '배틀메이지': '마법사',
      '에반': '마법사',
      '루미너스': '마법사',
      '일리움': '마법사',
      '라라': '마법사',
      '키네시스': '마법사',
      
      // 궁수
      '보우마스터': '궁수',
      '신궁': '궁수',
      '패스파인더': '궁수',
      '윈드브레이커': '궁수',
      '와일드헌터': '궁수',
      '메르세데스': '궁수',
      '카인': '궁수',
      
      // 도적
      '나이트로드': '도적',
      '섀도어': '도적',
      '듀얼블레이드': '도적',
      '나이트워커': '도적',
      '팬텀': '도적',
      '카데나': '도적',
      '칼리': '도적',
      '호영': '도적',
      
      // 해적
      '바이퍼': '해적',
      '캡틴': '해적',
      '캐논슈터': '해적',
      '스트라이커': '해적',
      '은월': '해적',
      '메카닉': '해적',
      '제논': '해적',
      '엔젤릭버스터': '해적',
      '아크': '해적',
      
    };
    return jobMap[jobName] || '전 직업';
  };

  const formatExpireDate = (dateStr) => {
    if (!dateStr || dateStr === 'null' || dateStr === '') return null;
    if (dateStr === 'expired') return '만료됨';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      
      return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분 (연장 불가)`;
    } catch (e) {
      return dateStr;
    }
  };
  React.useLayoutEffect(() => {
    if (tooltipRef.current && position) {
      const { innerWidth, innerHeight } = window;
      const { offsetWidth, offsetHeight } = tooltipRef.current;
      
      let x = position.x;
      let y = position.y;

      // 오른쪽 화면 밖으로 나가는 경우
      if (x + offsetWidth > innerWidth) {
        x = x - offsetWidth - 20;
      }

      // 아래쪽 화면 밖으로 나가는 경우
      if (y + offsetHeight > innerHeight) {
        y = y - offsetHeight - 20;
      }

      // 위쪽 화면 밖으로 나가는 경우
      if (y < 0) {
        y = 10;
      }

      setAdjustedPos({ x, y });
    }
  }, [position, equipment]);

  if (!equipment) return null;

  const starforce = parseInt(equipment.starforce) || 0;

  const getMaxStarforce = () => {
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

  const maxStarforce = getMaxStarforce();
  const goldStars = starforce;
  const greyStars = Math.max(0, maxStarforce - starforce);

  const getRarityColor = (grade) => {
    const colors = {
      '레어': '#66FFFF',
      '에픽': '#9966FF',
      '유니크': '#FFCC00',
      '레전드리': '#CCFF00'
    };
    return colors[grade] || '#FFFFFF';
  };

  const getRarityInitial = (grade) => {
    const initials = {
      '레어': 'R',
      '에픽': 'E',
      '유니크': 'U',
      '레전드리': 'L'
    };
    return initials[grade] || '';
  };

  const rarityColor = getRarityColor(equipment.potential_option_grade);
  const additionalRarityColor = getRarityColor(equipment.additional_potential_option_grade);
  const isLimitedTime = formatExpireDate(equipment.date_expire) !== null;

  const renderStarforce = () => {
    const allStars = [];
    const isAmazing = equipment.amazing_scroll_flag === '사용';
    for (let i = 0; i < goldStars; i++) {
      allStars.push(isAmazing ? 'blue' : 'gold');
    }
    for (let i = 0; i < greyStars; i++) {
      allStars.push('grey');
    }

    // 5개씩 묶기
    const starGroups = [];
    for (let i = 0; i < allStars.length; i += 5) {
      starGroups.push(allStars.slice(i, i + 5));
    }

    // 3묶음씩 한 줄에 배치
    const rows = [];
    for (let i = 0; i < starGroups.length; i += 3) {
      rows.push(starGroups.slice(i, i + 3));
    }

    return (
      <div className="starforce-stars-container">
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="star-row">
            {row.map((group, groupIndex) => (
              <div key={`group-${rowIndex}-${groupIndex}`} className="star-group">
                {group.map((type, starIndex) => (
                  <span key={`star-${rowIndex}-${groupIndex}-${starIndex}`} className={`star ${type}`}>★</span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderStat = (label, key) => {
    const total = parseInt(equipment.item_total_option?.[key] || 0);
    if (total === 0) return null;

    const base = parseInt(equipment.item_base_option?.[key] || 0);
    const add = parseInt(equipment.item_add_option?.[key] || 0);
    const etc = parseInt(equipment.item_etc_option?.[key] || 0);
    const starforce = parseInt(equipment.item_starforce_option?.[key] || 0);

    const hasBonus = add > 0 || etc > 0 || starforce > 0;

    return (
      <div className="stat-line" key={key}>
        {label}: <span className="stat-value">+{total}</span>
        {hasBonus && (
          <span className="stat-breakdown">
            ({base}
            {starforce > 0 && <span className="stat-starforce"> +{starforce}</span>}
            {etc > 0 && <span className="stat-etc"> +{etc}</span>}
            {add > 0 && <span className="stat-add"> +{add}</span>}
            )
          </span>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={tooltipRef}
      className={`equipment-tooltip ${isPinned ? 'pinned' : ''}`}
      style={{
        left: adjustedPos.x,
        top: adjustedPos.y
      }}
    >
      {isPinned && (
        <button onClick={onClose} className="tooltip-close-button">×</button>
      )}
      {/* 스타포스 별 표시 */}
      {renderStarforce()}
      {/* 아이템 이름 */}
      <div className="item-name">
        {equipment.item_name} {equipment.scroll_upgrade && parseInt(equipment.scroll_upgrade) > 0 && `(+${equipment.scroll_upgrade})`}
      </div>
      {formatExpireDate(equipment.date_expire) && (
        <div className="item-trade-info" style={{ color: '#ff9933' }}>
          유효 기간 : {formatExpireDate(equipment.date_expire)}
        </div>
      )}

      <div className="tooltip-divider"></div>

{/* 아이템 아이콘 및  정보 */}
<div className="item-header">
  {equipment.item_icon && (
    <img src={equipment.item_icon} alt={equipment.item_name} className="item-icon" />
  )}
  <div className="item-info">
    <div className="item-category">장비 분류</div>
    <div className="item-job-req">{equipment.item_equipment_part || equipment.item_equipment_slot}</div>
    <div className="item-category">장착 직업</div>
    <div className="item-job-req">{getJobCategory(characterClass)}</div>
    <div className="item-category">요구 레벨</div>
    <div className="item-level-req">
      {equipment.item_total_option?.equipment_level_decrease > 0 ? (
        <>
          Lv. {equipment.item_base_option?.base_equipment_level - equipment.item_total_option?.equipment_level_decrease} ({equipment.item_base_option?.base_equipment_level} - {equipment.item_total_option?.equipment_level_decrease})
        </>
      ) : (
        <>Lv. {equipment.item_base_option?.base_equipment_level || 0}</>
      )}
    </div>
  </div>
</div>

      <div className="tooltip-divider"></div>


      {/* 스탯 정보 */}
      {(equipment.item_total_option || equipment.scroll_upgradeable_count || (parseInt(equipment.scroll_upgrade || 0) > 0 || parseInt(equipment.scroll_resilience_count || 0) > 0)) && (
        <div className="item-stats">
          {equipment.item_total_option && (
            <>
              {renderStat('STR', 'str')}
              {renderStat('DEX', 'dex')}
              {renderStat('INT', 'int')}
              {renderStat('LUK', 'luk')}
              {renderStat('최대 HP', 'max_hp')}
              {renderStat('공격력', 'attack_power')}
              {renderStat('마력', 'magic_power')}
              {renderStat('방어력', 'armor')}
              {renderStat('이동속도', 'speed')}
              {renderStat('점프력', 'jump')}
              {equipment.item_total_option?.equipment_level_decrease > 0 && (
                <div className="stat-line">
                  <span className="stat-label">착용 가능 레벨:</span>
                  <span className="stat-value"> -{equipment.item_total_option.equipment_level_decrease}</span>
                </div>
              )}
            </>
          )}
          {(parseInt(equipment.scroll_upgrade || 0) > 0 || parseInt(equipment.scroll_resilience_count || 0) > 0) && (
            <div className="upgrade-info">
              주문서 강화 {parseInt(equipment.scroll_upgrade || 0) + parseInt(equipment.scroll_resilience_count || 0)}회 (성공 {equipment.scroll_upgrade || 0}회, 실패 {equipment.scroll_resilience_count || 0}회)
            </div>
          )}
          {equipment.golden_hammer_flag === '적용' && (
            <div className="upgrade-info">황금 망치 제련 적용</div>
          )}
          {parseInt(equipment.cuttable_count) > 0 && (
            <div className="upgrade-info">가위 사용 가능 횟수 : {parseInt(equipment.cuttable_count) === 255 ? 0 : equipment.cuttable_count}회</div>
          )}
          {equipment.scroll_upgradeable_count && (
            <div className="upgrade-info">
              업그레이드 가능 횟수: {equipment.scroll_upgradeable_count}
            </div>
          )}
        </div>
      )}

      {/* 잠재능력 */}
      {equipment.potential_option_grade && (
        <>
          <div className="tooltip-divider"></div>
          <div className="potential-header" style={{ color: rarityColor }}>
            <span className="potential-icon" style={{ backgroundColor: rarityColor, color: '#000'}}>{
            getRarityInitial(equipment.potential_option_grade)}
            </span> 잠재능력 : {equipment.potential_option_grade}{isLimitedTime && <span style={{ color: '#aaa' }}> (추가 강화 불가)</span>}
          </div>
          {equipment.potential_option_1 && (
            <div className="potential-option">{equipment.potential_option_1}</div>
          )}
          {equipment.potential_option_2 && (
            <div className="potential-option">{equipment.potential_option_2}</div>
          )}
          {equipment.potential_option_3 && (
            <div className="potential-option">{equipment.potential_option_3}</div>
          )}
        </>
      )}

      {isLimitedTime && (
        <>
          <div className="tooltip-divider"></div>
          <div className="potential-header additional" style={{ color: '#aaa' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '12px',
              height: '12px',
              backgroundColor: '#333',
              borderRadius: '3px',
              marginRight: '5px',
              border: '1px solid #000',
              verticalAlign: 'middle'
            }}>
              <span style={{
                width: '4px',
                height: '4px',
                backgroundColor: '#aaa',
                borderRadius: '50%'
              }}></span>
            </span>
            에디셔널 잠재능력 : 강화 불가
          </div>
        </>
      )}

      {/* 에디셔널 잠재능력 */}
      {equipment.additional_potential_option_grade && (
        <>
          <div className="tooltip-divider"></div>
          <div className="potential-header additional" style={{ color: additionalRarityColor }}>
            <span className="potential-icon" style={{ background: additionalRarityColor, color: '#000'}}>{
            getRarityInitial(equipment.additional_potential_option_grade)}
            </span> 에디셔널 잠재능력 : {equipment.additional_potential_option_grade}
          </div>
          {equipment.additional_potential_option_1 && (
            <div className="potential-option">{equipment.additional_potential_option_1}</div>
          )}
          {equipment.additional_potential_option_2 && (
            <div className="potential-option">{equipment.additional_potential_option_2}</div>
          )}
          {equipment.additional_potential_option_3 && (
            <div className="potential-option">{equipment.additional_potential_option_3}</div>
          )}
        </>
      )}

      {/* 소울 웨폰 */}
      {equipment.soul_name && (
        <>
          <div className="tooltip-divider"></div>
          <div className="potential-header soul-weapon" style={{ color: '#FFFF66' }}>
            <span className="potential-icon" style={{ backgroundColor: '#FFFF66', color: '#000' }}>S</span> 소울 웨폰
          </div>
          <div className="potential-option">{equipment.soul_name}</div>
          {equipment.soul_option && (
            <div className="potential-option">{equipment.soul_option}</div>
          )}
        </>
      )}
    </div>
  );
};



function App() {
  const [characterName, setCharacterName] = useState('');
  const [characterInfo, setCharacterInfo] = useState(null);
  const [equipmentInfo, setEquipmentInfo] = useState(null);
  const [abilityInfo, setAbilityInfo] = useState(null);
  const [propensityInfo, setPropensityInfo] = useState(null);
  const [statInfo, setStatInfo] = useState(null);
  const [hyperStatInfo, setHyperStatInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState({
    equipment: null,
    position: null,
    pinned: false,
  });
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [abilityError, setAbilityError] = useState(false);
  const [hyperStatError, setHyperStatError] = useState(false);
  const [propensityError, setPropensityError] = useState(false);
  const [statError, setStatError] = useState(false);

  const getRarityColor = (grade) => {
    const colors = {
      '레어': '#66FFFF',
      '에픽': '#9966FF',
      '유니크': '#FFCC00',
      '레전드리': '#CCFF00'
    };
    return colors[grade] || null;
  };

  const getWorldIcon = (worldName) => {
    const worldIconMap = {
      '노바': 노바,
      '레드': 레드,
      '루나': 루나,
      '베라': 베라,
      '스카니아': 스카니아,
      '아케인': 아케인,
      '에오스': 에오스,
      '엘리시움': 엘리시움,
      '오로라': 오로라,
      '유니온': 유니온,
      '이노시스': 이노시스,
      '제니스': 제니스,
      '챌린저스': 챌린저스,
      '크로아': 크로아,
      '핼리오스': 핼리오스
    };
    
    return worldIconMap[worldName] || null;
  };

  const retryStat = async () => {
    if (!characterInfo) return;
    setStatError(false);
    try {
      const response = await fetch(`/character/stat?name=${encodeURIComponent(characterInfo.character_name)}`);
      if (response.ok) {
        setStatInfo(await response.json());
      } else {
        setStatError(true);
      }
    } catch (error) {
      setStatError(true);
    }
  };

  const retryHyperStat = async () => {
    if (!characterInfo) return;
    setHyperStatError(false);
    try {
      const response = await fetch(`/character/hyper-stat?name=${encodeURIComponent(characterInfo.character_name)}`);
      if (response.ok) {
        setHyperStatInfo(await response.json());
      } else {
        setHyperStatError(true);
      }
    } catch (error) {
      setHyperStatError(true);
    }
  };

  const retryAbility = async () => {
    if (!characterInfo) return;
    setAbilityError(false);
    try {
      const response = await fetch(`/character/ability?name=${encodeURIComponent(characterInfo.character_name)}`);
      if (response.ok) {
        setAbilityInfo(await response.json());
      } else {
        setAbilityError(true);
      }
    } catch (error) {
      setAbilityError(true);
    }
  };

  const retryPropensity = async () => {
    if (!characterInfo) return;
    setPropensityError(false);
    try {
      const response = await fetch(`/character/propensity?name=${encodeURIComponent(characterInfo.character_name)}`);
      if (response.ok) {
        setPropensityInfo(await response.json());
      } else {
        setPropensityError(true);
      }
    } catch (error) {
      setPropensityError(true);
    }
  };

  const formatKoreanNumber = (numStr) => {
    if (!numStr) return '0';
    const num = parseInt(numStr.replace(/,/g, ''), 10);
    if (isNaN(num)) return numStr;

    if (num < 10000) return num.toLocaleString();

    const units = ['', '만', '억', '조', '경'];
    let result = '';
    let temp = num;
    let unitIndex = 0;

    while (temp > 0) {
      const part = temp % 10000;
      if (part > 0) {
        result = `${part}${units[unitIndex]} ${result}`;
      }
      temp = Math.floor(temp / 10000);
      unitIndex++;
    }

    return result.trim();
  };

  const formatStatValue = (name, value) => {
    if (name === '전투력' || name === '스탯 공격력' || name === '최소 스탯공격력' || name === '최대 스탯공격력') {
      if (value && value.includes('~')) {
        const parts = value.split('~').map(part => part.trim());
        return parts.map(formatKoreanNumber).join(' ~ ');
      }
      return formatKoreanNumber(value);
    }

    const percentStats = [
      '데미지',
      '보스 몬스터 데미지',
      '방어율 무시',
      '크리티컬 확률',
      '크리티컬 데미지',
      '아이템 드롭률',
      '메소 획득량',
      '버프 지속시간',
      '스탠스'
    ];
    if (percentStats.includes(name)) {
      return `${value}%`;
    }
    return value;
  };

  const handleSearch = async () => {
    if (!characterName.trim()) {
      setError('Please enter a character name');
      return;
    }
  
    setLoading(true);
    setError(null);
    setCharacterInfo(null);
    setEquipmentInfo(null);
    setAbilityInfo(null);
    setPropensityInfo(null);
    setStatInfo(null);
    setHyperStatInfo(null);
    setActiveTooltip({ equipment: null, position: null, pinned: false });
    setIsStatModalOpen(false);
    setIsEquipmentModalOpen(false);
    setAbilityError(false);
    setHyperStatError(false);
    setPropensityError(false);
    setStatError(false);

  try {
    // 캐릭터 이름으로 바로 기본 정보 조회
    const basicResponse = await fetch(`/character/basic?name=${encodeURIComponent(characterName)}`);
    if (!basicResponse.ok) {
      throw new Error('Character not found');
    }
    const basicData = await basicResponse.json();
    setCharacterInfo(basicData);

    // 장비 정보도 함께 가져오기
    const equipmentResponse = await fetch(`/character/equipment?name=${encodeURIComponent(characterName)}`);
    if (equipmentResponse.ok) {
      const equipmentData = await equipmentResponse.json();
      setEquipmentInfo(equipmentData);
    }

    // 어빌리티 정보 조회
    const abilityResponse = await fetch(`/character/ability?name=${encodeURIComponent(characterName)}`);
    if (abilityResponse.ok) {
      setAbilityInfo(await abilityResponse.json());
    } else {
      setAbilityError(true);
      console.error('Ability fetch failed:', abilityResponse.status);
    }

    // 성향 정보 조회
    const propensityResponse = await fetch(`/character/propensity?name=${encodeURIComponent(characterName)}`);
    if (propensityResponse.ok) {
      const data = await propensityResponse.json();
      console.log('Propensity Data:', data);
      setPropensityInfo(data);
    } else {
      setPropensityError(true);
      console.error('Propensity fetch failed:', propensityResponse.status);
    }

    // 스탯 정보 조회
    const statResponse = await fetch(`/character/stat?name=${encodeURIComponent(characterName)}`);
    if (statResponse.ok) {
      setStatInfo(await statResponse.json());
    } else {
      setStatError(true);
      console.error('Stat fetch failed:', statResponse.status);
    }

    // 하이퍼 스탯 정보 조회
    const hyperStatResponse = await fetch(`/character/hyper-stat?name=${encodeURIComponent(characterName)}`);
    if (hyperStatResponse.ok) {
      setHyperStatInfo(await hyperStatResponse.json());
    } else {
      setHyperStatError(true);
      console.error('HyperStat fetch failed:', hyperStatResponse.status);
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
};

  const slotGrid = [
    { label: 'Ring I', slot: '반지1' },
    { label: '', slot: '' },
    { label: 'Hat', slot: '모자' },
    { label: '', slot: '' },
    { label: 'Emblem', slot: '엠블렘' },

    { label: 'Ring II', slot: '반지2' },
    { label: 'Pendant', slot: '펜던트' },
    { label: 'Face', slot: '얼굴장식' },
    { label: '', slot: '' },
    { label: 'Badge', slot: '뱃지' },

    { label: 'Ring III', slot: '반지3' },
    { label: 'Pendant', slot: '펜던트2' },
    { label: 'Eye', slot: '눈장식' },
    { label: 'Ear', slot: '귀고리' },
    { label: 'Medal', slot: '훈장' },

    { label: 'Ring IV', slot: '반지4' },
    { label: 'Weapon', slot: '무기' },
    { label: 'Top', slot: '상의' },
    { label: 'Shoulder', slot: '어깨장식' },
    { label: 'Sub', slot: '보조무기' },

    { label: 'Pocket', slot: '포켓 아이템' },
    { label: 'Belt', slot: '벨트' },
    { label: 'Bottom', slot: '하의' },
    { label: 'Glove', slot: '장갑' },
    { label: 'Cape', slot: '망토' },

    { label: '', slot: '' },
    { label: 'Heart', slot: '기계심장' },
    { label: 'Shoe', slot: '신발' },
    { label: 'Android', slot: '안드로이드' },
    { label: '', slot: '' },
  ];

  return (
    <div className="App">
      <div className="container">
        <h1>MapleStory Character information</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter character name"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          {characterInfo && (
            <div className="character-info">
              <div className="character-header">
                <div className="character-image">
                  {characterInfo.character_image ? (
                    <img 
                      src={characterInfo.character_image} 
                      alt={characterInfo.character_name}
                      className="character-avatar"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className="image-placeholder" style={{display: characterInfo.character_image ? 'none' : 'block'}}>
                    캐릭터 이미지
                  </div>
                </div>
                <div className="character-details">
                  <div className="character-name">
                      {characterInfo.character_name}
                  </div>
                  <div className="character-basic">
                    <span className="world-name">
                      {getWorldIcon(characterInfo.world_name)&&(
                        <img
                        src={getWorldIcon(characterInfo.world_name)}
                        alt={characterInfo.world_name}
                        className="world-icon"
                        />
                      )}
                      {characterInfo.world_name}
                    </span>
                    <span>LV.{characterInfo.character_level}</span>
                    <span>{characterInfo.character_class}</span>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button className="action-btn" onClick={() => setIsStatModalOpen(true)}>스탯 정보</button>
                <button className="action-btn" onClick={() => setIsEquipmentModalOpen(true)}>장비 정보</button>
              </div>

              {/* 스탯, 하이퍼스탯, 어빌리티, 성향 정보 */}
              {isStatModalOpen && (
                <div className="modal-overlay" onClick={() => setIsStatModalOpen(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setIsStatModalOpen(false)}>×</button>
                    <h2>스탯 상세 정보</h2>
                    <div className="info-sections">
                {statInfo ? (
                  <div className="info-section">
                    <h3>스탯 정보</h3>
                    <div className="stat-grid">
                      {[
                        ...statInfo.final_stat.filter(s => s.stat_name === '전투력'),
                        ...statInfo.final_stat.filter(s => s.stat_name !== '전투력')
                      ].map((stat, index) => (
                        <div key={index} className="stat-row">
                          <span className="label">{stat.stat_name}</span>
                          <span className="value">{formatStatValue(stat.stat_name, stat.stat_value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : statError ? (
                  <div className="info-section">
                    <h3>스탯 정보</h3>
                    <div className="error-message">
                      정보를 불러올 수 없습니다.
                      <button onClick={retryStat} className="retry-btn" title="재시도">↻</button>
                    </div>
                  </div>
                ) : null}

                <div className="sub-info-group">
                  {hyperStatInfo ? (
                    <div className="info-section">
                      <h3>하이퍼 스탯</h3>
                      <div className="stat-grid">
                        {(hyperStatInfo[`hyper_stat_preset_${hyperStatInfo.use_preset_no}`] || [])
                          .filter(stat => stat.stat_level > 0)
                          .map((stat, index) => (
                            <div key={index} className="stat-row">
                              <span className="label">{stat.stat_type}</span>
                              <span className="value">Lv.{stat.stat_level}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : hyperStatError ? (
                    <div className="info-section">
                      <h3>하이퍼 스탯</h3>
                      <div className="error-message">
                        정보를 불러올 수 없습니다.
                        <button onClick={retryHyperStat} className="retry-btn" title="재시도">↻</button>
                      </div>
                    </div>
                  ) : null}

                  {abilityInfo ? (
                    <div className="info-section">
                      <h3>어빌리티 ({abilityInfo.ability_grade})</h3>
                      <div className="ability-list">
                        {abilityInfo.ability_info.map((ability, index) => (
                          <div key={index} className="ability-row">
                            <span className="ability-grade">[{ability.ability_grade}]</span>
                            <span className="ability-value">{ability.ability_value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : abilityError ? (
                    <div className="info-section">
                      <h3>어빌리티</h3>
                      <div className="error-message">
                        정보를 불러올 수 없습니다.
                        <button onClick={retryAbility} className="retry-btn" title="재시도">↻</button>
                      </div>
                    </div>
                  ) : null}

                  {propensityInfo ? (
                    <div className="info-section">
                      <h3>성향</h3>
                      <div className="propensity-grid">
                        <div className="stat-row"><span className="label">카리스마</span><span className="value">{propensityInfo.charisma_level}</span></div>
                        <div className="stat-row"><span className="label">감성</span><span className="value">{propensityInfo.sensibility_level}</span></div>
                        <div className="stat-row"><span className="label">통찰력</span><span className="value">{propensityInfo.insight_level}</span></div>
                        <div className="stat-row"><span className="label">의지</span><span className="value">{propensityInfo.willingness_level}</span></div>
                        <div className="stat-row"><span className="label">손재주</span><span className="value">{propensityInfo.handicraft_level}</span></div>
                        <div className="stat-row"><span className="label">매력</span><span className="value">{propensityInfo.charm_level}</span></div>
                      </div>
                    </div>
                  ) : propensityError ? (
                    <div className="info-section">
                      <h3>성향</h3>
                      <div className="error-message">
                        정보를 불러올 수 없습니다.
                        <button onClick={retryPropensity} className="retry-btn" title="재시도">↻</button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
                  </div>
                </div>
              )}

              {/* 장비 목록 */}
              {isEquipmentModalOpen && equipmentInfo && equipmentInfo.item_equipment && equipmentInfo.item_equipment.length > 0 && (
                <div className="modal-overlay" onClick={() => {
                  if (activeTooltip.pinned) {
                    setActiveTooltip({ equipment: null, pinned: false, position: null });
                  } else {
                    setIsEquipmentModalOpen(false);
                  }
                }}>
                  <div className="modal-content equipment-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setIsEquipmentModalOpen(false)}>×</button>
                <div className="equipment-list">
                  <h3>장비 목록</h3>
                  <div className="equipment-grid">
                    {slotGrid.map((slot, index) => {
                      const equip = equipmentInfo.item_equipment.find(item => item.item_equipment_slot === slot.slot);
                      const rarityColor = equip ? getRarityColor(equip.potential_option_grade) : null;
                      return (
                      <div 
                        key={index} 
                        className={`equipment-item ${!equip ? 'empty' : ''}`}
                        style={rarityColor ? { '--hover-color': rarityColor } : {}}
                        onMouseEnter={(e) => {
                          if (equip && !activeTooltip.pinned) {
                              setActiveTooltip({
                                equipment: equip,
                                pinned: false,
                                position: { x: e.clientX + 15, y: e.clientY + 15 }
                              });
                          }
                        }}
                        onMouseMove={(e) => {
                          if (equip && !activeTooltip.pinned) {
                              setActiveTooltip(prev => ({
                                ...prev,
                                position: { x: e.clientX + 15, y: e.clientY + 15 }
                              }));
                          }
                        }}
                        onMouseLeave={() => {
                          if (!activeTooltip.pinned) {
                            setActiveTooltip({ equipment: null, pinned: false, position: null });
                          }
                        }}
                        onClick={(e) => {
                          if (equip) {
                            if (activeTooltip.pinned && activeTooltip.equipment === equip) {
                              setActiveTooltip({ equipment: null, pinned: false, position: null });
                            } else {
                              setActiveTooltip({
                                equipment: equip,
                                pinned: true,
                                position: { x: e.clientX + 15, y: e.clientY + 15 }
                              });
                            }
                          }
                        }}
                      >
                        {equip ? (
                          <>
                            {equip.item_icon && (
                              <img src={equip.item_icon} alt={equip.item_name} />
                            )}
                            <div className="equipment-name">{equip.item_name}</div>
                          </>
                        ) : (
                          <span className="slot-label">{slot.label}</span>
                        )}
                      </div>
                      );
                    })}
                  </div>
                </div>
                  </div>
                </div>
              )}

              {/* 장비 툴팁 */}
              {activeTooltip.equipment && (
                <EquipmentTooltip 
                  equipment={activeTooltip.equipment} 
                  position={activeTooltip.position}
                  isPinned={activeTooltip.pinned}
                  onClose={() => setActiveTooltip({ equipment: null, pinned: false, position: null })}
                  characterClass={characterInfo?.character_class}
                />
              )}
            </div>
          )}
        </div>
      </div>

  );
}

export default App;