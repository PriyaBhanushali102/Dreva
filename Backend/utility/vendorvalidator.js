import Joi from "joi";

export const vendorvalidatorSchema = Joi.object({
  name: Joi.string().min(5).required().messages({
    "string.min": "Name is too short.",
    "any-required": "Name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "email is required.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password should have atleast 8 character.",
    "any.required": "Password is required.",
  }),
  image: Joi.any().optional(),
  description: Joi.string().min(20).required().messages({
    "string.min": "Description is too short.",
    "any-required": "Description is required.",
  }),
  productList: Joi.array().items(Joi.string().hex().length(20)).optional(),
}).prefs({ abortEarly: false });
