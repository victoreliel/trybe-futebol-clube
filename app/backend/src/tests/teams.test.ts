import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import Team from '../database/models/Team';
import teamsMock from './mocks/teams.mock';

chai.use(chaiHttp);

const { expect } = chai;

const HTTP_STATUS = {
  OK: 200,
}

describe('Testando a rota teams', () => {
  afterEach( function() { sinon.restore() });

  it('testa se é possível fazer uma requisição de todos os times', async () => {
    sinon.stub(Team, 'findAll').resolves(teamsMock as any);

    const response = await chai.request(app).get('/teams');

    expect(response.status).to.be.equal(HTTP_STATUS.OK);
  });

  it('testa se é possível fazer uma requisição de um time por id', async () => {
    const response = await chai.request(app).get('/teams/1');

    expect(response.status).to.be.equal(HTTP_STATUS.OK);
  });
});
