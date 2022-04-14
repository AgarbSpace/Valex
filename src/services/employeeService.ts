import * as employeeRepository from "../repositories/employeeRepository.js"

export async function findRegisteredEmployee(id: number){
    const employee = await employeeRepository.findById(id);

    if(!employee){
        throw {type: "Not_Found", message: "Employee not found"};
    }

    return employee;
}