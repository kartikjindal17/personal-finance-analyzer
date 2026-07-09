const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30m",
    }
  );
};

module.exports = generateToken;