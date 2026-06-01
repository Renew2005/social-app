const jwt = require('jsonwebtoken'); // Used to verify the login token

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the request headers
  // Frontend sends it as: Authorization: "Bearer <token>"
  const authHeader = req.headers.authorization;

  // 2. If no token is provided, reject the request
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  // 3. Extract just the token part (remove "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the user info to the request so routes can use it
    req.user = decoded; // decoded contains { userId, username }

    // 6. Move on to the actual route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;