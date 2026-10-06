# Praca nad Superstarterem

## Standardy

- Pisz komunikaty i dokumentację po polsku, identyfikatory kodu po angielsku.
- npm i Node 24; utrzymuj package-lock.json. Nie dodawaj drugiego menedżera pakietów.
- Korzystaj z istniejących shadcn/ui (Base UI), tokenów i wzorca formularzy. Aktualne komponenty używają `render`, nie radixowego `asChild`.
- Nowe funkcje umieszczaj w src/features; strony składają funkcje, a src/components/ui przechowuje współdzielone prymitywy.
- Biblioteki serwerowe oznaczaj `server-only`. Każda mutacja weryfikuje sesję i dane przez Zod. Nie polegaj wyłącznie na layoutach do autoryzacji.
- Schematy wejściowe współdziel między formularzem i serwerem.
- Demo ma być uruchamialne bez sekretów, usług i Dockera. Awaria Supabase nigdy nie przełącza prawdziwej aplikacji na demo.
- Demo pokazuje statyczne dane. Nie dodawaj do niego tabel domenowych, migracji ani zapisu do localStorage.
- Zmiany bazy zapisuj jako nowe migracje. Testuj RLS na dwóch kontach; nigdy nie używaj service_role do normalnych operacji użytkownika.
- Nie loguj tokenów, haseł, ciasteczek ani danych użytkowników. NEXT_PUBLIC oznacza dane dostępne w przeglądarce.

## Sprawdzanie

- `npm run format` formatuje, `npm run check` weryfikuje format, lint, typy, testy, build i E2E demo.
- Po zmianie auth/bazy: Docker, `npm run db:start`, `npm run test:integration`, `npm run db:stop`.
- Integracja korzysta wyłącznie z lokalnego Supabase. Nigdy nie resetuj chmurowej bazy, by uruchomić test.
- Sprawdzaj UI na telefonie i komputerze, stany błędów oraz klawiaturę. Preferuj testy zachowania zamiast testów kopiujących implementację.
- Raportuj, co faktycznie sprawdzono. Zielony lokalny build nie oznacza działającego CI ani wdrożenia.

## Rozbudowa

Najpierw ustal oczekiwane zachowanie, potem dodaj schemat, dane, interfejs i odpowiednie testy. Instrukcje architektury są w docs/architecture.md. Zachowuj README krótkie; szczegóły usług opisuj w docs.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
