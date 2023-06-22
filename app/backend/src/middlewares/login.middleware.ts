import { NextFunction, Request, Response } from 'express';
import ILogin from '../interfaces/ILogin';

const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_UNAUTHORIZED = 401;

export default function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body as ILogin;
  const regex = /\S+@\S+\.\S+/;

  if (!email || !password) {
    return res.status(HTTP_STATUS_BAD_REQUEST).json({
      message: 'All fields must be filled',
    });
  }

  if (!regex.test(email) || password.length < 6) {
    const message = 'Incorrect email or password';
    return res.status(HTTP_STATUS_UNAUTHORIZED).json({ message });
  }

  next();
}
