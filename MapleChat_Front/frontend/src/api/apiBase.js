// 개발 시 비워두면 proxy 사용. exe 배포 시 REACT_APP_API_URL에 백엔드 주소 지정 (끝에 / 없이).
export const getApiBase = () => process.env.REACT_APP_API_URL || '';
