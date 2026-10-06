import Link from "next/link";
export default function NotFound() {
  return (
    <main className="standalone">
      <h1>Nie ma takiej strony.</h1>
      <p className="lede">Sprawdź adres lub wróć do przeglądu.</p>
      <Link className="text-link" href="/demo">
        Otwórz demo
      </Link>
    </main>
  );
}
