import * as companyService from "../services/companyService.js"
import { Request, Response, NextFunction } from "express";

export async function validateApiKey(request: Request, response: Response, next: NextFunction){
    
    const apiKey = request.headers.authorization;
    const key = apiKey?.replace("Bearer ", "");
    if(!key){
        throw {type: "Unauthorized", message: "Unauthorized"}
    }
    const company = await companyService.findCompanyByApiKey(key);
    response.locals = {company: company};
    next();
}

export async function validateCardType(request: Request, response: Response, next: NextFunction){
    const businessType = request.body.type;
    
    if(businessType !== "groceries" && businessType !== "restaurant" 
        && businessType !== "transport" && businessType !== "education" 
        && businessType !== "health"){

        throw {type: "Invalid_Entity", message: "This card type is invalid!"};
    }
    response.locals = {type: businessType}
    next();
}

export function validateSchema(schema){
    return (request: Request, response: Response, next: NextFunction) => {
        const validation = schema.validate(request.body);
        if (validation.error) {
            const error = validation.error.details.map(error => error.message)
            return response.status(422).send(error);
        }
        next();
    }
}
