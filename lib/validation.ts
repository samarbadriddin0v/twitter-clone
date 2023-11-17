import * as z from "zod";

export const registerStep1Schema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
});

export const registerStep2Schema = z.object({
  password: z.string().min(6),
  username: z.string().min(3),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
