import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import bcrypt from "bcrypt"
import generatePassword from 'password-generator';
import * as cardRepository from '../repositories/cardRepository.js'

export async function createCardDetails(employeeId: number, type: string, isVirtual: boolean, employeeFullName: string){

    //const password = generatePassword(4, false, /\d/);
    const today = dayjs().add(5, 'years').format('MM/YY');
    const creditCardNumber = faker.finance.creditCardNumber('mastercard');
    const cardExists = await cardRepository.findByCardNumber(creditCardNumber);
    console.log("aq");
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
    //if(password.length !== 4){
        //throw {type: "Unprocessable_Entity", message: "Password must have 4 characters"}
    //}
    
    const card = await cardRepository.findById(cardData.cardId);
    if(!card){
        throw {type: "Not_Found", message: "This card was not found"}
    }

    console.log(card);

    if(card.isBlocked === false || card.password !== null){
        throw {type: "Unprocessable_Entity", message: "This card is already unlocked"}
    }

    if(!bcrypt.compareSync(cardData.cvc, card.securityCode)){
        throw {type: "Unprocessable_Entity", message: "Invalid data"}
    }

    const hashedpassword = bcrypt.hashSync(cardData.password, 10);
    await cardRepository.update(cardData.cardId, hashedpassword);


}