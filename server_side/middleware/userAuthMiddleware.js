const jwt = require("jsonwebtoken");

const userAuthMiddleware = async (req, res, next) => {
  // Get the token from cookies
  const { token } = req.cookies;

  // If no token is found, return unauthorized response
  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized, Login Again",
    });
  }

  try {
    // Decode and verify the token
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is valid, attach the userId to the request body
    if (tokenDecoded.id) {
      req.body.userId = tokenDecoded.id;
    } else {
      return res.json({
        success: false,
        message: "Invalid token, please login again",
      });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle any errors during token verification
    return res.json({
      success: false,
      message: "Token verification failed: " + error.message,
    });
  }
};

module.exports = userAuthMiddleware;
