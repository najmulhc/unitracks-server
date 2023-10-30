import User from "../models/user.model";
const jwt = require("jsonwebtoken");

const varifyJWT = async (req: Request, res: Response, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const decoded = jwt.varify(token, process.env.JWT_SIGN);
  if (!decoded) {
    throw new Error("Invalid token given");
  } else {
    const { email } = decoded;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      throw new Error("user does not exists");
    } else {
      req.body.email = user.email;
      req.body.role = user.role;
    }
  }

  next();
};

export default varifyJWT;
