import joi, { number } from "joi";

const paymentForm = joi.object({
    cardId: joi.number().required(),
    password: joi.string().required(),
    amount: joi.number().required(),
    businessId: joi.number().required()
})

export default paymentForm;