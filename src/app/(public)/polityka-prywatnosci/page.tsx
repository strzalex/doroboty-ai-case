import type { Metadata } from "next";

export const metadata: Metadata = { title: "Polityka prywatności" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
      <p className="font-ui text-sm font-bold tracking-[0.12em] uppercase">Informacja</p>
      <h1 className="mt-3 font-display text-6xl uppercase">Prywatność</h1>
      <div className="mt-8 space-y-8 text-lg leading-relaxed">
        <section>
          <h2 className="font-display text-3xl uppercase">Środowisko case study</h2>
          <p className="mt-3">
            Ta aplikacja służy do nauki w programie AI Product Heroes 3. Wspólne środowiska
            szkoleniowe korzystają wyłącznie z danych syntetycznych.
          </p>
        </section>
        <section>
          <h2 className="font-display text-3xl uppercase">Konta uczestników</h2>
          <p className="mt-3">
            Dane logowania i treści w prywatnym wdrożeniu uczestnika są przetwarzane przez operatora
            tego wdrożenia. Nie wpisuj prawdziwych danych kandydatów do współdzielonych instancji
            kursowych.
          </p>
        </section>
        <section>
          <h2 className="font-display text-3xl uppercase">Analityka</h2>
          <p className="mt-3">
            Zdarzenia produktowe nie powinny zawierać CV, odpowiedzi aplikacyjnych, adresów e-mail
            ani innych danych osobowych. Operacyjne wyniki rekrutacji pozostają w bazie aplikacji.
          </p>
        </section>
      </div>
    </article>
  );
}
