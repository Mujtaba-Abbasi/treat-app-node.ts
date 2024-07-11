import { Router } from "express";
import { login, logout, register } from "../controllers";
import { validate } from "../middlewares";
import { LoginSchema, RegisterSchema } from "../utils";

export const authRouter = Router();

authRouter.post("/login", validate(LoginSchema), login);
authRouter.post("/register", validate(RegisterSchema), register);

authRouter.get("/logout", logout);
