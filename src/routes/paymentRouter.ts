import { Router } from "express";
import * as validationsMiddleware from "../middlewares/validationsMiddleware.js"
import * as paymentController from "../controllers/paymentController.js"
import paymentForm from "../schemas/paymentFormSchema.js";

const paymentRouter = Router();

paymentRouter.post("/payment", validationsMiddleware.validateSchema(paymentForm), paymentController.payment);

export default paymentRouter;