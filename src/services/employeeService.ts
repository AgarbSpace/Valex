import * as employeeRepository from "../repositories/employeeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"

export async function findRegisteredEmployee(id: number){
    const employee = await employeeRepository.findById(id);

    if(!employee){
        throw {type: "Not_Found", message: "Employee not found"};
    }
    
    return employee;
}

export async function findEmployeeCardType(type: cardRepository.TransactionTypes, id: number){
    const employeeCard = await cardRepository.findByTypeAndEmployeeId(type, id)
    
    if(employeeCard){
        throw {type: "Conflict", message: "This employee already have this card type"}
    }
    
}