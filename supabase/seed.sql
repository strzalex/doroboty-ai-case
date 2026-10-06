insert into public.companies (id, slug, name, summary, description, website_url, location, size_label)
values
  ('10000000-0000-4000-8000-000000000001', 'brightlabs', 'BrightLabs', 'Budujemy narzędzia AI dla zespołów operacyjnych.', 'Polski software house rozwijający produkty automatyzujące pracę zespołów finansowych i operacyjnych. Łączymy badania użytkowników, modele językowe i rygor produkcyjnego oprogramowania.', 'https://example.com/brightlabs', 'Warszawa', '51–200 osób'),
  ('10000000-0000-4000-8000-000000000002', 'northstar-health', 'Northstar Health', 'Technologia, która oddaje czas zespołom medycznym.', 'Europejska firma healthtech upraszczająca dokumentację i koordynację opieki. Pracujemy w środowisku regulowanym, dlatego jakość i możliwość wyjaśnienia decyzji są równie ważne jak tempo.', 'https://example.com/northstar', 'Kraków / zdalnie', '201–500 osób'),
  ('10000000-0000-4000-8000-000000000003', 'plain-sight', 'Plain Sight', 'Studio produktowe dla ambitnych zespołów B2B.', 'Projektujemy i wdrażamy cyfrowe produkty, które rozwiązują realne problemy biznesowe. AI traktujemy jak materiał projektowy, a nie osobną kategorię produktu.', 'https://example.com/plain-sight', 'Wrocław', '11–50 osób')
on conflict (id) do update set name = excluded.name;

insert into public.case_releases (key, sequence, title, participant_summary, unlocked, released_at)
values
  ('baseline', 1, 'Baseline', 'Długi formularz i widoczne porzucenia.', true, '2026-01-05T09:00:00Z'),
  ('post_one_click', 2, 'Po one-click apply', 'Więcej aplikacji, ale bez założenia, że wynik rekrutacji się poprawił.', true, '2026-02-02T09:00:00Z'),
  ('discovery', 3, 'Discovery', 'Rozmowy i przykłady wspierające kilka możliwych diagnoz.', true, '2026-02-16T09:00:00Z'),
  ('post_ai', 4, 'Po interwencji AI', 'Pomiar tekstu i dalszego wyniku rekrutacji.', false, null),
  ('pilot', 5, 'Pilot organizacyjny', 'Koszt, adopcja, prywatność i sponsor zmiany.', false, null),
  ('demo_day', 6, 'Demo Day', 'Pełna ścieżka od hipotezy do kolejnego testu.', false, null)
on conflict (key) do update set title = excluded.title;

insert into public.case_evidence_documents (id, release_key, kind, source_label, title, content)
values
  ('60000000-0000-4000-8000-000000000001', 'discovery', 'interview', 'Kandydatka C-014', 'Nie wiem, jaki dowód jest ważny', '{"quote":"Opis roli mówi o strategicznym wpływie, ale formularz pyta głównie o motywację. Nie wiedziałam, który projekt opisać.","job":"AI Product Manager","tags":["unclear_criteria","evidence_selection"]}'),
  ('60000000-0000-4000-8000-000000000002', 'discovery', 'interview', 'Hiring manager H-03', 'Dużo poprawnych odpowiedzi, mało decyzji', '{"quote":"Teksty są płynne, ale po przeczytaniu nadal nie wiem, co ta osoba naprawdę zrobiła i jaki był efekt.","job":"Staff AI Engineer","tags":["weak_evidence","review_cost"]}'),
  ('60000000-0000-4000-8000-000000000003', 'discovery', 'support_ticket', 'Support #1842', 'Czy mogę dodać link do projektu?', '{"body":"Kandydat pyta, gdzie może pokazać repozytorium i opisać swoją odpowiedzialność, bo pole tekstowe nie ma odpowiedniego miejsca.","tags":["work_sample","form_structure"]}'),
  ('60000000-0000-4000-8000-000000000004', 'discovery', 'sales_note', 'Rozmowa z BrightLabs', 'Kryterium istnieje poza ogłoszeniem', '{"body":"Zespół potrzebuje doświadczenia we wdrożeniu z finansami, ale skrócił ten fragment ogłoszenia, aby nie odstraszać kandydatów.","tags":["hidden_criteria","job_copy"]}'),
  ('60000000-0000-4000-8000-000000000005', 'discovery', 'public_review', 'Syntetyczna recenzja procesu', 'Szybko, ale ogólnie', '{"body":"Aplikacja zajęła minutę. Na rozmowie okazało się, że firma szukała zupełnie innego rodzaju doświadczenia.","tags":["one_click","expectation_gap"]}')
on conflict (id) do update set content = excluded.content;

insert into public.employer_briefs (id, company_id, title, source_text, decision_criteria)
values
  ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'AI Product Manager source brief', 'We need someone who can uncover one valuable finance workflow, run discovery with operations teams, and own a safe production rollout. The person must be credible with clients and engineers.', '["Validated workflow outcome", "Cross-functional decision quality", "Safe rollout evidence"]'),
  ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'Staff AI Engineer source brief', 'We need production ownership for evaluations and human oversight in a regulated clinical environment. Generic LLM demos are insufficient.', '["Production evaluation systems", "Regulated-domain collaboration", "Human oversight"]');

