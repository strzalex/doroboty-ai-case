import Link from "next/link";
export default function NotFound() {
  return (
    <main className="standalone">
      <h1>Nie znaleźliśmy tej strony.</h1>
      <p className="lede">Adres mógł się zmienić albo oferta nie jest już publiczna.</p>
      <Link className="text-link" href="/oferty">
        Zobacz aktualne oferty
      </Link>
    </main>
  );
}
