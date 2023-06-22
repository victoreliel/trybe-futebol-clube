import { Request, Response } from 'express';
import Match from '../database/models/Match';
import MatchesService from '../services/matches.service';
import TeamsService from '../services/teams.service';

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

export default class LeaderboardController {
  matchesService;
  teamsService;

  constructor() {
    this.matchesService = new MatchesService();
    this.teamsService = new TeamsService();
  }

  async getAllMatches() {
    const matches = await this.matchesService.getAllMatches({ inProgress: false });

    return matches;
  }

  async getTeamMatches(teamId: number) {
    const response = await this.getAllMatches();

    const teamMatches = response.matches.filter((match) =>
      (match.homeTeamId === teamId || match.awayTeamId === teamId));

    return teamMatches;
  }

  private calculateHomeTeamPoints = async (matches: Match[]) => {
    const stats = {
      pointsHome: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
    };

    matches.forEach((match) => {
      if (match.awayTeamGoals < match.homeTeamGoals) {
        stats.pointsHome += 3;
        stats.totalVictories += 1;
      } else if (match.awayTeamGoals > match.homeTeamGoals) {
        stats.totalLosses += 1;
      } else {
        stats.pointsHome += 1;
        stats.totalDraws += 1;
      }
    });

    return stats;
  };

  private calculateGoalsHome = async (teamId: number) => {
    const teamMatches = await this.getTeamMatches(teamId);
    const gamesHome = teamMatches.filter((match) => match.homeTeamId === teamId);
    let goalsFavor = 0.0;
    let goalsOwn = 0;

    gamesHome.forEach((game) => {
      goalsFavor += game.homeTeamGoals;
      goalsOwn += game.awayTeamGoals;
    });

    return { goalsFavor, goalsOwn, goalsBalance: goalsFavor - goalsOwn };
  };

  private generateHomeTeamData = async (teamId: number) => {
    const { message } = await this.teamsService.getTeamById(teamId);
    const matches = await this.getTeamMatches(teamId);
    const homeMatches = matches.filter((match) => match.homeTeamId === teamId);
    const stats = await this.calculateHomeTeamPoints(homeMatches);
    const { goalsBalance, goalsFavor, goalsOwn } = await this.calculateGoalsHome(teamId);
    const totalGames = homeMatches.length;
    const efficiency = (100 * stats.pointsHome) / (totalGames * 3);

    return { name: message?.teamName,
      totalPoints: stats.pointsHome,
      totalGames,
      totalVictories: stats.totalVictories,
      totalDraws: stats.totalDraws,
      totalLosses: stats.totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance,
      efficiency,
    };
  };

  public getHomeTeamLeaderboards = async (req: Request, res: Response) => {
    try {
      const { message } = await this.teamsService.getAllTeams();
      const leaderBoard = await Promise.all(message
        .map((team) => this.generateHomeTeamData(team.id)));
      leaderBoard.sort((teamA, teamB) => (teamB.totalPoints - teamA.totalPoints
        || teamB.totalVictories - teamA.totalVictories
        || teamB.goalsBalance - teamA.goalsBalance
        || teamB.goalsFavor - teamA.goalsFavor
        || teamA.goalsOwn - teamB.goalsOwn));

      console.log({ leaderBoard });

      return res.status(HTTP_STATUS_OK).json(leaderBoard);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Unexpected Error' });
    }
  };
}
