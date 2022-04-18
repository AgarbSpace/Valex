import { Router } from "express";
import * as rechargeController from "../controllers/rechargeController.js"
import * as validationsMiddleware from "../middlewares/validationsMiddleware.js"
import rechargeForm from "../schemas/rechargeFormSchema.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharge",validationsMiddleware.validateSchema(rechargeForm) ,validationsMiddleware.validateApiKey, rechargeController.recharge);

export default rechargeRouter;