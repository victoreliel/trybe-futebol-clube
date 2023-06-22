import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../auth/jwtFunctions';

const HTTP_STATUS_UNAUTHORIZED = 401;

export default function validateToken(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).json({
      message: 'Token must be a valid token',
    });
  }

  try {
    verifyToken(authorization);

    next();
  } catch (error) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).json({
      message: 'Token must be a valid token',
    });
  }
}
