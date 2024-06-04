import Joi from "joi";

export const statisticsSchema = Joi.object({
  startDate: Joi.date().required().messages({
    "date.base": "Start date must be a valid date",
    "any.required": "Start date is required"
  }),
  endDate: Joi.date().required().greater(Joi.ref("startDate")).messages({
    "date.base": "End date must be a valid date",
    "any.required": "End date is required",
    "date.greater": "End date must be greater than start date"
  })
});