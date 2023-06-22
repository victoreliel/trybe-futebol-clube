import { Router } from 'express';
import validateLogin from '../middlewares/login.middleware';
import LoginController from '../controllers/login.controller';

const loginRouter = Router();
const loginController = new LoginController();

loginRouter.post('/', validateLogin, loginController.validateLogin.bind(loginController));
loginRouter.get('/validate', loginController.getRole.bind(loginController));

export default loginRouter;
