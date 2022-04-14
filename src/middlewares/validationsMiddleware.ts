import * as companyService from "../services/companyService.js"
import { Request, Response, NextFunction } from "express";

export async function validateApiKey(request: Request, response: Response, next: NextFunction){
    
    const apiKey = request.headers.authorization;
    const company = companyService.findCompanyByApiKey(apiKey);
    response.locals = {company: company};
    next();
}

export async function validateCardType(request: Request, response: Response, next: NextFunction){
    const businessType = request.body.type;
    
    if(businessType !== "groceries" && businessType !== "restaurants" 
        && businessType !== "transport" && businessType !== "education" 
        && businessType !== "health"){

        throw {type: "Invalid_Entity", message: "This type is invalid!"};
    }

    response.locals = {type: businessType}
    next();
}

