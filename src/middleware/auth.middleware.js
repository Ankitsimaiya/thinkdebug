import jwt from 'jsonwebtoken';

const jwt_secret = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const user = jwt.verify(token, jwt_secret);
    if (!user) return res.status(401).json({ message: 'User not logged in' });

    req.user = user;
    next();
  } catch (error) { 
    return res.status(401).json({ message: 'Invalid token or user not logged in' });
  }
}

function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  next();
}

export default authentication;
export { authorizeAdmin };
