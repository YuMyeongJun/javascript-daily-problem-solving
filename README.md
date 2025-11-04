# JavaScript Daily Problem Solving

일일 자바스크립트 알고리즘 및 개념 학습을 위한 스터디 프로젝트입니다.

## 프로젝트 구조

```
javascript-daily-problem-solving/
├── frontend/          # React + TypeScript
├── backend/           # NestJS
└── README.md
```

## 기술 스택

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- date-fns

### Backend

- NestJS
- TypeScript
- VM2 (코드 실행 환경)

## 시작하기

### 1. Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

Frontend는 `http://localhost:5173`에서 실행됩니다.

### 2. Backend 실행

```bash
cd backend
npm install
npm run start:dev
```

Backend는 `http://localhost:3000`에서 실행됩니다.

## 주요 기능

- 📅 **일일 문제 제공**: 매일 새로운 알고리즘 문제를 제공합니다
- ✅ **문제 풀이 제출**: 코드를 작성하고 테스트 케이스를 실행합니다
- 📊 **진행 상황 추적**: 완료한 문제와 진행률을 확인할 수 있습니다
- 📚 **문제 히스토리**: 최근 30일간의 문제 히스토리를 확인할 수 있습니다
- 🎨 **아름다운 UI**: Tailwind CSS로 제작된 현대적인 UI

## 문제 유형

현재 다음 유형의 문제들이 제공됩니다:

- 두 수의 합
- 배열의 최댓값 찾기
- 문자열 뒤집기
- 팰린드롬 확인
- 배열 중복 제거

## 사용 방법

1. 메인 페이지에서 오늘의 문제를 확인합니다
2. "문제 풀기" 버튼을 클릭하여 문제 상세 페이지로 이동합니다
3. 코드를 작성하고 "제출하기" 버튼을 클릭합니다
4. 테스트 케이스 결과를 확인하고, 모든 테스트를 통과하면 완료됩니다
5. 히스토리 페이지에서 이전 문제들을 확인할 수 있습니다

## 개발

프로젝트는 다음 구조로 개발되었습니다:

- **Frontend**: React + TypeScript로 구성된 SPA
- **Backend**: NestJS로 구성된 RESTful API
- **코드 실행**: VM2를 사용한 안전한 코드 실행 환경
