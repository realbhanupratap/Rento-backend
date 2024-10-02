// middleware/validate.js
import Joi from "joi";
import { ApiError } from "../utils/ApiError.js";

// Validation middleware for tenant registration
export const validateTenantRegistration = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    throw new ApiError(error.details[0].message, 400);
  }

  next();
};
