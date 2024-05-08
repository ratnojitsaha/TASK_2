const { z } = require('zod');

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

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

module.exports = { userSchema, loginSchema };
