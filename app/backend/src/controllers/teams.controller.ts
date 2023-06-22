import { Request, Response } from 'express';

import TeamsService from '../services/teams.service';

export default class TeamsController {
  teamsService;

  constructor() {
    this.teamsService = new TeamsService();
  }

  async getAllTeams(req: Request, res: Response) {
    const { status, message } = await this.teamsService.getAllTeams();

    return res.status(status).json(message);
  }

  async getTeamById(req: Request, res: Response) {
    const { id } = req.params;

    const { status, message } = await this.teamsService.getTeamById(Number(id));

    return res.status(status).json(message);
  }
}
