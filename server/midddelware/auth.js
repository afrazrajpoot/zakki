const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token,'token')
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  console.log(req.user,'user');
  next();
};
