import { Router } from "express";
import { getUserById } from "../controllers/user";

export const userRouter = Router();

userRouter.get("/:id?", getUserById);
