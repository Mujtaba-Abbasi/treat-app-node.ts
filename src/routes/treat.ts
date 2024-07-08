import { Router } from "express";
import { createTreat } from "../controllers";

export const treatRouter = Router();

treatRouter.post("/create", createTreat);
