import Joi from "joi";

export const userValidatorSchema = Joi.object({
  name: Joi.string().min(4).required().messages({
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
  image: Joi.string().allow(""),
  addresses: Joi.array()
    .items(
      Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zip: Joi.string(),
        country: Joi.string(),
      }),
    )
    .optional(),
  cart: Joi.array().items(Joi.string().hex().length(24)).optional(),
  wishlist: Joi.array().items(Joi.string().hex().length(24)).optional(),
  orderHistory: Joi.string().hex().length(24).optional(),
  productReviews: Joi.array().items(Joi.string().hex().length(24)).optional(),
  isActive: Joi.boolean().default(true),
  deleteAt: Joi.date().allow(null),
}).prefs({ abortEarly: false });
