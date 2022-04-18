import joi from "joi";

const rechargeForm = joi.object({
    cardId: joi.number().required(),
    amount: joi.number().required()
});

export default rechargeForm;