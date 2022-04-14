import * as companyRepository from "../repositories/companyRepository.js"

export async function findCompanyByApiKey(apiKey: string){
    const company = await companyRepository.findByApiKey(apiKey);

    if(!company){
        throw {type: "Conflict", message: "Company not found"}
    }

    return company;
}

export async function findBusinessByType(businessType: string){
    
}