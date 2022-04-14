import { Request, Response } from "express";
import * as employeeService from "../services/employeeService.js"

export async function createCard(request: Request, response: Response){

    const id = request.body.id;
    const employee = await employeeService.findRegisteredEmployee(id);
    
}