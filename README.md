###### 멋쟁이사자처럼 프론트엔드 14기 바닐라 프로젝트 5조

# 👋 안녕하세요! 저희는 **‘잡았조’** 입니다!

> **JS 잡았조!**  
> 자바스크립트를 잡기 위해 뭉친 팀, 잡았조!

---

## 🎮 타자의 세계

웹 기반 타자 게임 사이트 제작 프로젝트입니다.  
사용자의 타자 실력을 향상시키기 위한 다양한 미니게임을 제작했습니다.

- 한글 타자 게임: 4글자 미만의 쉬운 단어
- 영어 타자 게임: 개발 관련 용어 기반

---

## 👥 팀 구성 및 역할

| 이름   | 역할          | 제작 게임   |
| ------ | ------------- | ----------- |
| 전지연 | 스크럼 마스터 | 퀴즈        |
| 백창엽 | 팀원          | 두더지 잡기 |
| 조석근 | 팀원          | 디펜스      |
| 조선현 | 팀원          | 산성비      |

---

## 📌 제작 게임 설명

| 게임 이름      | 설명                                        |
| -------------- | ------------------------------------------- |
| 🧠 퀴즈        | 문제를 읽고 정답을 빠르게 타이핑            |
| 🛠️ 두더지 잡기 | 등장하는 단어 두더지를 타이핑으로 제거      |
| 🛡 디펜스      | 사방에서 몰려오는 적을 타이핑으로 방어      |
| 🌧 산성비      | 하늘에서 떨어지는 단어를 빠르게 입력해 제거 |

---

## 🛠 기술 스택

