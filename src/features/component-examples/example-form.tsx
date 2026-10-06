"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { exampleInputSchema, type ExampleInput } from "./schema";
export function ExampleForm({ onClose, onValid }: { onClose: () => void; onValid: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExampleInput>({
    resolver: zodResolver(exampleInputSchema),
    defaultValues: { name: "", email: "" },
    mode: "onBlur",
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Example form</DialogTitle>
          <DialogDescription>Try form validation. No data is saved or sent.</DialogDescription>
        </DialogHeader>
        <form
          noValidate
          className="form-stack"
          onSubmit={handleSubmit(() => {
            onValid();
            onClose();
          })}
        >
          <div className="field">
            <Label htmlFor="example-name">Name</Label>
            <Input
              id="example-name"
              autoFocus
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "example-name-error" : undefined}
              {...register("name")}
            />
            {errors.name && (
              <p className="error-message" id="example-name-error">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="field">
            <Label htmlFor="example-email">Email</Label>
            <Input
              id="example-email"
              type="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "example-email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p className="error-message" id="example-email-error">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="form-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Validate form</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
