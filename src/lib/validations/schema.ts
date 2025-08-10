import { z } from "zod";

export const todoSchema = z.object({
  item: z
    .string()
    .min(1, "Todo item is required")
    .max(100, "Todo item must be less than 100 characters")
    .trim(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must be less than 50 characters")
      .trim(),

    lastName: z
      .string()
      .max(50, "Last name must be less than 50 characters")
      .trim()
      .optional()
      .or(z.literal("")),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    phoneNumber: z.string().optional().or(z.literal("")), 

    countryCode: z.string().min(1, "Country code is required"), 

    country: z.string().min(1, "Please select your country"),

    bio: z
      .string()
      .max(500, "Bio must be less than 500 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type TodoInput = z.infer<typeof todoSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
