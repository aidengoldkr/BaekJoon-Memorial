# Good Bye! BOJ! - 백준 메모리얼

16년간 대한민국 알고리즘 트레이닝의 뿌리가 되어준 **백준 온라인 저지(BOJ)** 의 마지막을 기억하는 메모리얼 웹사이트입니다.

수많은 "맞았습니다!!"와 함께 성장한 우리들의 이야기를 방명록에 남겨주세요.

`https://goodbye-boj.com` 에서 확인하세요.
---

## 주요 기능

- **경과 시간 타이머** — 2026년 4월 28일 0시(KST)부터 흐른 일·시간·분·초를 실시간으로 표시
- **방명록** — Google 로그인 후 추억의 한마디를 남기고, 다른 사람의 글에 좋아요(❤️) 반응 전송
- **전체 방명록** — 최신순 / 좋아요순으로 정렬 가능한 페이지네이션 뷰
- **플로팅 메시지 배경** — 방명록 메시지들이 화면을 가로질러 흘러가는 인터랙티브 배경
- **프로필** — BOJ 닉네임, 티어(Bronze ~ Ruby / Master), 풀어본 문제 수, 주력 언어 설정

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 14 (App Router) + TypeScript |
| 인증 | NextAuth v5 (Google OAuth) |
| 데이터베이스 | Supabase (PostgreSQL) |
| 스타일 | Tailwind CSS v4 + CSS Modules |
| 애니메이션 | Framer Motion |
| 클라이언트 데이터 | TanStack Query v5 |

---

## 프로젝트 구조

```
boj_rip/
└── src/
    ├── app/
    │   ├── page.tsx                  # 메인 페이지 (카운트다운 + 방명록)
    │   ├── guestbook/page.tsx        # 전체 방명록 (페이지네이션)
    │   ├── mypage/page.tsx           # 내 프로필 편집
    │   ├── (auth)/login/page.tsx     # Google 로그인
    │   ├── actions/
    │   │   ├── guestbook.ts          # 방명록 Server Actions
    │   │   └── profile.ts            # 프로필 Server Actions
    │   └── api/auth/[...nextauth]/   # NextAuth 핸들러
    ├── components/                   # UI 컴포넌트
    └── lib/
        ├── auth.ts                   # NextAuth 설정
        └── supabase/server.ts        # Supabase 클라이언트 (읽기/쓰기 분리)
```

---

## 로컬 개발환경

```bash
npm ci
cp .env.example .env.local
# .env.local의 Supabase / Google OAuth 값을 입력
npm run dev
```

- 개발 서버: http://localhost:3000
- `AUTH_SECRET`: `openssl rand -base64 32`로 생성한 값을 입력합니다.
- Google OAuth의 승인된 JavaScript 원본: `http://localhost:3000`
- Google OAuth의 승인된 리디렉션 URI: `http://localhost:3000/api/auth/callback/google`
- Supabase URL과 anon key, service role key는 기존 프로젝트의 API 설정에서 가져옵니다.
- 기존 Supabase의 테이블 및 RPC가 필요합니다. 이 저장소에는 DB 마이그레이션이 포함되어 있지 않습니다.
- `.env.local`은 Git에서 제외됩니다. service role key와 OAuth secret은 공개하거나 커밋하지 않습니다.
- 검증: `npm run build`, `npx tsc --noEmit`

---

## 사용 방법

1. **로그인** — 우측 상단의 "로그인" 버튼으로 Google 계정 연동
2. **프로필 설정** — 최초 로그인 시 닉네임, BOJ 티어, 풀어본 문제 수, 주력 언어를 입력
3. **방명록 작성** — 메인 페이지에서 140자 이내로 메시지 작성 (하루 1회)
4. **좋아요 반응** — 다른 사람의 방명록에 ❤️ 좋아요 반응 전송 (로그인 필요)
5. **전체 보기** — "전체 방명록 보기"에서 모든 글을 최신순 또는 좋아요순으로 탐색

---

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
