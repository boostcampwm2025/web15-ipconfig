<div align="center">
  <a href="https://teamconfig.work">
    <picture>
      <img alt="team.config" src=".github/asset/teamconfig_github_cover.png" />
    </picture>
  </a>
</div>

<h3 align="center">
  <a href="https://teamconfig.work">team.config</a> | 
  <a href="https://github.com/boostcampwm2025/web15-ipconfig/wiki">wiki</a> | 
  <a href="https://github.com/boostcampwm2025/web15-ipconfig/discussions">discussions</a>
</h3>

---

<div align="center">
<a href="https://teamconfig.work">
  <picture>
    <img alt="team.config" src=".github/asset/teamconfig_github_preview.png" />
  </picture>
</a>

<h4>그라운드 룰 합의부터 README 자동 생성, 초기 세팅 코드까지.<br/><br/>
개발자들의 언어로 소통하고, 프로젝트 세팅을 한 번에 끝내세요</h4>
</div>

## 💡 프로젝트 소개

**team.config**는 사이드 프로젝트나 해커톤을 시작하는 개발 팀을 위한 서비스입니다.</br>
팀 빌딩 초기에 말로만 합의하고 흩어지던 규칙들을 **시각적인 위젯**으로 함께 조율하세요. 합의된 내용은 클릭 한 번으로 **잘 정리된 README.md 문서**와 **즉시 실행 가능한 초기 코드**로 변환됩니다.

### ✨ 핵심 기능

- **🛠️ 위젯 기반의 의사결정**
  - 기술 스택, 코딩 컨벤션, 그라운드 룰 등 팀 빌딩 필수 항목을 위젯을 통해 시각적으로 합의합니다.
- **📄 원클릭 문서화 (README Generator)**
  - 위젯에 입력된 합의 내용을 바탕으로 완성도 높은 **README.md** 파일을 자동으로 생성합니다.
- **💻 초기 세팅 코드 생성 (Boilerplate)**
  - 선택한 기술 스택(React, NestJS 등)에 맞춰 **초기 세팅이 완료된 프로젝트 코드**를 제공합니다.

## 🚀 시작하기

### 방법 1: Docker로 한 번에 실행 (권장)

Docker가 설치되어 있다면 가장 손쉽게 프로젝트를 실행할 수 있습니다.

```bash
docker compose up --build
```

### 방법 2: 로컬 환경에서 실행

**1. 레포지토리 클론 및 의존성 설치**

```bash
git clone https://github.com/boostcampwm2025/web15-ipconfig.git
cd web15-ipconfig
npm install
```

**2. 환경 변수 설정**

backend 디렉토리에 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다.

```bash
cp backend/.env.example backend/.env
```

**3. 백엔드 실행** (로컬 실행 시 Redis가 실행 중이어야 합니다)

```bash
npm run dev:be
```

**4. 프론트엔드 실행**

```bash
npm run dev:fe
```

## 🛠 기술 스택

### Frontend

![React](https://img.shields.io/badge/React-v19-61DAFB?logo=react&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-3178C6?logo=typescript&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-v7-646CFF?logo=vite&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&style=flat-square)
![Zustand](https://img.shields.io/badge/Zustand-State_Mgmt-orange?style=flat-square)
![Radix UI](https://img.shields.io/badge/Radix_UI-Components-161618?logo=radix-ui&style=flat-square)
![Yjs](https://img.shields.io/badge/Yjs-CRDT-blue?style=flat-square)
![Socket.io](https://img.shields.io/badge/Socket.io-Client-010101?logo=socket.io&style=flat-square)

### Backend

![NestJS](https://img.shields.io/badge/NestJS-v11-E0234E?logo=nestjs&style=flat-square)
![Hocuspocus](https://img.shields.io/badge/Hocuspocus-Collaboration-7B61FF?style=flat-square)
![Socket.io](https://img.shields.io/badge/Socket.io-WebSocket-010101?logo=socket.io&style=flat-square)
![Redis](https://img.shields.io/badge/Redis-Cache_&_Pub/Sub-DC382D?logo=redis&style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=node.js&style=flat-square)

### Infrastructure & DevOps

![Naver Cloud](https://img.shields.io/badge/Naver_Cloud_Platform-Infrastructure-03C75A?logo=naver&style=flat-square)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?logo=github-actions&style=flat-square)
![Nginx](https://img.shields.io/badge/Nginx-Reverse_Proxy-009639?logo=nginx&style=flat-square)

## 👨‍💻 팀 ipconfig

**"I \_ \_ P" 개발자들의 모임**

개발 커리어를 설정(config)한다는 의미와 MBTI의 공통점(I, P)을 담아 **ipconfig**라는 팀명이 만들어졌습니다.

조급해하지 말고, 끝까지 즐겁게, 꾸준히 달리자는 목표를 갖고 함께 하고 있습니다.

<table>
  <tbody>
    <tr>
      <td align="center"><b>J027 김규리</b></td>
      <td align="center"><b>J101 문재현</b></td>
      <td align="center"><b>J218 이태호</b></td>
      <td align="center"><b>J300 황지현</b></td>
    </tr>
    <tr>
      <td align="center">
        <div style="width: 150px; height: 150px; background: linear-gradient(135deg, #fdfdcd 0%, #fdd7d7 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; overflow: hidden;">
          <span>
            <img width="150" height="150" alt="image" src="https://github.com/user-attachments/assets/3001a728-6a76-4aeb-ae8c-a9627032f65a" />
          </span>
        </div>
      </td>
      <td align="center">
        <div style="width: 150px; height: 150px; background: #83c5be; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; overflow: hidden;">
          <span>
            <img width="150" height="150" alt="image" src="https://github.com/user-attachments/assets/f5126f1c-f01a-45c7-bb92-d6004a672cc6" />
          </span>
        </div>
      </td>
      <td align="center">
        <div style="width: 150px; height: 150px; background: #cee958; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; overflow: hidden;">
          <span>
            <img width="150" height="150" alt="image" src="https://github.com/user-attachments/assets/23044b9e-1b5a-4fe1-b0a3-10f9c3390b8b" />
          </span>
        </div>
      </td>
      <td align="center">
        <div style="width: 150px; height: 150px; background: #b6baf1; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; overflow: hidden;">
          <span>
            <img width="150" height="150" alt="image" src="https://github.com/user-attachments/assets/002bc5c8-574d-44ea-945b-a6a57c0266b8" />
          </span>
        </div>
      </td>
    </tr>
  </tbody>
</table>

### 📜 그라운드룰 및 컨벤션

- [🐙 그라운드룰 상세](https://github.com/boostcampwm2025/web15-ipconfig/wiki/%F0%9F%A4%9D-%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C-%EB%A3%B0)
- [📄 코딩 컨벤션 상세](https://github.com/boostcampwm2025/web15-ipconfig/wiki/%E2%9C%85-%EC%BD%94%EB%93%9C-%EC%BB%A8%EB%B2%A4%EC%85%98)
