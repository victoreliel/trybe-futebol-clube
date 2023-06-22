import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import User from '../database/models/User';

chai.use(chaiHttp);

const { expect } = chai;

const dataUser = {
  username: 'User',
  role: 'user',
  email: 'user@user.com',
  password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO'
}

const loginData = {
  email: 'user@user.com',
  password: 'secret_user',
}

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
}

const errorMessages = {
  incorrect_fields: 'Incorrect email or password',
  fields_missing: 'All fields must be filled',
}

describe('Testando a rota login', () => {
  afterEach( function () { sinon.restore() });

  it('testa se a rota de login funciona com os requisitos corretos', async () => {
    sinon.stub(User, 'findOne').resolves(dataUser as any);

    const response = await chai.request(app).post('/login').send(loginData);

    expect(response.status).to.be.equal(HTTP_STATUS.OK);
    expect(response.body).to.have.property('token');
  });

  it('testa se retorna erro quando o email é inválido', async () => {
    const response = await chai.request(app).post('/login').send({
      email: 'user.com',
      password: 'secret_user',
    });

    expect(response.status).to.be.equal(HTTP_STATUS.UNAUTHORIZED);
    expect(response.body).to.have.property(errorMessages.incorrect_fields);
  });

  it('testa se retorna erro quando o campo de email não for preenchido', async () => {
    const response = await chai.request(app).post('/login').send({
      password: 'secret_user',
    });

    expect(response.status).to.be.equal(HTTP_STATUS.BAD_REQUEST);
    expect(response.body).to.have.property(errorMessages.fields_missing);
  });

  it('testa se retorna erro quando o campo de password não for preenchido', async () => {
    const response = await chai.request(app).post('/login').send({
      email: 'user@user.com',
    });

    expect(response.status).to.be.equal(HTTP_STATUS.BAD_REQUEST);
    expect(response.body).to.have.property(errorMessages.fields_missing);
  });
});
