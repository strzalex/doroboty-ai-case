---
title: "Desk research: nieoczywisty zwrot dla job boardu AIPH 3"
project: AI Product Heroes 3
created: 2026-09-22
status: final
sources_cited: 15
hypothesis: "AI może poprawić pozorną zgodność ofert i kandydatów, jednocześnie osłabiając wartość informacji, na których opiera się dopasowanie."
disposition: mixed
tags: [desk-research, spanning-case, job-board, signaling]
---

# Nieoczywisty zwrot dla job boardu AIPH 3

**Decyzja:** wybrać mechanizm, który da się odkryć dopiero po połączeniu danych ilościowych, materiału jakościowego i wyników po aplikacji. Odrzucić proste wyjaśnienia w rodzaju nieaktualnych ofert i nadmiaru aplikacji na popularne role. Research: 22 września 2026.

## TL;DR

Najmocniejszą **propozycją**, nie potwierdzonym jeszcze kręgosłupem case'u, jest utrata wartości sygnałów po obu stronach rynku. Produkt pomaga firmom pisać dopracowane ogłoszenia, kandydatom dopracowane aplikacje, a potem liczy „fit” z tych dwóch tekstów. Problem: tekst może stać się lepszy językowo, a jednocześnie słabiej ujawniać rzeczywiste wymagania, gotowość do zatrudnienia i umiejętności. Duży [eksperyment z AI do pisania ogłoszeń](https://www.emmawiles.com/storage/jobot.pdf) zwiększył liczbę publikowanych ofert o 19%, lecz nie wykrył wzrostu zatrudnień; [badanie aplikacji na Freelancer.com](https://arxiv.org/abs/2509.25054) pokazało spadek związku między językowym dopasowaniem listu a odpowiedzią pracodawcy o 51%. **Nie ma jednego badania dowodzącego całego łańcucha „wynik matchingu w górę, zatrudnienia w dół”.** To musiałby być testowany mechanizm naszego fikcyjnego case'u. Istnieją też mocne kontrprzykłady, w których pomoc w pisaniu lub rekomendacje zwiększyły rzeczywiste zatrudnienie.

## 1. Problem i pytania

1. Czy zmiana produktu może poprawić widoczne wskaźniki podaży i dopasowania, ale nie poprawić efektów po aplikacji?
2. Czy AI zmienia tylko jakość tekstu, czy także to, **co tekst pozwala wywnioskować** o obu stronach rynku?
3. Jakie dane i rozmowy odróżniłyby ten mechanizm od słabych kandydatów, zamkniętych ofert i zwykłego przeciążenia rekruterów?
4. Jakie badania przeczą tezie, że AI automatycznie psuje sygnały i matching?

**Warunek obalenia propozycji:** po wprowadzeniu narzędzi AI tekstowe dopasowanie nadal tak samo dobrze przewiduje zaproszenia, akceptacje ofert i jakość pracy, a zawartość ogłoszeń pozostaje równie zgodna z faktycznymi wymaganiami pracodawców. Wtedy ten twist nie działa.

## 2. Przypadki rynkowe

