import { z } from "zod";
import {
  CreateTreatSchema,
  LoginSchema,
  RegisterSchema,
  UpdateTreatSchema,
} from "./schemaValidations";

export type CreateTreatSchemaType = z.infer<typeof CreateTreatSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type UpdateTreatSchemaType = z.infer<typeof UpdateTreatSchema>;
