import { Request, Response, NextFunction} from "express"

export default function errorHandlerMiddleware(error, request: Request, response: Response, next){

    if(error.type === "Conflict"){
        console.log(error.message)
        return response.sendStatus(409);
    }

    if(error.type === "Not_Found"){
        console.log(error.message)
        return response.sendStatus(404);
    }

    if(error.type === "Unprocessable_Entity"){
        console.log(error.message);
        return response.sendStatus(422);
    }

    console.log(error);
    return response.sendStatus(500);
}