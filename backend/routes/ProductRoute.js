import express  from "express";
import {
    getProducts,
    getProductById,
    saveProduct,
    updateProducts,
    deleteProducts
} from "../controllers/ProductController.js"
const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.post("/products", saveProduct);
router.patch("/products/:id", updateProducts);
router.delete("/products/:id", deleteProducts);

export default router;