**[Średnia pewność] Pisanie ogłoszeń.** W losowym eksperymencie na 180 324 nowych pracodawcach narzędzie AI podniosło szansę publikacji ogłoszenia o 5,6 punktu procentowego (około 19%) i skróciło czas pisania o 44%. Liczba zatrudnień na wylosowanego pracodawcę nie wzrosła w wykrywalny sposób: 6,6% w kontroli i mniej niż 6,7% w grupie z AI. Ogłoszenia były bardziej do siebie podobne, a dwie trzecie pracodawców publikujących szkic AI nie edytowało go. Wśród **opublikowanych** ogłoszeń odsetek zakończonych zatrudnieniem wyniósł 22% w kontroli i 19% po zaoferowaniu AI. Autorzy nie stwierdzili, by pula aplikujących była gorsza według dostępnych cech; na opublikowaną ofertę pracodawcy częściej dostawali kandydatów rekomendowanych przez platformę. Tego porównania nie należy czytać jako czystego efektu przyczynowego dla identycznych ofert: AI zmieniło również to, **kto w ogóle opublikował ofertę**. Autorzy szacują, że dodatkowy czas kandydatów poświęcony na aplikacje przewyższył oszczędność czasu pracodawców, ale jest to rachunek modelowy. [Wiles i Horton, _More, but Worse_, 2026](https://www.emmawiles.com/storage/jobot.pdf).

**[Średnia pewność] Pisanie aplikacji.** Po udostępnieniu narzędzia do pisania listów na Freelancer.com teksty były bardziej dostosowane do ofert, a początkowo częściej dostawały odpowiedź. W danych obejmujących około 5 mln listów i ponad 100 tys. ofert związek między tekstowym dopasowaniem a odpowiedzią spadł o 51%, a z ofertą pracy o 79%. Pracodawcy zaczęli bardziej polegać na historii wcześniejszych ocen. Wzrost odpowiedzi był słabo istotny statystycznie i zanikał po około dwóch miesiącach; badanie nie wykazało spadku łącznych zatrudnień. To analiza quasi-eksperymentalna, a nie losowy test całego rynku. [Cui, Dias i Ye, _Signaling in the Age of AI_, 2025/2026](https://arxiv.org/abs/2509.25054).

**[Średnia pewność] Tani certyfikat umiejętności.** W naturalnym eksperymencie usunięcie opłat za testy zwiększyło liczbę certyfikacji i przyspieszyło decyzje pracodawców, lecz wartość odznaki w ich oczach spadła. Nowi posiadacze certyfikatów wykonywali przeciętnie pracę niższej jakości; najmocniej ucierpieli początkujący bez wcześniejszych ocen. To alternatywny zwrot, ale obejmuje węższą część produktu. Publicznie dostępny abstrakt nie podaje skali efektu. [Bai i in., _All That Glitters Is Not Gold_, 2026](https://researchconnect.stonybrook.edu/en/publications/all-that-glitters-is-not-gold-the-impact-of-certification-test-co/).

## 3. Badania mechanizmu

**[Średnia pewność] Więcej poleru nie oznacza więcej informacji.** W dwóch eksperymentach listy pisane z pomocą LLM oceniono wyżej i miały o 39% mniej błędów gramatycznych, ale nie przyniosły więcej zaproszeń do rozmowy. Poprawa dotyczyła głównie standardowych części tekstu, podczas gdy rekruterzy bardziej cenili osobistą motywację i jasność. Sugerowany spadek jakości dopasowań na całym rynku pochodzi z modelu, nie z obserwacji zatrudnień. [Abbas Nejad i in., _Labor Market Signals_, przyjęte do _Journal of Labor Economics_](https://research.tilburguniversity.edu/en/publications/labor-market-signals-the-role-of-large-language-models-2/).

**[Średnia pewność] Trudniej rozpoznać prawdziwą kompetencję.** W kontrolowanych eksperymentach z 343 autorami i 801 osobami oceniającymi AI podniosło oceny prezentacji o 4–6%, ale błędy w rozpoznaniu kompetencji wzrosły o 4–9%. Nie jest to pomiar rzeczywistych rekrutacji. Efekt miał wyjątek: wśród osób z krajów nieanglojęzycznych AI czasem **poprawiało** rozpoznanie kompetencji. [Cowgill, Hernández-Lagos i Wright, _Does AI Cheapen Talk?_, _Management Science_](https://pubsonline.informs.org/doi/10.1287/mnsc.2024.07027).

## 4. Synteza: co jest rzeczywistym odkryciem dla kursanta

### Porównanie kandydatek na zwrot

| Kandydatka                                          | Co w niej zaskakuje                                                                                                                                                                             | Ocena dla spanning case'u                                                                                                                                                                                                           |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Utrata wartości sygnałów po obu stronach**        | Wynik tekstowego dopasowania może rosnąć, choć coraz słabiej przewiduje to, co strony zrobią po kontakcie.                                                                                      | Największy zasięg w produkcie i kilka niezależnych dróg odkrycia. Pełny łańcuch wymaga fikcyjnych danych case'u i testu.                                                                                                            |
| **Darmowa odznaka umiejętności**                    | Więcej „zweryfikowanych” kandydatów może obniżyć informacyjną wartość certyfikatu, najbardziej dla nowych osób.                                                                                 | Mocny udokumentowany zwrot, lecz węższy: dotyczy głównie profili i screeningu. [Bai i in.](https://researchconnect.stonybrook.edu/en/publications/all-that-glitters-is-not-gold-the-impact-of-certification-test-co/)               |
| **Anonimizacja CV**                                 | Wśród firm, które zgłosiły się do eksperymentu, anonimowe CV obniżyły szanse grup, którym miały pomóc; część pracodawców bez anonimizacji korzystała z kontekstu, by nie karać za inne sygnały. | Nieoczywiste, ale silnie zależne od selekcji firm i francuskiego kontekstu; zbyt łatwo nauczyć fałszywej reguły „anonimizacja szkodzi”. [Behaghel, Crépon i Le Barbanchon](https://www.aeaweb.org/articles?id=10.1257/app.20140185) |
| **Model ocenia tekst napisany przez ten sam model** | Przy identycznych kwalifikacjach AI może wyżej oceniać własny styl pisania.                                                                                                                     | Ciekawe, lecz dowody dotyczą symulacji selekcji CV, bez obserwowanych zatrudnień; za słabe na oś case'u. [Xu, Li i Jiang](https://arxiv.org/abs/2509.00462)                                                                         |

Twist nie powinien brzmieć „AI robi generyczne CV”. Brzmiałby: **platforma sama zmieniła znaczenie danych, na których nauczyła się rozpoznawać dopasowanie**. Przed ułatwieniem pisania szczegółowy opis roli mógł częściej odzwierciedlać rzeczywiste decyzje pracodawcy, a konkretna aplikacja mogła częściej ujawniać wysiłek i doświadczenie kandydata. Gdy oba teksty stały się tanie do wygenerowania, stary wynik „fit” mógł dalej poprawnie mierzyć podobieństwo słów, lecz gorzej przewidywać rozmowę i zatrudnienie. **Ten ostatni związek jest propozycją fabuły, nie ustalonym faktem z badań.**

Odkrycie wymagałoby trzech niezależnych elementów:

1. **Ilościowo:** w kohortach sprzed i po wprowadzeniu narzędzi AI kursant sprawdza, czy ten sam wynik tekstowego dopasowania coraz słabiej przewiduje rozmowę, ofertę i zatrudnienie. Porównuje podobne role i kandydatów; osobno śledzi, jak zmieniła się liczba ofert i aplikacji.
2. **Jakościowo:** rekruter nie mówi „AI jest złe”, tylko pokazuje dwie aplikacje ocenione jako podobnie trafne i wyjaśnia, z której może wywnioskować wykonane zadania. Pracodawca porównuje swój krótki pierwotny brief z ogłoszeniem, które AI opublikowało po minimalnej edycji. Kandydat pokazuje, które obietnice w opisie stanowiska okazały się niedookreślone podczas rozmowy.
3. **Wynik po spotkaniu stron:** kursant sprawdza, czy deklarowane wymagania i doświadczenie przewidują decyzję rekrutera oraz jakość pracy po zatrudnieniu. To pozwala odróżnić utratę informacji od samej niechęci rekruterów do AI lub zwykłego przeciążenia zgłoszeniami.

**Wiarygodny błędny ruch:** CEO widzi mało rozmów i chce lepszego rankingu opartego na opisach ofert i profili. Wskaźnik dopasowania rośnie, co wzmacnia jego pewność. Dopiero po połączeniu historii powstawania obu tekstów z rozmowami i wynikami po aplikacji widać, że model wiernie dopasowuje opisy, które przestały być wiernym opisem pracy i kandydatów. Nie oznacza to automatycznie, że należy wyłączyć AI. Pytanie produktowe brzmi: jak wydobywać sprawdzalne, istotne dla decyzji informacje od obu stron.

## 5. Kontrdowody i granice wniosku

**[Średnia pewność] Pomoc w pisaniu może zwiększyć zatrudnienie.** W losowym teście obejmującym niemal pół miliona kandydatów algorytm poprawiający język CV zwiększył szansę zatrudnienia o 8%, bez wykrywalnego pogorszenia zadowolenia pracodawców. Narzędzie poprawiało materiał napisany przez człowieka, a nie generowało od zera obszernej narracji. Zatem „AI w aplikacji” samo w sobie nie jest problemem. [van Inwegen, Munyikwa i Horton](https://arxiv.org/abs/2301.08083).

**[Średnia pewność] Rekomendacje mogą poprawić cały rynek.** Dwustronny eksperyment ze Szwecji, obejmujący 59 mln rekomendacji, wykazał wzrost zatrudnienia na poziomie rynku o 0,4% w ciągu kilku miesięcy. Łączna liczba aplikacji się nie zmieniła; zmienił się ich rozkład. To odrzuca tezę, że ranking jest z natury szkodliwy. [Le Barbanchon, Hensvik i Rathelot](https://jobsearchstudies.ilr.cornell.edu/papers/4dec4257-dd5d-4585-9bde-dbf989dd3955/).

**[Średnia pewność] Mniejszy wysiłek pracodawcy może pomóc, jeśli wsparcie obejmuje rekrutację, a nie tylko tekst.** W losowym eksperymencie z 7438 firmami we Francji pakiet usług rekrutacyjnych zwiększył liczbę ogłoszeń o 24%, a stałych zatrudnień przez urząd o 10%. Różnica wobec eksperymentu z generowanym opisem sugeruje, że znaczenie ma **rodzaj usuwanej pracy**, ale porównanie dwóch badań nie izoluje jednej przyczyny. [Algan, Crépon i Glover](https://www.povertyactionlab.org/evaluation/impact-recruiting-services-firms-job-postings-and-hiring-france).

**[Średnia pewność] Wiarygodne odznaki mogą pomóc początkującym.** Badanie mikrocertyfikatów na platformie pracy wykazało wyższe zarobki początkujących z certyfikatami. Przypadek darmowych testów pokazuje zmianę składu osób z odznaką, a nie ogólną wadę certyfikacji. [Kässi i Lehdonvirta](https://ora.ox.ac.uk/objects/uuid%3A353aef0b-d2da-4f9e-ab41-5b9c7de1cd6c).

**[Średnia pewność] W badaniu AI do listów poprawa odpowiedzi była początkowo realna.** Nie wolno wyciąć pierwszych dwóch miesięcy z historii i opowiedzieć jej jako czystej porażki. Nie zaobserwowano tam wiarygodnego spadku łącznych zatrudnień; możliwa szkoda dla nowych uczestników jest interpretacją do przetestowania. [Cui, Dias i Ye](https://arxiv.org/abs/2509.25054).

**[Średnia pewność] Tanie, konkretne informacje od pracodawcy mogą poprawić dopasowanie.** W eksperymencie ujawnienie kandydatom preferencji płacowej pracodawców pomogło skierować aplikacje i poprawić jakość dopasowań. Wniosek z naszego researchu nie może więc brzmieć „potrzebujemy kosztownego sygnału”; chodzi o sygnał, który jest **prawdziwy i użyteczny dla decyzji**. [Horton, Kircher i Johari](https://john-joseph-horton.com/papers/buyer-signaling-improves-matching-evidence-from-a-field-experiment/).

**[Średnia pewność] Weryfikacja może zamienić większą liczbę zgłoszeń w zatrudnienia.** W eksperymencie na portalu pracy w Indiach połączenie promocji ofert z weryfikacją tożsamości kandydatów zwiększyło zatrudnienia przez portal o 68% oraz prawdopodobieństwo obsadzenia wakatu o 11%. Same elementy osobno nie dały tego efektu. To silny kontrargument wobec ogólnej tezy, że zwiększanie widoczności lub liczby aplikacji jest bezwartościowe; zależy, czy druga strona otrzymuje wiarygodny materiał do decyzji. [Fernando, Singh i Tourek, _AER: Insights_](https://www.aeaweb.org/articles?id=10.1257/aeri.20220566).

**[Średnia pewność] AI może realnie wspomóc firmę po stronie wyboru.** W losowym eksperymencie na rynku pracy pracodawcy obsadzający stanowiska techniczne o 20% częściej zapełniali wakat, gdy dostawali rekomendacje konkretnych pracowników. To ogranicza uogólnienie „problem jest w AI matchingu”; w naszym wariancie kłopot dotyczyłby **wiarygodności danych wejściowych** dla modelu. [Horton, _Journal of Labor Economics_](https://www.journals.uchicago.edu/doi/10.1086/689213).

**[Średnia pewność] Eksperyment z generowaniem ogłoszeń nie wykazał spadku łącznej liczby zatrudnień.** Udział pracodawców, którzy zatrudnili kogokolwiek, wyniósł około 6,6% w kontroli i 6,7% po zaoferowaniu AI; różnica nie była istotna. Wskaźnik 22% wobec 19% dotyczy wyłącznie firm, które **zdecydowały się opublikować** ofertę, a narzędzie AI wpłynęło właśnie na tę decyzję. Nie można przypisać całego spadku w tej podgrupie gorszemu tekstowi: część nowo opublikowanych ofert może mieć inny poziom gotowości. Ponadto autorzy mierzyli zawarcie umowy w krótkim oknie właściwym platformie freelancerskiej. Pełnoetatowa rekrutacja AI-native może mieć inny rytm. [Wiles i Horton](https://www.emmawiles.com/storage/jobot.pdf).

**[Średnia pewność] Nieedytowany szkic AI nie jest dowodem, że firma nie chce nikogo zatrudnić.** Autorzy badania traktują czas i edycję jako pośrednie sygnały zaangażowania, lecz pracodawca może mieć jasne wymagania zapisane poza platformą i zaakceptować dobry pierwszy szkic bez zmian. Podobnie mała firma może napisać krótki, niedoskonały opis i bardzo potrzebować pracownika. Nasz case nie może oznaczać każdej oferty napisanej przez AI jako „pozornej”. Musi zestawić tekst z rzeczywistym briefem, budżetem, aktywnością w ocenie aplikacji i decyzją rekrutacyjną. Bez tego wrócilibyśmy do błędu pierwszej wersji: utożsamienia braku łatwego sygnału z brakiem prawdziwej oferty. [Wiles i Horton](https://www.emmawiles.com/storage/jobot.pdf).

**[Średnia pewność] Niektóre oferty pisane przez AI są dla czytelników równie użyteczne.** Trzy eksperymenty dotyczące odbioru ogłoszeń nie znalazły różnic w ocenie atrakcyjności, dopasowania i informacyjności między tekstami AI a ludzkimi. Dotyczyło to **percepcji**, nie późniejszego zatrudnienia, ale stanowi ważną granicę: nie da się z góry zakładać, że kandydat rozpozna AI po stylu lub że sam fakt generowania tekstu pogorszy jego decyzję. Również algorytm oceniający tylko język może nie wykryć problemu. Potrzebujemy porównania opisu z realną pracą oraz wyniku po kontakcie stron. [Klezl i in., _Personnel Review_, 2026](https://www.sciencedirect.com/science/article/pii/S0048348626000762).

**[Średnia pewność] Efekt na trafność oceny może zmienić znak.** W eksperymentach z pisaniem prezentacji przez AI średnio trudniej było odróżnić ekspertów od pozostałych, ale w grupie autorów z krajów nieanglojęzycznych AI zwiększało trafność ocen. Narzędzie usuwało tam barierę językową, za którą wcześniej kryła się prawdziwa kompetencja. Job board dla specjalistów AI-native może mieć międzynarodowych kandydatów; wyłączenie AI lub karanie jego użycia mogłoby dokładnie ich skrzywdzić. Należy mierzyć, czy AI zastępuje wiedzę, czy pomaga ją czytelnie przekazać, i sprawdzać to oddzielnie w segmentach. [Cowgill, Hernández-Lagos i Wright](https://pubsonline.informs.org/doi/10.1287/mnsc.2024.07027).

**[Niska pewność co do całego rynku] Utrata predykcyjności listów nie oznacza automatycznie utraty wartości dla wszystkich kandydatów.** W badaniu Freelancer.com dostęp do narzędzia początkowo zwiększał odpowiedzi, a korelacja tekstowego dopasowania z odpowiedzią osłabła. Autorzy nie wykazali jednak, że nowi kandydaci faktycznie tracili zatrudnienia ani że platforma zatrudniała mniej. Pracodawcy mogli racjonalnie przenieść uwagę na wcześniejsze oceny, ponieważ nowy tekst był mniej użyteczny; mogli też nadmiernie karać brak reputacji. Te dwie interpretacje prowadzą do innych rozwiązań. W case'ie rozstrzyga je dopiero późniejsza jakość pracy osób, które miały słabą reputację, lecz mocne próbki zadań. [Cui, Dias i Ye](https://arxiv.org/abs/2509.25054).

**[Granica całej syntezy] Nie ma jednego eksperymentu obejmującego oba narzędzia naraz.** Wzrost podobieństwa tekstowego między opisem stanowiska i aplikacją jest logiczną możliwością, ale jego skala i wpływ na wynik nie zostały zmierzone w przytoczonych badaniach. Dlatego w case'ie nie można podać tej relacji jako gotowego odkrycia: uczestnik musi ją wyliczyć z danych i szukać niezależnego potwierdzenia w wywiadach oraz rezultatach rekrutacji. [Wiles i Horton](https://www.emmawiles.com/storage/jobot.pdf), [Cui, Dias i Ye](https://arxiv.org/abs/2509.25054).

## 6. Wniosek projektowy

Rekomendacja: **dalej rozwijać dwustronną utratę wartości sygnałów jako kandydatkę na lekcję nośną**, bez nazywania jej jeszcze kanonem. To jedyny znaleziony mechanizm, który obejmuje tworzenie ofert, profile kandydatów, ranking, zachowanie rekruterów i wynik zatrudnienia, a jego sedno nie jest widoczne w pojedynczym dashboardzie. Najsilniejszy bezpośredni dowód dotyczy strony pracodawcy. Strona kandydata wzmacnia historię, ale cały łańcuch jest syntezą różnych badań.

Zanim powstanie pełny arc, trzeba zbudować minimalny model danych i sprawdzić, czy po zmianie narzędzi AI przewidywalność wyników przez tekstowy „fit” rzeczywiście słabnie. Jeśli nie, należy odrzucić ten wariant. Nie rozwiązywać fabuły regułą „zakaz AI” ani przymusowym utrudnianiem aplikacji. Bardziej obiecujące kierunki do testowania to konkretny brief pracodawcy, próbki wykonanej pracy i jawne potwierdzenie kryteriów decyzji; badania powyżej **nie potwierdzają jeszcze**, że te konkretne interwencje zadziałają w naszym case'ie.

## 7. Luki i następne kroki

- Nie znaleziono eksperymentu, który jednocześnie zmienia tworzenie ofert i aplikacji przez AI, mierzy wynik matchingu oraz późniejszą jakość zatrudnienia.
- W badaniu ogłoszeń nie rozdzielono eksperymentalnie dwóch przyczyn: wejścia pracodawców o niższej gotowości i mniej informacyjnych tekstów.
- Wyniki platform freelancerskich mogą nie przenieść się na pełnoetatowe role AI-native, gdzie proces trwa dłużej.
- Wersja case'u wymaga zaprojektowania obserwowalnych danych, które odróżnią ten mechanizm od złej jakości kandydatów i zwykłego spadku popytu na rynku.

## 8. Bibliografia

- [Preprint] Wiles, E. i Horton, J. (2026). [_More, but Worse: The Marketplace Effects of AI-Generated Job Posts_](https://www.emmawiles.com/storage/jobot.pdf). Dostęp 2026-09-22.
- [Preprint] Cui, J., Dias, G. i Ye, J. (2025/2026). [_Signaling in the Age of AI: Evidence from Cover Letters_](https://arxiv.org/abs/2509.25054). Dostęp 2026-09-22.
- [Artykuł] Bai, J., Gao, Q., Goes, P. i Lin, M. (2026). [_All That Glitters Is Not Gold_](https://researchconnect.stonybrook.edu/en/publications/all-that-glitters-is-not-gold-the-impact-of-certification-test-co/). _Information Systems Research_. Dostęp 2026-09-22.
- [Artykuł przyjęty] Abbas Nejad, K. i in. (2026). [_Labor Market Signals: The Role of Large Language Models_](https://research.tilburguniversity.edu/en/publications/labor-market-signals-the-role-of-large-language-models-2/). _Journal of Labor Economics_. Dostęp 2026-09-22.
- [Artykuł] Cowgill, B., Hernández-Lagos, P. i Wright, N. (2026). [_Does AI Cheapen Talk?_](https://pubsonline.informs.org/doi/10.1287/mnsc.2024.07027). _Management Science_. Dostęp 2026-09-22.
- [Artykuł] van Inwegen, E., Munyikwa, Z. i Horton, J. (2025). [_Algorithmic Writing Assistance on Jobseekers’ Resumes Increases Hires_](https://arxiv.org/abs/2301.08083). _Management Science_. Dostęp 2026-09-22.
- [Preprint] Le Barbanchon, T., Hensvik, L. i Rathelot, R. (2026). [_How Can AI Improve Search and Matching?_](https://jobsearchstudies.ilr.cornell.edu/papers/4dec4257-dd5d-4585-9bde-dbf989dd3955/). Dostęp 2026-09-22.
- [Eksperyment] Algan, Y., Crépon, B. i Glover, D. (2020). [_Impact of Recruiting Services on Firms' Job Postings and Hiring in France_](https://www.povertyactionlab.org/evaluation/impact-recruiting-services-firms-job-postings-and-hiring-france). Dostęp 2026-09-22.
- [Artykuł] Kässi, O. i Lehdonvirta, V. (2022). [_Do microcredentials help new workers enter the market?_](https://ora.ox.ac.uk/objects/uuid%3A353aef0b-d2da-4f9e-ab41-5b9c7de1cd6c). _Journal of Human Resources_. Dostęp 2026-09-22.
- [Eksperyment] Horton, J., Kircher, P. i Johari, R. (2024). [_Buyer Signaling Improves Matching_](https://john-joseph-horton.com/papers/buyer-signaling-improves-matching-evidence-from-a-field-experiment/). Dostęp 2026-09-22.
- [Artykuł] Fernando, A. N., Singh, N. i Tourek, G. (2023). [_Hiring Frictions and the Promise of Online Job Portals_](https://www.aeaweb.org/articles?id=10.1257/aeri.20220566). _AER: Insights_. Dostęp 2026-09-22.
- [Artykuł] Horton, J. (2017). [_The Effects of Algorithmic Labor Market Recommendations_](https://www.journals.uchicago.edu/doi/10.1086/689213). _Journal of Labor Economics_. Dostęp 2026-09-22.
- [Artykuł] Behaghel, L., Crépon, B. i Le Barbanchon, T. (2015). [_Unintended Effects of Anonymous Resumes_](https://www.aeaweb.org/articles?id=10.1257/app.20140185). _American Economic Journal: Applied Economics_. Dostęp 2026-09-22.
- [Preprint] Xu, Li i Jiang (2025). [_AI Self-preferencing in Algorithmic Hiring_](https://arxiv.org/abs/2509.00462). Dostęp 2026-09-22.
- [Artykuł] Klezl, V. i in. (2026). [_Exploring perceptions of AI-generated job advertisements_](https://www.sciencedirect.com/science/article/pii/S0048348626000762). _Personnel Review_. Dostęp 2026-09-22.

## 9. Metoda

Zastosowano metodę desk research produktu: równoległy przegląd przypadków platform i badań naukowych, następnie zestawienie zgodnych i sprzecznych wyników. Przejrzano 32 źródła, z czego 15 cytowano w raporcie; liczby znalezisk z obu przeglądów nakładają się, bo część badań pojawiła się w obu. Dwa szkice case'u z nieaktualnymi ofertami i przeciążeniem aplikacjami oceniono jako zbyt łatwe do odgadnięcia. Raport służy wyborowi mechanizmu, a nie potwierdza skuteczności rozwiązania dla fikcyjnego job boardu.