insert into public.jobs (
  id, slug, company_id, employer_brief_id, title, summary, description, category, function,
  remote_status, locations, seniority, contract_type, salary_min, salary_max, salary_currency,
  salary_period, salary_kind, publication_status, verification_status, published_at, expiry_at
)
values
  ('20000000-0000-4000-8000-000000000001', 'ai-product-manager', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'AI Product Manager', 'Poprowadź produkt od problemu operacyjnego do mierzalnego wdrożenia AI.', E'Szukamy osoby, która połączy discovery, analizę danych i współpracę z zespołem inżynierskim. W pierwszym kwartale wybierzesz jeden proces finansowy, zbudujesz prototyp z klientami i zdefiniujesz kryteria bezpiecznego wdrożenia.\n\nNie oczekujemy znajomości każdego modelu. Oczekujemy umiejętności stawiania hipotez, prowadzenia eksperymentów i podejmowania decyzji na podstawie zachowania użytkowników.', 'lead', 'product', 'hybrid', array['Warszawa'], 'senior', 'employment', 22000, 29000, 'PLN', 'month', 'gross', 'published', 'employer_verified', '2026-09-28T09:00:00Z', '2026-11-30T23:59:59Z'),
  ('20000000-0000-4000-8000-000000000002', 'staff-ai-engineer', '10000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', 'Staff AI Engineer', 'Buduj systemy wspierające dokumentację kliniczną — z ewaluacją, nie magią.', E'Dołączysz do zespołu platformowego odpowiedzialnego za bezpieczne użycie modeli językowych. Zaprojektujesz ewaluacje, obserwowalność i mechanizmy human-in-the-loop dla funkcji używanych przez personel medyczny.\n\nNajważniejsze będą dla nas doświadczenie produkcyjne, rozumienie ograniczeń modeli oraz umiejętność współpracy z ekspertami domenowymi.', 'build', 'engineering', 'remote', array['Polska'], 'lead', 'b2b', 30000, 39000, 'PLN', 'month', 'net', 'published', 'editorial', '2026-09-25T09:00:00Z', '2026-12-15T23:59:59Z'),
  ('20000000-0000-4000-8000-000000000003', 'senior-product-designer-ai', '10000000-0000-4000-8000-000000000003', null, 'Senior Product Designer — AI', 'Projektuj doświadczenia, w których użytkownik rozumie i kontroluje działanie AI.', E'Będziesz prowadzić projekty od badań po wdrożenie, pracując bezpośrednio z klientami B2B. Szukamy osoby, która umie prototypować zachowanie systemów AI, projektować momenty kontroli i testować z realnymi użytkownikami.\n\nPortfolio powinno pokazywać tok rozumowania, kompromisy i efekt, nie tylko końcowe ekrany.', 'apply', 'design', 'hybrid', array['Wrocław', 'Warszawa'], 'senior', 'b2b', 18000, 24000, 'PLN', 'month', 'net', 'published', 'employer_verified', '2026-09-20T09:00:00Z', '2026-11-20T23:59:59Z'),
  ('20000000-0000-4000-8000-000000000004', 'ai-operations-specialist', '10000000-0000-4000-8000-000000000001', null, 'AI Operations Specialist', 'Automatyzuj powtarzalne procesy i ucz zespół bezpiecznej pracy z AI.', E'Zmapujesz procesy w finansach i obsłudze klienta, zbudujesz małe automatyzacje i będziesz mierzyć ich jakość. To rola dla osoby, która potrafi łączyć narzędzia no-code, analizę danych i uważność na potrzeby ludzi.\n\nWażniejsza od liczby certyfikatów jest umiejętność pokazania wdrożenia oraz jego mierzalnego efektu.', 'apply', 'operations', 'onsite', array['Warszawa'], 'mid', 'employment', 11000, 16000, 'PLN', 'month', 'gross', 'published', 'unverified', '2026-09-16T09:00:00Z', '2026-11-16T23:59:59Z'),
  ('20000000-0000-4000-8000-000000000005', 'growth-lead-ai-products', '10000000-0000-4000-8000-000000000002', null, 'Growth Lead — AI Products', 'Znajdź powtarzalny sposób docierania do zespołów medycznych.', E'Poprowadzisz eksperymenty wzrostowe dla nowej linii produktów. Będziesz współpracować z produktem, sprzedażą i compliance, aby budować pętle uczenia zamiast kampanii oderwanych od doświadczenia użytkownika.\n\nSzukamy osoby, która umie używać AI do przyspieszenia pracy, ale potrafi też rozpoznać, kiedy automatyzacja obniża jakość sygnału.', 'lead', 'marketing', 'remote', array['Europa'], 'lead', 'employment', 65000, 82000, 'EUR', 'year', 'gross', 'published', 'editorial', '2026-09-10T09:00:00Z', '2026-11-10T23:59:59Z'),
  ('20000000-0000-4000-8000-000000000006', 'machine-learning-engineer', '10000000-0000-4000-8000-000000000003', null, 'Machine Learning Engineer', 'Wdrażaj małe, dobrze zmierzone funkcje ML w produktach klientów.', E'Będziesz pracować w małym zespole nad prototypami, pipeline''ami danych i ewaluacją. Projekty szybko przechodzą od eksperymentu do produkcji, dlatego liczy się odpowiedzialność za cały cykl życia rozwiązania.\n\nDobrze odnajdzie się tu osoba z solidnym Pythonem i doświadczeniem w pracy z zespołem produktowym.', 'build', 'data', 'hybrid', array['Wrocław'], 'mid', 'b2b', 19000, 26000, 'PLN', 'month', 'net', 'published', 'editorial', '2026-09-08T09:00:00Z', '2026-11-08T23:59:59Z');

insert into public.job_text_versions (job_id, version, source, visibility, title, summary, description, approved_at)
select id, 1, 'human', 'public', title, summary, description, published_at
from public.jobs
on conflict (job_id, version) do nothing;

insert into public.organizations (id, company_id, name, slug)
values
  ('40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'BrightLabs', 'brightlabs'),
  ('40000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'Northstar Health', 'northstar-health'),
  ('40000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'Plain Sight', 'plain-sight')
on conflict (id) do update set name = excluded.name;
