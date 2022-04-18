import { Request, Response } from "express";
import * as paymentService from "../services/paymentService.js"

export async function payment(request: Request, response: Response){

    const paymentData = request.body;
    
    await paymentService.insertPayment(paymentData);

    response.sendStatus(200);
}