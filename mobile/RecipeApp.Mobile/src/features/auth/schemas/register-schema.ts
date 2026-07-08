import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı."),
  email: z.string().min(1, "Email zorunlu.").email("Geçerli bir email gir."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
