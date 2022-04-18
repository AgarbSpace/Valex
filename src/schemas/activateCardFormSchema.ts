import joi from "joi";

const activateCardForm = joi.object ({
    cardId: joi.number().required(),
    cvc: joi.string().regex(/[0-9]{3}/).required(),
    password: joi.string().regex(/[0-9]{4}/).required()
})

export default activateCardForm;