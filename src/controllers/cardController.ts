import { Request, Response } from "express";
import * as employeeService from "../services/employeeService.js"
import * as cardService from "../services/cardService.js"

export async function createCard(request: Request, response: Response){
    
    const {employeeId, type, isVirtual} = request.body;
    const employee = await employeeService.findRegisteredEmployee(employeeId);
    await employeeService.findEmployeeCardType(type, employeeId);
    const cardData = await cardService.createCardDetails(employeeId, type, isVirtual, employee.fullName);
    await cardService.insertCard(cardData);
    response.sendStatus(200);
}

export async function activateCard(request: Request, response: Response){
    const cardData = request.body;

    const card = await cardService.activateCardById(cardData);

    response.sendStatus(200);
}