import { Application } from "express";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { treatRouter } from "./treat";

export const useRoutes = (app: Application) => {
  app.use("/user", userRouter);
  app.use("/auth", authRouter);
  app.use("/treat", treatRouter);
};
