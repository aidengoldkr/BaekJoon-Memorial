# Good Bye! BOJ! - 백준 메모리얼

16년간 대한민국 알고리즘 트레이닝의 뿌리가 되어준 **백준 온라인 저지(BOJ)** 의 마지막을 기억하는 메모리얼 웹사이트입니다.

수많은 "맞았습니다!!"와 함께 성장한 우리들의 이야기를 방명록에 남겨주세요.

`https://goodbye-boj.com` 에서 확인하세요.
---

## 주요 기능

- **카운트다운 타이머** — BOJ 서비스 종료일(2026-04-28)까지 남은 시간을 실시간으로 표시
- **방명록** — Google 로그인 후 추억의 한마디를 남기고, 다른 사람의 글에 꽃(❤️) 반응 전송
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

## 사용 방법

1. **로그인** — 우측 상단의 "로그인" 버튼으로 Google 계정 연동
2. **프로필 설정** — 최초 로그인 시 닉네임, BOJ 티어, 풀어본 문제 수, 주력 언어를 입력
3. **방명록 작성** — 메인 페이지에서 140자 이내로 메시지 작성 (하루 1회)
4. **좋아요 반응** — 다른 사람의 방명록에 ❤️ 좋아요 반응 전송 (로그인 필요)
5. **전체 보기** — "전체 방명록 보기"에서 모든 글을 최신순 또는 좋아요순으로 탐색

---

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
