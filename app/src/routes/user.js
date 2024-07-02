import { Router } from "express";
import { createUser, getUserById } from "../controllers/user.js";

export const userRouter = Router();

userRouter.post("/create", createUser);

userRouter.get("/:id", getUserById);
