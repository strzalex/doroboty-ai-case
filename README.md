# Superstarter

Starter aplikacji do pracy z Codex: Next.js, shadcn/ui na Base UI, Supabase Auth i automatyczne sprawdzanie jakości.

## Uruchomienie

Node.js 24 i npm:

```sh
npm ci
npm run dev
```

Otwórz [localhost:3000/demo](http://localhost:3000/demo). Demo działa bez sekretów, Supabase i Dockera. Pokazuje dashboard z kartami, wykresem i prostą tabelą dokumentów, inspirowany [dashboard-01 shadcn/ui](https://ui.shadcn.com/blocks). Dane są statyczne; filtry, zaznaczenie i paginacja działają w pamięci strony.

## Co zawiera starter

- Next.js App Router, React, TypeScript i npm z `package-lock.json`.
- shadcn/ui na Base UI w presecie b0: Nova, Neutral, lokalny Inter i Lucide; Tailwind CSS.
- Jasny, ciemny i systemowy motyw, responsywną nawigację oraz galerię `/components` z formularzem React Hook Form i Zod.
- Oddzielną aplikację `/app` z Supabase Auth: rejestrację, potwierdzenie emaila, logowanie, reset hasła i wylogowanie.
- Vitest, Playwright i konfigurację GitHub Actions.

Starter nie zawiera tabel domenowych, migracji projektów ani CRUD. `/app` pokazuje ten sam przykładowy dashboard po zalogowaniu; dane demo nie trafiają do Supabase. Brak lub awaria konfiguracji nie przełącza aplikacji na demo.

## Praca nad kodem

Funkcje są w `src/features`, współdzielone komponenty w `src/components`, a tokeny w `tokens.css`. Komunikaty i dokumentacja są po polsku; identyfikatory kodu po angielsku. Zasady rozbudowy opisuje `AGENTS.md`.

`npm run format` formatuje kod. `npm run check` sprawdza format, lint, typy, testy jednostkowe, build produkcyjny i E2E demo. Integracja auth wymaga lokalnego Supabase w Dockerze. Po publikacji repozytorium skonfiguruj wymagane kontrole CI i hosting.

- [Konfiguracja Supabase i testy auth](docs/supabase.md)
- [Wdrożenie na Vercel](docs/deployment.md)
- [Architektura i dodawanie funkcji](docs/architecture.md)
