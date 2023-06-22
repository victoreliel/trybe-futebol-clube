import Team from '../database/models/Team';

const HTTP_STATUS_OK = 200;

export default class TeamsService {
  public teamsModel;

  constructor() {
    this.teamsModel = Team;
  }

  public async getAllTeams() {
    const teams = await this.teamsModel.findAll();

    return { status: HTTP_STATUS_OK, message: teams };
  }

  public async getTeamById(id: number) {
    const team = await this.teamsModel.findByPk(id);

    return { status: HTTP_STATUS_OK, message: team };
  }
}
