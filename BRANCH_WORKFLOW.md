# 브랜치 구조 및 작업 규칙

## 브랜치 구조

```
main
 ├─ choi
 └─ kim
```

## 브랜치 생성

### choi 브랜치
```bash
git checkout main
git pull
git checkout -b choi
git push -u origin choi
```

### kim 브랜치
```bash
git checkout main
git pull
git checkout -b kim
git push -u origin kim
```

## 작업 규칙

### 기본 규칙
- **choi**: choi 브랜치에서만 작업
- **kim**: kim 브랜치에서만 작업
- **main**: PR로만 병합 (직접 커밋 금지)

### 병합 흐름

1. **각자 브랜치에서 작업**
   ```bash
   # choi 작업 시
   git checkout choi
   # 작업 후
   git add .
   git commit -m "작업 내용"
   git push origin choi
   ```

2. **필요하면 main 최신화**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

3. **PR 생성**
   - GitHub에서 Pull Request 생성
   - `choi → main` 또는 `kim → main`
   - 코드 리뷰 후 병합

## 기능 브랜치 (선택사항)

필요하면 개인 브랜치에서 기능 브랜치 생성:

```bash
# choi의 기능 브랜치
git checkout choi
git checkout -b choi/feature-lexer
git push -u origin choi/feature-lexer

# kim의 기능 브랜치
git checkout kim
git checkout -b kim/feature-parser
git push -u origin kim/feature-parser
```

## 일일 작업 흐름

### 작업 시작 전
```bash
# 1. main 브랜치로 이동
git checkout main

# 2. 최신 코드 가져오기
git pull origin main

# 3. 자신의 브랜치로 이동
git checkout choi  # 또는 kim

# 4. main 최신화 (필요시)
git fetch origin
git rebase origin/main
```

### 작업 중
```bash
# 1. 작업 후 커밋
git add .
git commit -m "작업 내용 설명"

# 2. 푸시
git push origin choi  # 또는 kim
```

### 작업 완료 후
```bash
# 1. GitHub에서 PR 생성
# 2. 코드 리뷰 대기
# 3. 승인 후 main에 병합
```

## 충돌 해결

### rebase 중 충돌 발생 시
```bash
# 1. 충돌 파일 수정
# 2. 수정 후
git add .
git rebase --continue

# 3. 취소하려면
git rebase --abort
```

## 주의사항

- ❌ main 브랜치에 직접 커밋하지 않기
- ❌ 다른 사람의 브랜치에 커밋하지 않기
- ✅ 자신의 브랜치에서만 작업
- ✅ PR을 통해서만 main에 병합
- ✅ 작업 전 항상 main 최신화 확인
