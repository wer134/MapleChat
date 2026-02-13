// 월드 아이콘 (캐릭터 헤더용)
import 노바 from '../worldicon/노바.png';
import 레드 from '../worldicon/레드.png';
import 루나 from '../worldicon/루나.png';
import 베라 from '../worldicon/베라.png';
import 스카니아 from '../worldicon/스카니아.png';
import 아케인 from '../worldicon/아케인.png';
import 에오스 from '../worldicon/에오스.png';
import 엘리시움 from '../worldicon/엘리시움.png';
import 오로라 from '../worldicon/오로라.png';
import 유니온 from '../worldicon/유니온.png';
import 이노시스 from '../worldicon/이노시스.png';
import 제니스 from '../worldicon/제니스.png';
import 챌린저스 from '../worldicon/챌린저스.png';
import 크로아 from '../worldicon/크로아.png';
import 핼리오스 from '../worldicon/핼리오스.png';

export const getWorldIcon = (worldName) => {
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