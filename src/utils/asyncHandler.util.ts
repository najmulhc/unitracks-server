import { NextFunction, Request, Response } from "express";

const asyncHandler =
  (func: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error: any) {
      return res.status(error?.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  };

export default asyncHandler;
