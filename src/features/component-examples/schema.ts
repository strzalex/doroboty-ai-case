import { z } from "zod";
export const exampleInputSchema = z.object({
  name: z.string().trim().min(2, "Podaj co najmniej 2 znaki.").max(80, "Podaj najwyżej 80 znaków."),
  email: z.email("Podaj poprawny adres email."),
});
export type ExampleInput = z.infer<typeof exampleInputSchema>;
