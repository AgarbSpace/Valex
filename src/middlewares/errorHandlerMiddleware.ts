import { Request, Response, NextFunction} from "express"

export default function errorHandlerMiddleware(error, request: Request, response: Response, next){

    if(error.type === "Conflict"){
        return response.sendStatus(409);
    }

    if(error.type === "Not_Found"){
        return response.sendStatus(404);
    }

    if(error.type === "Unprocessable_Entity"){
        return response.sendStatus(422);
    }

    console.log(error);
    return response.sendStatus(500);
}