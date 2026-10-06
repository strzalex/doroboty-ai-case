import { z } from "zod";
export const exampleInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter at least 2 characters.")
    .max(80, "Enter no more than 80 characters."),
  email: z.email("Enter a valid email address."),
});
export type ExampleInput = z.infer<typeof exampleInputSchema>;
