import { Router } from "express";
import {
  createTreat,
  updateTreat,
  deleteTreat,
  getAllTreats,
} from "../controllers";
import { validate } from "../middlewares";
import { CreateTreatSchema, UpdateTreatSchema } from "../utils";

export const treatRouter = Router();

treatRouter.get("/getAll/:id?", getAllTreats);

treatRouter.post("/create", validate(CreateTreatSchema), createTreat);
treatRouter.post("/update", validate(UpdateTreatSchema), updateTreat);
treatRouter.delete("/delete/:id", deleteTreat);
