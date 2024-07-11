import { z } from "zod";
import { USER_ROLE, VALIDATIONS } from "../constants";

const userRoles = [USER_ROLE.Admin, USER_ROLE.Member] as const;

export const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be between 3 and 30 characters long.")
    .max(30, "Username must be between 3 and 30 characters long.")
    .regex(/^[a-zA-Z][a-zA-Z0-9._]{1,28}[a-zA-Z0-9]$/, {
      message: "Invalid username format.",
    })
    .refine((value) => !value.includes("..") && !value.includes("__"), {
      message: "Username cannot have consecutive periods or underscores.",
    })
    .refine((value) => /^[a-zA-Z][a-zA-Z0-9._]*$/.test(value), {
      message:
        "Username can only contain letters, numbers, periods, and underscores.",
    })
    .refine((value) => /[a-zA-Z0-9]$/.test(value), {
      message: "Username must end with a letter or a number.",
    })
    .refine((value) => /^[a-zA-Z]/.test(value), {
      message: "Username must start with a letter.",
    }),
  password: z.string().min(8).regex(VALIDATIONS.password, {
    message:
      "Password must be at least 8 characters containing uppercase, lowercase and special characters",
  }),
  role: z.enum(userRoles, {
    message: "Kindly provide a valid role",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(8).regex(VALIDATIONS.password, {
    message:
      "Password must be at least 8 characters containing uppercase, lowercase and special characters",
  }),
});

export const CreateTreatSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
});

export const UpdateTreatSchema = z.object({
  id: z.string({
    required_error: "Id is required",
    invalid_type_error: "Id must be a valid uuid",
  }),
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
});
