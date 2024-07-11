import { Router } from "express";
import { createTreat, updateTreat, deleteTreat } from "../controllers";
import { validate } from "../middlewares";
import { CreateTreatSchema, UpdateTreatSchema } from "../utils";

export const treatRouter = Router();

treatRouter.post("/create", validate(CreateTreatSchema), createTreat);
treatRouter.post("/update", validate(UpdateTreatSchema), updateTreat);
treatRouter.delete("/delete/:id", deleteTreat);
