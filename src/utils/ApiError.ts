//@ts-ignore
class ApiError extends Error {
  statusCode: number = 0;
  data: any = {};
  message: string = "";
  success: boolean = true;
  errors: this[] = [];

  constructor(
    statusCode: number,
    message = "Something went wrong.",
    errors = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null; // find what it is
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (this.statusCode === 401) {
      this.message = "You need to be logged in to perform this task.";
    }
     

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
