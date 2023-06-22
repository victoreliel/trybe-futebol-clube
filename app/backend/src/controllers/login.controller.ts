import { Request, Response } from 'express';
import { verifyToken } from '../auth/jwtFunctions';

import LoginService from '../services/login.service';

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_UNAUTHORIZED = 401;

export default class LoginController {
  loginService;

  constructor() {
    this.loginService = new LoginService();
  }

  async validateLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    const { status, message } = await this.loginService.getUsers(email, password);

    if (status === HTTP_STATUS_OK) {
      return res.status(status).json({ token: message });
    }

    return res.status(status).json({ message });
  }

  async getRole(req: Request, res: Response) {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(HTTP_STATUS_UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    const validate = verifyToken(authorization);
    const { status, message } = await this.loginService.getRole(validate.email);

    return res.status(status).json({ role: message });
  }
}
