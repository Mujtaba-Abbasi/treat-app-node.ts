import { Router } from "express";
import { login, logout } from "../controllers";
import { validate } from "../middlewares";
import { LoginSchema } from "../utils";

export const authRouter = Router();

authRouter.post("/login", validate(LoginSchema), login);
authRouter.get("/logout", logout);
