"use client";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExampleForm } from "@/features/component-examples/example-form";
export default function Page() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <AppShell mode="demo">
      <div className="page-heading">
        <div>
          <h1>Components</h1>
          <p>A shared visual language for your application.</p>
        </div>
      </div>
      <section className="component-section">
        <h2>Buttons</h2>
        <p>One primary action with secondary actions alongside it.</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setOpen(true)}>Open form</Button>
          <Button variant="outline" onClick={() => setMessage("The secondary button works.")}>
            Secondary
          </Button>
          <Button disabled>Unavailable</Button>
        </div>
      </section>
      <section className="component-section">
        <h2>Fields and validation</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="field">
            <Label htmlFor="sample-name">Name</Label>
            <Input id="sample-name" placeholder="e.g. Anna" />
          </div>
          <div className="field">
            <Label htmlFor="sample-error">Field with an error</Label>
            <Input
              id="sample-error"
              defaultValue="A"
              aria-invalid="true"
              aria-describedby="sample-error-help"
            />
            <p className="error-message" id="sample-error-help">
              Enter at least 2 characters.
            </p>
          </div>
        </div>
      </section>
      <section className="component-section">
        <h2>Statuses</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="outline">In progress</Badge>
          <Badge>Done</Badge>
        </div>
      </section>
      <section className="component-section">
        <h2>Loading</h2>
        <Skeleton className="h-5 w-2/5 mb-3" />
        <Skeleton className="h-16 w-full" />
      </section>
      <p role="status">{message}</p>
      {open && (
        <ExampleForm
          onClose={() => setOpen(false)}
          onValid={() => {
            setMessage("The form is valid. No data was saved.");
          }}
        />
      )}
    </AppShell>
  );
}
