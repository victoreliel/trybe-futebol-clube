import * as bcryptjs from 'bcryptjs';
import User from '../database/models/User';
import { IResponse } from '../interfaces/ILogin';
import createToken from '../auth/jwtFunctions';

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_UNAUTHORIZED = 401;

export default class LoginService {
  public userModel;

  constructor() {
    this.userModel = User;
  }

  public async getUsers(email: string, password: string): Promise<IResponse> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user || !bcryptjs.compareSync(password, user.password)) {
      return {
        status: HTTP_STATUS_UNAUTHORIZED,
        message: 'Incorrect email or password',
      };
    }

    const token = createToken(user.dataValues);

    return { status: HTTP_STATUS_OK, message: token };
  }

  public async getRole(email: string) {
    const user = await this.userModel.findOne({ where: { email } });

    return { status: HTTP_STATUS_OK, message: user?.role };
  }
}
