import { Router } from "express";
import { getAllProducts } from "../controllers/index.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getAllProducts);
// router.create("/create", createProduct);
// router.put("/update/:id", updateProduct);
// router.delete("/delete/:id", deleteProduct);

export default router;
