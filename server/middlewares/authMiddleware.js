import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    // Add a helper for req.auth() to maintain compatibility with existing controllers
    req.auth = async () => ({ userId: decoded.userId });

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
