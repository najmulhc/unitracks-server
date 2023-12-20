import { Role } from "../types";
import ApiError from "./ApiError";

const authTester = (givenRole: Role, expectedRole: Role) => {
  if (givenRole === expectedRole) {
    return true;
  } else {
    throw new ApiError(403, "You Do not have permission to perform this task.");
  }
};

export default authTester;
