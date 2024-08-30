const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
