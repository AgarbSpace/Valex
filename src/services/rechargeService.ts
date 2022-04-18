import * as rechargeRepository from "../repositories/rechargeRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"
import dayjs from "dayjs";

export async function cardRecharge(data){
    if(data.amount <= 0){
        throw {type: "Unprocessable_Entity", message: "Amount must have bigger than 0"}
    }

    const card = await cardRepository.findById(data.cardId);

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

    await rechargeRepository.insert(data)
}