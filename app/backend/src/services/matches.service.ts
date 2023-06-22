import Match from '../database/models/Match';
import IMatch from '../interfaces/IMatch';

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;

export default class MatchesService {
  public matchesModel;

  constructor() {
    this.matchesModel = Match;
  }

  async getAllMatches(filters: { inProgress?: boolean }) {
    if (filters.inProgress === undefined) {
      const matches = await this.matchesModel.findAll({ include: [
        { association: 'homeTeam', attributes: ['teamName'] },
        { association: 'awayTeam', attributes: ['teamName'] }] });

      return { status: HTTP_STATUS_OK, matches };
    }
    const matches = await this.matchesModel.findAll({ where: filters,
      include: [
        { association: 'homeTeam', attributes: ['teamName'] },
        { association: 'awayTeam', attributes: ['teamName'] }] });

    return { status: HTTP_STATUS_OK, matches };
  }

  async postMatch(match: IMatch) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = match;

    if (homeTeamId === awayTeamId) {
      return {
        status: HTTP_STATUS_UNPROCESSABLE_ENTITY,
        message: { message: 'It is not possible to create a match with two equal teams' },
      };
    }

    const homeTeam = await this.matchesModel.findOne({ where: { homeTeamId } });
    const awayTeam = await this.matchesModel.findOne({ where: { awayTeamId } });

    if (!homeTeam || !awayTeam) {
      return {
        status: HTTP_STATUS_NOT_FOUND,
        message: { message: 'There is no team with such id!' } };
    }

    const insertMatch = await this.matchesModel.create({
      homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals, inProgress: true,
    });

    return { status: HTTP_STATUS_CREATED, message: insertMatch };
  }

  async finishMatch(id: number) {
    await this.matchesModel.update({ inProgress: false }, { where: { id } });

    return { status: HTTP_STATUS_OK, message: 'Finished' };
  }

  async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number) {
    await this.matchesModel.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });

    return { status: HTTP_STATUS_OK, message: 'Updated' };
  }
}
