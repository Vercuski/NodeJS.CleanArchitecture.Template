import { z } from "zod";

export const registerUserInputSchema = z.object({
  email: z.string(),
  displayName: z.string(),
});

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;

export interface RegisterUserOutput {
  id: string;
  email: string;
  displayName: string;
}
