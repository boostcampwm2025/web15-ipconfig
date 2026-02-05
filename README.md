<div align="center">
  <a href="https://teamconfig.work">
    <picture>
      <img alt="team.config" src=".github/asset/teamconfig_github_cover.png" />
    </picture>
  </a>
</div>

<h3 align="center">
  <a href="https://teamconfig.work">
    <img width="160" alt="teamconfig" src="https://github.com/user-attachments/assets/c6e2bd19-e43f-4568-a7c7-0910efa9dfa2" />
  </a>
  <a href="https://github.com/boostcampwm2025/web15-ipconfig/wiki">
    <img width="160" alt="wiki" src="https://github.com/user-attachments/assets/8ff33cdd-da95-48a5-b62a-459b82e78c1f" />
  </a>
  <a href="https://github.com/boostcampwm2025/web15-ipconfig/discussions">
    <img width="160" alt="discussions" src="https://github.com/user-attachments/assets/aa19cd20-1aac-429e-9203-87060b02e24a" />
  </a>
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

<br/>

## <img width="1209" alt="intro" src="https://github.com/user-attachments/assets/275ccc7f-2257-48f2-9818-8c03700f3ddd" />

**team.config**는 사이드 프로젝트나 해커톤을 시작하는 개발 팀을 위한 서비스입니다.<br/>
팀 빌딩 초기에 말로만 합의하고 흩어지던 규칙들을 **시각적인 위젯**으로 함께 조율하세요.<br/>
합의된 내용은 클릭 한 번으로 **잘 정리된 README.md 문서**와 **즉시 실행 가능한 초기 코드**로 변환됩니다.

### ✨ 핵심 기능

- **🛠️ 위젯 기반의 의사결정**
  - 기술 스택, 코딩 컨벤션, 그라운드 룰 등 팀 빌딩 필수 항목을 위젯을 통해 시각적으로 합의합니다.
  - 여러 명이 동시에 편집해도 실시간으로 합의 내용을 맞춰갑니다.
- **📄 원클릭 문서화**
  - 위젯에 입력된 합의 내용을 기반으로, 구조화된 마크다운 문서를 자동으로 생성합니다.
  - 마크다운 미리보기/내보내기 흐름으로 문서 품질을 안정화합니다.
- **💻 초기 설정 파일 생성**
  - 위젯에 입력한 내용을 바탕으로 prettier, dockerfile 코드가 **설정이 완료되어 바로 사용 가능한 형태**로 생성됩니다.

<br/>

## <img width="1209" alt="why" src="https://github.com/user-attachments/assets/fb83447a-bbfd-4bee-9f50-b85b1ec76803" />
> “회의에서 합의한 규칙들... 어디에 적혀 있더라?” <br/>
> "아이디어 회의는 즐거웠지만 문서화는 누가 하지?"

시작이 빠른 만큼, 팀의 규칙도 빠르게 흩어집니다. 우리는 이 **0번째 스프린트**의 낭비를 없애고 싶었습니다. "합의하는 순간, 문서와 코드가 완성되는 경험"을 제공합니다.

- 기술 스택/컨벤션/그라운드 룰은 말로만 정리되고 문서화가 늦어집니다.
- 문서는 매번 새로 쓰느라 품질이 들쭉날쭉해집니다.
- 코드 포맷 협의 시 협의된 내용을 바탕으로 설정 파일을 별도로 작성해야 하는 번거로움이 있습니다.

**team.config**는 “합의 → 문서화 → 초기 설정 파일 생성”을 하나의 흐름으로 묶어, 팀의 0번째 스프린트를 돕습니다.

<br/>

## <img width="1209" alt="keyfeat" src="https://github.com/user-attachments/assets/8c44bb53-e563-45b8-92dc-e52643718856" />

### <img width="34" alt="widget" src="https://github.com/user-attachments/assets/5e5ad7a9-eaf3-4e83-b059-1c4d8a83beb3" />
**위젯(Widget)** 으로 합의할 항목을 시각화하고 협의합니다.

