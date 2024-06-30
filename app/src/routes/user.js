import { Router } from "express";
import { createUser } from "../controllers/user.js";

export const userRouter = Router();

userRouter.post("/create", createUser);
