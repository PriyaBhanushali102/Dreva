import Joi from "joi";

export const productValidatorSchema = Joi.object({
  name: Joi.string().min(5).required().message({
    "string.min": "Name is too short.",
    "any-required": "Name is required.",
  }),
  brand: Joi.string().required().messages({
    "any.required": "Brand is required.",
  }),
  image: Joi.object({
    date: Joi.binary(),
    contentType: Joi.string(),
  }).optional(),
  description: Joi.string()
    .min(20)
    .messages({
      "string.min": "Description is too short.",
    })
    .optional(),
  category: Joi.string().valid("Home", "Fashion", "Toys", "Gadgets"),
  quantity: Joi.number().integer().min(0).required().default(0),
  price: Joi.number().integer().min(0).required().default(0),
  vendorName: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/) //objectId format
    .required()
    .messages({ "string.pattern.base": "Vendor ID must be a valid objectId." }),
  rating: Joi.number().min(1).max(5).default(0),
  reviews: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .default([]),
  delivery: Joi.string().optional(),
  isActive: Joi.boolean().default(true),
  deletedAt: Joi.date().allow(null),
}).prefs({ abortEarly: false });
