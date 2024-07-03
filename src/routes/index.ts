import { userRouter } from "./user";

export const useRoutes = (app) => {
  app.use("/user", userRouter);
};
