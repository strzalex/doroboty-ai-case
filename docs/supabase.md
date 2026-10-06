# Supabase

Demo działa bez Supabase i Dockera. Poniższe kroki włączają konta użytkowników. Dashboard nadal korzysta ze statycznych danych. Starter nie zawiera tabel domenowych ani migracji SQL.

## Projekt w chmurze

1. Utwórz projekt Supabase i skopiuj `.env.example` do `.env.local`.
2. Wpisz URL i publishable key z panelu Connect. Legacy anon key również działa. **Nigdy service_role/secret key.**
3. W Auth ustaw Site URL na adres aplikacji. W Redirect URLs dodaj jej `/auth/callback` wraz z parametrami: `/auth/callback?next=/app` i `/auth/callback?next=/auth/update-password`. Dla lokalnego developmentu użyj `http://localhost:3000` i analogicznych adresów.
4. Włącz potwierdzanie emaila. Skopiuj treść plików `supabase/templates/confirmation.html` i `recovery.html` do odpowiednich szablonów Confirm signup oraz Reset password w panelu Auth. Nasze formularze zawsze ustawiają RedirectTo z parametrem next. Nie używaj tych szablonów w innych klientach bez tego parametru.
5. Podłącz własny SMTP przed udostępnieniem aplikacji użytkownikom i sprawdź dostarczanie wiadomości. Lokalna skrzynka testowa nie jest usługą wysyłkową.
6. Uruchom ponownie `npm run dev` i otwórz `/app`.

Po zalogowaniu użytkownik widzi przykładowy dashboard. Własne tabele i RLS dodawaj dopiero przy implementacji funkcji produktu. Przy niepełnej konfiguracji aplikacja pokazuje instrukcję, bez przejścia na demo.

## Lokalne testy integracyjne

Potrzebny jest działający Docker. CLI Supabase jest zależnością developerską projektu:

```sh
npm run db:start
npx playwright install chromium
npm run test:integration
npm run db:stop
```

Pierwszy start pobiera obrazy. Używane porty: 54321 API, 54322 baza, 54323 Studio, 54324 testowa skrzynka Mailpit, 3107 aplikacja testowa. Nie uruchamiaj równolegle testów demo i integracji — oba przebudowują `.next`.

Skrypt integracyjny pobiera publiczny klucz z lokalnego CLI, odrzuca zdalne adresy i buduje aplikację ze wskazaniem na lokalny stack. Nie zapisuje kluczy do repo. Testuje rejestrację, potwierdzenie emaila, dostęp do aplikacji, wylogowanie, logowanie, odzyskiwanie hasła i niezależność sesji dwóch kont. Maile trafiają wyłącznie do lokalnej skrzynki.

`npm run db:reset` usuwa **lokalne** dane i odtwarza migracje. Nie używaj go do zwykłego startu; testy tworzą unikalne konta. Po integracji `npm run test:e2e` przebuduje aplikację w trybie bez konfiguracji. Lokalne limity wysyłki podniesiono wyłącznie na potrzeby testów.

Callback obsługuje PKCE code oraz token_hash. Akceptowane cele przekierowania to tylko `/app` i `/auth/update-password`; link wygasły lub niepoprawny prowadzi do komunikatu na ekranie logowania.

## Własne tabele

Dodając funkcję wymagającą bazy, zapisz jej schemat i RLS jako nową migrację. Przed wdrożeniem sprawdź `npx supabase db push --dry-run` dla właściwego projektu. Testuj RLS na dwóch kontach w lokalnym stacku. Starter nie usuwa tabel ze wcześniej skonfigurowanych baz.
