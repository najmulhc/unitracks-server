import { NextFunction, Request, Response } from "express";

const asyncHandler =
  (func) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error: any) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  };

export default asyncHandler;
