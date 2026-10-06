import Link from "next/link";
export default function NotFound() {
  return (
    <main className="standalone">
      <h1>Page not found.</h1>
      <p className="lede">Check the URL or return to the dashboard.</p>
      <Link className="text-link" href="/demo">
        Open demo
      </Link>
    </main>
  );
}
