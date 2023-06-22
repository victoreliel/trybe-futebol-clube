import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboards.controller';

const leaderboardsRouter = Router();
const leaderboardController = new LeaderboardController();

leaderboardsRouter.get('/home', leaderboardController.getHomeTeamLeaderboards
  .bind(leaderboardController));

export default leaderboardsRouter;
