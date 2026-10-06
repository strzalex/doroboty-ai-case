# Architektura

Next.js App Router składa strony. `src/features/dashboard` zawiera statyczne dane i dashboard: karty, wykres oraz tabelę dokumentów z wyszukiwaniem, filtrem statusu, zaznaczaniem i paginacją. Układ nawiązuje do bloku `dashboard-01` shadcn/ui.

`/demo` → komponenty React → dane z pliku. Stan filtrów i zaznaczenia istnieje wyłącznie w pamięci strony. Demo nie zapisuje danych w localStorage ani Supabase i nie potrzebuje usług lub sekretów. Tylko preferencja motywu jest zapisywana przez next-themes.

`/app` → zweryfikowana sesja Supabase → ten sam dashboard z danymi przykładowymi. Supabase służy obecnie wyłącznie do auth; starter nie zawiera tabel domenowych ani migracji. Brak konfiguracji pokazuje instrukcję, a awaria nie przełącza aplikacji na demo.

`src/features/auth` zawiera formularze auth, a `src/features/component-examples` przykładowy formularz React Hook Form z Zod, bez zapisu i wysyłki danych. Biblioteki serwerowe są oddzielone od przeglądarkowych i oznaczone `server-only`.

## Dodawanie funkcji

1. Ustal oczekiwane zachowanie i dodaj funkcję w `src/features`.
2. Współdziel schemat Zod między formularzem a serwerem.
3. Jeśli funkcja wymaga bazy, utwórz nową migrację z tabelą, indeksami i RLS. Nie zmieniaj migracji zastosowanych na zdalnej bazie.
4. Każda operacja serwerowa musi sama weryfikować sesję i dane. Layout nie zastępuje autoryzacji mutacji. Nigdy nie używaj service_role do zwykłych operacji użytkownika.
5. Zbuduj interfejs z istniejących komponentów, uwzględniając ładowanie, pusty wynik, błędy i ponowienie.
6. Testuj krytyczne zachowania i RLS na dwóch kontach, wyłącznie w lokalnym Supabase. Demo zachowaj jako prosty przykład interfejsu ze statycznymi danymi.

## Interfejs

shadcn/ui bazuje na Base UI; komponenty używają `render`. Preset b0 (Nova, Neutral, Inter, Lucide, promień 0.625rem) określa wygląd. Tokeny OKLCH, fonty i odstępy są w `tokens.css`, układ w `src/app/workspace.css`. Nowe kolory dodawaj jako tokeny. Używaj widocznych etykiet pól, opisów błędów, nazw przycisków ikonowych i nagłówków dialogów. Fonty są lokalne, build nie pobiera Google Fonts.

Nie ma płatności, uploadu, wieloorganizacyjności ani AI. Wprowadzaj je jako osobne funkcje z testami i dokumentacją konfiguracji.
