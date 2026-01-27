export const formatExpireDate = (dateStr) => {
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

export const formatKoreanNumber = (numStr) => {
  if (!numStr) return '0';
  const num = parseInt(String(numStr).replace(/,/g, ''), 10);
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

export const formatStatValue = (name, value) => {
  if (name === '전투력' || name === '스탯 공격력' || name === '최소 스탯공격력' || name === '최대 스탯공격력') {
    if (value && String(value).includes('~')) {
      const parts = value.split('~').map(part => part.trim());
      return parts.map(formatKoreanNumber).join(' ~ ');
    }
    return formatKoreanNumber(value);
  }

  const percentStats = [
    '데미지', '보스 몬스터 데미지', '방어율 무시', '크리티컬 확률', '크리티컬 데미지',
    '아이템 드롭률', '메소 획득량', '버프 지속시간', '스탠스'
  ];
  if (percentStats.includes(name)) {
    return `${value}%`;
  }
  return value;
};