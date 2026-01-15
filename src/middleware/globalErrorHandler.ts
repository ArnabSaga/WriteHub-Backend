import { NextFunction, Request, Response } from "express";

import { Prisma } from "../../generated/prisma/client";

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;

  //! PrismaClientValidationError
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Your provider field type is incorrect | missing fields";
  }

  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails,
  });
}

export default globalErrorHandler;
