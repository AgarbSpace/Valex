import { Router } from "express";
import * as cardController from "../controllers/cardController.js"
import * as validationsMiddleware from "../middlewares/validationsMiddleware.js"
import activateCardForm from "../schemas/activateCardFormSchema.js";
import balanceSchema from "../schemas/balanceFormShema.js";

const cardRouter = Router();

cardRouter.post("/create-card", validationsMiddleware.validateApiKey, validationsMiddleware.validateCardType, cardController.createCard);
cardRouter.post("/activate-card", validationsMiddleware.validateSchema(activateCardForm), cardController.activateCard);
cardRouter.get("/balance", validationsMiddleware.validateSchema(balanceSchema), cardController.balance);
export default cardRouter;