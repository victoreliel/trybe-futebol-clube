import { Router } from 'express';
import validateToken from '../middlewares/postMatch.middleware';
import MatchesController from '../controllers/matches.controller';

const matchesRouter = Router();
const matchesController = new MatchesController();

matchesRouter.get('/', matchesController.getAllMatches.bind(matchesController));
matchesRouter.post('/', validateToken, matchesController.postMatch.bind(matchesController));
matchesRouter.patch('/:id/finish', matchesController.finishMatch.bind(matchesController));
matchesRouter.patch('/:id', matchesController.updateMatch.bind(matchesController));

export default matchesRouter;
