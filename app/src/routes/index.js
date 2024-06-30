import router from "./product.js";
import { userRouter } from "./user.js";

export const useRoutes = (app) => {
  app.use("/products", router);
  app.use("/user", userRouter);
};
