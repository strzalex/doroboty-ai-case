"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="standalone">
      <h1>Coś poszło nie tak.</h1>
      <p className="lede">
        Nie udało się wczytać tego widoku. Twoje zapisane dane nie zostały zmienione.
      </p>
      <Button onClick={reset}>Spróbuj ponownie</Button>
    </main>
  );
}
