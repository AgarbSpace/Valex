import { Request, Response } from "express";
import * as rechargeService from "../services/rechargeService.js"

export async function recharge(request: Request, response: Response){
    const data = request.body;

    await rechargeService.cardRecharge(data);

    response.sendStatus(200);
}