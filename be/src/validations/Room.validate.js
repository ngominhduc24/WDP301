import Joi from "joi";

const RoomValidate = {
    validateUpdate: Joi.object({
        status:Joi.string().valid("Empty","Full","Available"),
        quantityMember: Joi.number(),
        roomType: Joi.string().valid('normal','premium'),
        roomPrice: Joi.number(),
        deposit: Joi.number(),
        area: Joi.number(),

    })
}

export default RoomValidate