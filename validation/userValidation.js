const { z } = require('zod');

//zod schema for password
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit");

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: passwordSchema,
});

// Zod schema for user registration
const registrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Zod schema for user login
const loginSchema = z.object({
  username: z.string().min(3, "Invalid username"),
  password: z.string().min(6, "Invalid password"),
});

// Zod schema for password reset request
const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

module.exports = {
  userSchema,
  registrationSchema,
  loginSchema,
  forgetPasswordSchema,
  passwordSchema
};