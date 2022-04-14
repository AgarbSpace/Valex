import { Request, Response, NextFunction} from "express"

export default function errorHandlerMiddleware(error, response, request, next){

    if(error.type === "Conflict"){
        return response.sendStatus(409);
    }

    if(error.type === "Not_Found"){
        return response.sendStatus(404);
    }

    return response.sendStatus(500);
}