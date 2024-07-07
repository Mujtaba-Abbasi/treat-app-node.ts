import { Router } from "express";
import { deleteUser, getUserById } from "../controllers/user";

export const userRouter = Router();

userRouter.get("/:id?", getUserById);

userRouter.delete("/delete/:id", deleteUser);
