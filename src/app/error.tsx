"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="standalone">
      <h1>Something went wrong.</h1>
      <p className="lede">Unable to load this page. Your saved data has not been changed.</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
