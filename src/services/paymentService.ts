import dayjs from "dayjs";
import bcrypt from "bcrypt"
import * as cardRepository from "../repositories/cardRepository.js"
import * as businessRepository from "../repositories/businessRepository.js"
import * as rechargeRepository from "../repositories/rechargeRepository.js"
import * as paymentRepository  from "../repositories/paymentRepository.js"

export async function insertPayment(paymentData){
    if(paymentData.amount <= 0){
        throw {type: "Unprocessable_Entity", message: "Amount must have bigger than 0"}
    }

    const card = await cardRepository.findById(paymentData.cardId);

    if(!card){
        throw {type: "Not_Found", message: "This card was not found"}
    }

    if(card.isBlocked === true){
        throw {type: "Unprocessable_Entity", message: "This card is blocked"}
    }

    const expirationDate = card.expirationDate;
    const today = dayjs().format("MM/YY");

    if(dayjs("today").isAfter(expirationDate) === true){
        throw {type: "Unprocessable_Entity", message: "Thiscard is expired"}
    }

    if(!bcrypt.compareSync(paymentData.password, card.password)){
        throw {type: "Unprocessable_Entity", message: "Invalid data"}
    }
    
    delete paymentData.password;

    const business = await businessRepository.findById(paymentData.businessId);

    if(!business){
        throw {type: "Not Found", message: "This business was not found"}
    }

    if(card.type !== business.type){
        throw {type: "Unprocessable_Entity", message: "Business and Card type are different"}
    }

    const balances = await rechargeRepository.findByCardId(paymentData.cardId);

    let totaBalance = 0
    const balance = balances.map(amount => {
        totaBalance = totaBalance + amount.amount
    })

    if(totaBalance < paymentData.amount){
        throw {type: "Unprocessable_Entity", message: "No enough balance"}
    }


    await paymentRepository.insert(paymentData);

}