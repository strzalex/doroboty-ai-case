# Publikacja i utrzymanie

Repozytorium zawiera konfigurację, ale nie tworzy automatycznie kont, projektu Vercel ani zdalnej bazy.

## GitHub

Opublikuj repo i ustaw `main` jako gałąź domyślną. Po pierwszym przebiegu CI włącz ruleset wymagający pull requesta oraz kontroli **Quality and demo** i **Supabase integration**. Dostępność reguł zależy od planu i widoczności repo. Nie traktuj samego pliku YAML jako ochrony gałęzi.

CI działa bez sekretów produkcyjnych, z minimalnym uprawnieniem `contents: read`. Drugi job uruchamia własny Supabase na runnerze. Raporty i ślady Playwright są dostępne w artefaktach przez 7 dni. Dependabot otwiera propozycje aktualizacji; nie ma automatycznego merge.

## Vercel

1. Zaimportuj repo do Vercel, wybierz Next.js, Node 24, komendę build `npm run build` i instalację `npm ci`.
2. Dla pierwszego wdrożenia demo pozostaw zmienne Supabase puste. Build musi działać bez nich.
3. Dla produkcji ustaw `NEXT_PUBLIC_SUPABASE_URL` i `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Skonfiguruj auth zgodnie z [instrukcją Supabase](supabase.md).
4. Dla Preview użyj **oddzielnego projektu Supabase** i osobnych zmiennych. Możesz również pozostawić preview jako demo. Nie kopiuj produkcyjnej bazy lub sekretów do PR-ów.
5. Skonfiguruj adresy callback osobno dla środowisk. Publiczne zmienne Next są wbudowywane podczas buildu — ich zmiana wymaga nowego wdrożenia.
6. Integracja Vercel tworzy preview dla PR. Produkcję publikuj po merge do chronionego `main` z zielonym CI. Ochrona gałęzi z poprzedniej sekcji jest częścią tej konfiguracji.

## Sprawdzenie wdrożenia

Otwórz demo, sprawdź widok mobilny, następnie załóż konto testowe, potwierdź email, sprawdź dostęp do dashboardu po ponownym logowaniu. Przejdź reset hasła na docelowej domenie. Sprawdź logi Vercel i dostarczanie wiadomości SMTP. Nie zapisuj haseł ani tokenów w logach.

Starter nie zawiera monitoringu zewnętrznego ani gwarancji backupu. Przed gromadzeniem ważnych danych skonfiguruj kopie bazy według wybranego planu Supabase i sprawdź procedurę odtworzenia.

## Powrót do wcześniejszej wersji

W Vercel przywróć poprzednie działające wdrożenie, a w GitHub przygotuj revert błędnej zmiany. **Rollback kodu nie cofa migracji ani danych.** Migracje wdrażaj kompatybilnie ze starą i nową wersją; destrukcyjne zmiany wymagają kopii danych i osobnego planu. Nie uruchamiaj `db reset` na produkcji.
