const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};


const generateToken = (user) => {
    const token = jwt.sign({ userName: user.userName, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2m' });
    const expirationTime = new Date(Date.now() + 120000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    return { token, expirationTime };
  };


module.exports = {
  auth,
  generateToken,
};