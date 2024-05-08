const jwt = require("jsonwebtoken");
const { users } = require("./users");
const { registrationSchema, loginSchema, forgetPasswordSchema } = require("./schemas");

// User registration function
async function registerUser(data) { 
  const userData = registrationSchema.parse(data);
  const userExists = users.find((user) => user.email === userData.email);
  if (userExists) {
    throw new Error("User already exists");
  }

  const newUser = {
    username: userData.username,
    email: userData.email,
    password: userData.password, // Store password as plain text
  };

  users.push(newUser);
  //console.log(users);
  return "User registered successfully";
}

// User login function
async function loginUser(data) {
  const loginData = loginSchema.parse(data);

  const user = users.find((u) => u.username === loginData.username);
  if (!user) {
    throw new Error("Invalid username or password");
  }

  if (user.password !== loginData.password) {
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign(
    { username: user.username, email: user.email },
    "your_jwt_secret",
    { expiresIn: "1h" }
  );

  return { token };
}

// Password reset request function
function PasswordReset(data) {
  const { email } = forgetPasswordSchema.parse(data);

  const user = users.find((u) => u.email === email);
  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = jwt.sign(
    { email: user.email },
    "your_jwt_secret",
    { expiresIn: "15m" }
  );

  return { resetToken };
}

module.exports = {
  registerUser,
  loginUser,
  PasswordReset,
};