| 분류             | 기술                                                                                                                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 개발 언어        | ![HTML](https://skillicons.dev/icons?i=html) ![CSS](https://skillicons.dev/icons?i=css) ![JavaScript](https://skillicons.dev/icons?i=js)                                                        |
| 개발 환경        | ![VSCode](https://skillicons.dev/icons?i=vscode) ![Vite](https://skillicons.dev/icons?i=vite)                                                                                                   |
| 버전 관리 & 협업 | ![Git](https://skillicons.dev/icons?i=git) ![GitHub](https://skillicons.dev/icons?i=github) ![Discord](https://skillicons.dev/icons?i=discord) ![Notion](https://skillicons.dev/icons?i=notion) |
| 디자인 툴        | ![Figma](https://skillicons.dev/icons?i=figma)                                                                                                                                                  |

---

## 📁 프로젝트 디렉토리 구조

```
📦 프로젝트 루트/
├── 📁 public/
│ ├── 📁 assets/ # 정적 리소스 폴더
│ │ ├── 📁 audio/ # 사운드 리소스
│ │ │ ├── 📁 bgm/ # 배경 음악
│ │ │ └── 📁 sfx/ # 효과음
│ │ ├── 📁 icons/ # UI 아이콘
│ │ ├── 📁 images/ # 일반 이미지
│ │ └── 📁 videos/ # 비디오 파일
│ ├── 📁 data/ # JSON 데이터 파일 (예: 단어 리스트)
│ └── 📁 fonts/ # 웹폰트 리소스 (.woff, .css 등)
│
├── 📁 assets/
│ ├── 📁 components/ # 재사용 가능한 컴포넌트
│ │ ├── 📁 booting/
│ │ ├── 📁 button/
│ │ ├── 📁 card/
│ │ ├── 📁 game-choice-header/
│ │ ├── 📁 header/
│ │ ├── 📁 input/
│ │ ├── 📁 modal/
│ │ ├── 📁 monitor/
│ │ ├── 📁 slider/
│ │ └── 📁 window/
│ │
│ ├── 📁 pages/ # 게임별 페이지 구성
│ │ ├── 📁 acidrain/ # 산성비 게임
│ │ ├── 📁 game-defence/ # 디펜스 게임
│ │ ├── 📁 game-landing/ # 랜딩 페이지
│ │ ├── 📁 game-quiz/ # 퀴즈 게임
│ │ ├── 📁 game-select/ # 게임 선택 화면
│ │ ├── 📁 main-start-page/ # 시작 화면
│ │ ├── 📁 mole-game/ # 모달
│ │ └── 📄 test.html/ # 테스트용 임시 파일
│ │
│ ├── 📁 scripts/ # 공통 스크립트 및 유틸 JS
│ └── 📁 styles/
│ └── 📁 common/ # 전역 스타일 및 유틸 스타일
```

---

## 🤝 협업 방식

- 📝 문서 정리: **Notion**
- ⏰ 매일 오후 5시: **디스코드 스크럼 진행**
- 🔗 Discord 채널에 **GitHub 연동**
- 📋 GitHub Project를 통해 백로그 및 작업 관리

---

## 🔧 Git 협업 컨벤션

### 📌 커밋 메시지 타입

| 타입     | 설명                           |
| -------- | ------------------------------ |
| init     | 초기 설정                      |
| feat     | 기능 추가 또는 변경            |
| fix      | 버그 수정                      |
| remove   | 코드/파일 삭제                 |
| hotfix   | 배포 직전/후 급한 오류 수정    |
| docs     | 문서 작성 또는 수정            |
| style    | UI/스타일링 관련 변경          |
| refactor | 코드 리팩토링 (기능 변화 없음) |
| test     | 테스트 코드 관련               |
| ci       | 배포 및 빌드 관련 설정         |
| chore    | 기타 설정                      |
| merge    | 브랜치 병합                    |
| release  | 배포용 커밋                    |

예시: fix: 게임 시작 시 audio 중복 재생 오류 수정

### 📌 브랜치 네이밍 규칙

| 브랜치 이름 예시     | 용도 설명                   |
| -------------------- | --------------------------- |
| `main`               | 최종 배포용 브랜치          |
| `develop`            | 전체 개발 통합용 브랜치     |
| `feature/기능/이름`  | 새로운 기능 추가용 브랜치   |
| `refactor/기능/이름` | 기존 코드 리팩토링용 브랜치 |
| `hotfix/이슈명`      | 긴급 오류 수정용 브랜치     |
| `docs/문서명`        | 문서 작성 및 수정용 브랜치  |

> ✅ 브랜치 네이밍은 **kebab-case**로 통일
> 예시: `feature/login-page/jiyun`, `refactor/quiz-component/sunhyun`

### 🖍 네이밍 컨벤션

| 항목         | 네이밍 방식        | 예시                                 |
| ------------ | ------------------ | ------------------------------------ |
| HTML `id`    | `camelCase`        | `userCard`, `scrollTarget`           |
| HTML `class` | `kebab-case`       | `main-banner`, `card-item`           |
| JS 변수명    | `camelCase`        | `wordList`, `gameStarted`            |
| JS 상수명    | `UPPER_SNAKE_CASE` | `MAX_SCORE`, `KEY_CODE_ENTER`        |
| 파일 / 폴더  | `kebab-case`       | `main-start-page/`, `score-board.js` |

> ✅ 일관된 네이밍 규칙은 협업 효율을 높이고 유지 보수를 쉽게 합니다!

---

## 👀프로젝트 미리보기

### 💻윈도우xp 부팅 화면 (스플래쉬)

2000년대 초반 윈도우 xp 데스크탑을 실제로 켜는 듯한 느낌을 주기 위해 웹 사이트를 로드했을 때 윈도우 xp 부팅화면과 로그온 화면을 구현하였습니다.

![윈도우xp 부팅](/public/assets/videos/window_loading.mp4)
![윈도우xp 로그온](/public/assets/images/window-start.jpg)

### 💻윈도우xp 바탕 화면

'타자의 세계' 게임을 구동하기 위해 사용자들로 하여금 윈도우 xp 데스크탑을 사용하는 듯한 느낌을 주기위해 그때 당시의 바탕화면을 구현하였습니다.
![윈도우 xp 바탕화면](/public/assets/images/readme-window.png)

### 💻타자의 세계

'타자의 세계' 아이콘 더블 클릭 시 게임에 진입. 전체적인 게임의 분위기를 레트로로 선정해 추억의 타자 게임을 한다는 느낌을 줄 수 있도록 구현하였습니다.
![타자의 세계 메인 화면](/public/assets/images/readme-main.png)

### 💻게임 선택

'잡았조' 팀원들이 각각 구현한 4가지의 타자 게임이 준비되어있습니다. 게임 설명을 참고하여 게임을 진행할 수 있습니다.
![타자의 세계 게임 선택 화면](/public/assets/images/readme-select.png)

👇타자의 게임이 궁금하다면? 아래의 배포 링크를 통해 확인해 보세요!👇

---

## 🔗 배포 링크

[👉 타자의 세계 - 바로가기](https://typing-world.netlify.app/)

[👉 발표자료 ppt 제출용 - 바로가기](https://docs.google.com/presentation/d/1Puf4EpDCRxE03WppmNRPfL-QeMHW2gdCuGlaGm8Thto/edit?usp=sharing)

[👉 노션 - 바로가기](https://www.notion.so/5-23273873401a80d4b880cf222f6105ff?source=copy_link)

[👉 잡았조? 피그마 - 바로가기](https://www.figma.com/design/lYMh3zNLpxmA4L7AKQOKf5/%EC%9E%A1%EC%95%98%EC%A1%B0---%EC%9B%B9-%EA%B8%B0%EB%B0%98-%ED%83%80%EC%9E%90-%EC%97%B0%EC%8A%B5-%EA%B2%8C%EC%9E%84-%EC%82%AC%EC%9D%B4%ED%8A%B8-%EC%A0%9C%EC%9E%91?node-id=1-84&t=qacsOTrSYnbgG7Un-0)
