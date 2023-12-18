class ApiResponse {
  statusCode: number = 200;
  data: any = {};
  success: boolean = true;
  message: string = "Successfully performed the action";
  constructor(statusCode: number, data: any, message: string) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
  }
}

export default ApiResponse;
