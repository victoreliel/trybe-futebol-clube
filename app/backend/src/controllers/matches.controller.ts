import { Request, Response } from 'express';

import MatchesService from '../services/matches.service';

export default class MatchesController {
  matchesService;

  constructor() {
    this.matchesService = new MatchesService();
  }

  async getAllMatches(req: Request, res: Response) {
    try {
      const { inProgress } = req.query;
      const matchesData = await this.matchesService.getAllMatches({
        inProgress: inProgress === undefined ? undefined : inProgress === 'true',
      });

      return res.status(matchesData.status).json(matchesData.matches);
    } catch (error) {
      return res.status(500).json({ message: 'unexpected error' });
    }
  }

  async postMatch(req: Request, res: Response) {
    const match = req.body;
    const { status, message } = await this.matchesService.postMatch(match);

    return res.status(status).json(message);
  }

  async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { status, message } = await this.matchesService.finishMatch(Number(id));

    return res.status(status).json(message);
  }

  async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const { status, message } = await this.matchesService.updateMatch(
      Number(id),
      homeTeamGoals,
      awayTeamGoals,
    );

    return res.status(status).json(message);
  }
}
