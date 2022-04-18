import { Router } from "express";
import * as cardController from "../controllers/cardController.js"
import * as validationsMiddleware from "../middlewares/validationsMiddleware.js"
import activateCardForm from "../schemas/activateCardFormSchema.js";

const cardRouter = Router();

cardRouter.post("/create-card", validationsMiddleware.validateApiKey, validationsMiddleware.validateCardType, cardController.createCard);
cardRouter.post("/activate-card", validationsMiddleware.validateSchema(activateCardForm), cardController.activateCard);
export default cardRouter;