// 개발 시 비워두면 proxy 사용. 배포 시 끝 슬래시가 들어와도 안전하게 제거한다.
export const getApiBase = () => (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

/** 200이어도 body가 비어 있으면 .json()이 터지므로, text 후 파싱. 실패/빈문자/비JSON이면 null */
export async function parseJsonSafe(response) {
  const text = await response.text();
  if (!response.ok || !text?.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