<img width="600" alt="widget" src="https://github.com/user-attachments/assets/4f369cbc-4350-4002-b77a-fd1b0a3dabfa" />

### <img width="72" alt="crdt" src="https://github.com/user-attachments/assets/b202299f-04f6-424b-972a-082ca084994a" />
여러 명이 동시에 편집해도 충돌 없이 동기화되도록 **CRDT(Yjs)** 기반 협업을 제공합니다.

<img width="600" alt="crdt" src="https://github.com/user-attachments/assets/3deef854-2e77-4555-87f3-ff19169334f6" />

### <img width="107" alt="mdexport" src="https://github.com/user-attachments/assets/ce4bb535-444d-433d-babb-dd3c36db24cc" />
합의된 결과를 버튼 한 번으로 **문서**로 내보냅니다.

<img width="600" alt="mdexport" src="https://github.com/user-attachments/assets/c2731eae-81e9-4303-a8c4-13bc6bc7a3ec" />


### <img width="147" alt="setexport" src="https://github.com/user-attachments/assets/95bb6c28-35b3-4adc-af62-3dfc572c9814" />
prettier 설정, dockerfile **설정**을 내보냅니다.

<img width="600" alt="setexport" src="https://github.com/user-attachments/assets/e044e625-e2dc-49b3-8a88-cc15a99e42fd" />

### <img width="33" alt="chat" src="https://github.com/user-attachments/assets/457d94da-01cd-4c08-8900-777c4bcc910b" />
`/`를 입력하여 커서 **채팅**을 통해 팀원들과 소통합니다.

<img width="600" alt="chat" src="https://github.com/user-attachments/assets/734ffdf2-00ee-4b20-9898-457211a96053" />

<br/>

## <img width="1209" alt="getstart" src="https://github.com/user-attachments/assets/703b3627-84e2-4bd2-bcf0-071213133e56" />

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

<br/>

## <img width="1209" alt="infra" src="https://github.com/user-attachments/assets/58761ab3-17ab-4507-bc9d-14be50827e57" />
<div align="center">
  <picture>
    <img alt="cloudarch" width="1000" src="https://github.com/user-attachments/assets/7a92a065-55fb-4882-b42e-8ab9be60ee22" />
  </picture>
</div>

<br/>

## <img width="1209" alt="techstack" src="https://github.com/user-attachments/assets/4ba75b43-76a0-4ac2-b99d-40799bac2239" />

### Frontend

![React](https://img.shields.io/badge/React-v19-61DAFB?logo=react&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-3178C6?logo=typescript&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-v7-646CFF?logo=vite&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&style=flat-square)
![Zustand](https://img.shields.io/badge/Zustand-State_Mgmt-orange?style=flat-square)
![Radix UI](https://img.shields.io/badge/Radix_UI-Components-161618?logo=radix-ui&style=flat-square)
![Yjs](https://img.shields.io/badge/Yjs-CRDT-blue?style=flat-square)

### Backend

![NestJS](https://img.shields.io/badge/NestJS-v11-E0234E?logo=nestjs&style=flat-square)
![Hocuspocus](https://img.shields.io/badge/Hocuspocus-Collaboration-7B61FF?style=flat-square)
![Redis](https://img.shields.io/badge/Redis-Cache_&_Pub/Sub-DC382D?logo=redis&style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=node.js&style=flat-square)

### Infrastructure & DevOps

![Naver Cloud](https://img.shields.io/badge/Naver_Cloud_Platform-Infrastructure-03C75A?logo=naver&style=flat-square)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?logo=github-actions&style=flat-square)
![Nginx](https://img.shields.io/badge/Nginx-Reverse_Proxy-009639?logo=nginx&style=flat-square)

<br/>

## <img width="1209" alt="ipconfig" src="https://github.com/user-attachments/assets/3961ae96-faba-48a0-9586-0d2384dae381" />

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
