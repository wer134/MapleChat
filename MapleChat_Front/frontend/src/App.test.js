// App 기본 렌더 테스트
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard layout skeleton', () => {
  render(<App />);
  expect(screen.getByText('로그인 기능 박스')).toBeInTheDocument();
  expect(screen.getByText('정보창 (장비, 유니온, 기타스탯 등등)')).toBeInTheDocument();
  expect(screen.getByText('길드 채팅 or 길드 없다면 알림')).toBeInTheDocument();
});
