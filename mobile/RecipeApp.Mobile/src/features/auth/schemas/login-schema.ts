import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email zorunlu.").email("Geçerli bir email gir."),
  password: z.string().min(1, "Şifre zorunlu."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
