import * as jwt from 'jsonwebtoken';
import ILogin from '../interfaces/ILogin';

const secret = process.env.JWT_SECRET || 'secret';

const jwtConfig = {
  algorithm: 'HS256',
  expiresIn: '24h',
};

export default function createToken(user: ILogin) {
  const { password: _, ...userWithoutPassword } = user;
  const token = jwt.sign({ ...userWithoutPassword }, secret, jwtConfig as object);
  return token;
}

export function verifyToken(token: string) {
  const payload = jwt.verify(token, secret);
  return payload as jwt.JwtPayload;
}
