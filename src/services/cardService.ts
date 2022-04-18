import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import bcrypt from "bcrypt"
import * as cardRepository from '../repositories/cardRepository.js'
import * as rechargeRepositoy from "../repositories/rechargeRepository.js"
import * as paymentRepository from "../repositories/paymentRepository.js"

export async function createCardDetails(employeeId: number, type: string, isVirtual: boolean, employeeFullName: string){

    const today = dayjs().add(5, 'years').format('MM/YY');
    const creditCardNumber = faker.finance.creditCardNumber('mastercard');
    const cardExists = await cardRepository.findByCardNumber(creditCardNumber);
    
    if(cardExists){
        throw {type: "Conflict", message: "This card number already exists"}
    }

    const nameWithoutSpaces = employeeFullName.split(" ");
    const nameVerification = nameWithoutSpaces.map(currentName => {
        if(nameWithoutSpaces.indexOf(currentName) === 0){
            return currentName
        }

        if(nameWithoutSpaces.indexOf(currentName) !== (nameWithoutSpaces.length - 1) && currentName.length >= 3){
            return currentName[0].toUpperCase();
        }

        if(nameWithoutSpaces.indexOf(currentName) === (nameWithoutSpaces.length -1)){
            return currentName;
        }
    });
    const nameValidation = nameVerification.filter(currentName => currentName !== undefined);

    const nameFormated = nameValidation.toString().replace(/,/g, " ");
    const cvc = faker.finance.creditCardCVV();
    console.log(cvc);
    const hashedCvc = bcrypt.hashSync(cvc, 10);
    const cardDetails = {
        employeeId: employeeId,
        number: creditCardNumber,
        cardHolderName: nameFormated,
        securityCode: hashedCvc,
        expirationDate: today,
        password: null,
        isVirtual: isVirtual,
        originalCardId: null,
        isBlocked: true,
        type: type
    }

    return cardDetails;
}

export async function insertCard(cardData){
    await cardRepository.insert(cardData);
}

export async function activateCardById(cardData){
    const card = await cardRepository.findById(cardData.cardId);
    if(!card){
        throw {type: "Not_Found", message: "This card was not found"}
    }

    if(card.isBlocked === false || card.password !== null){
        throw {type: "Unprocessable_Entity", message: "This card is already unlocked"}
    }

    if(!bcrypt.compareSync(cardData.cvc, card.securityCode)){
        throw {type: "Unprocessable_Entity", message: "Invalid data"}
    }

    const hashedpassword = bcrypt.hashSync(cardData.password, 10);
    await cardRepository.update(cardData.cardId, hashedpassword);


}

export async function getBalance(cardId: number){

    const card = await cardRepository.findById(cardId);

    if(!card){
        throw {type: "Not_Found", message: "This card was not found"}
    }

    if(card.isBlocked === true){
        throw {type: "Unprocessable_Entity", message: "This card is blocked"}
    }

    const rechargesData = await rechargeRepositoy.findByCardId(cardId);
    const paymentsData = await paymentRepository.findByCardId(cardId);
    let totalRecharges = 0;
    let totalPayments = 0;

    const recharges = rechargesData.map(amount => {
        totalRecharges = totalRecharges+amount.amount;
    });
    const payments = paymentsData.map(amount => {
        totalPayments = totalPayments+amount.amount;
    });

    const balance = totalRecharges - totalPayments;

    const balanceData = {
        balance: balance,
        transactions: paymentsData,
        recharges: rechargesData
    }

    return balanceData;
}
