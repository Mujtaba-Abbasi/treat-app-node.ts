import { userRouter } from "./user.js";

export const useRoutes = (app) => {
  app.use("/user", userRouter);
};
