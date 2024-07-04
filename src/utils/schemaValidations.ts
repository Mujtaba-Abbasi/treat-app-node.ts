import { z } from "zod";
import { VALIDATIONS } from "../constants";

export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a valid email address",
    })
    .email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error:
        "Password must be at least 8 characters containing uppercase, lowercase and special characters",
    })
    .min(8)
    .regex(VALIDATIONS.password, {
      message:
        "Password must be at least 8 characters containing uppercase, lowercase and special characters",
    }),
});
