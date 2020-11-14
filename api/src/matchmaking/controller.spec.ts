import request from 'supertest';
import http from 'http';
import app from '../app';
const server = http.createServer(app).listen(8090);
const url = '/api/account';

import * as settings from '../settings/model';

console.log = function() {return;}; // Disable console.logs

afterAll(async () => {
  server.close();
});

describe('function calls with authentication', () => {
  const agent = request.agent(server);
  let cookie;

  beforeAll(() => 
    agent
      .post(`${url}/signup`)
      .send({
        username: 'dummy',
        password: '123',
      })
      .expect(200)
      .then((res) => {
        const cookies = res.header['set-cookie'][0].split(',')
          .map((item: string) => item.split(';')[0]);
        cookie = cookies.join(';');
        console.log(cookie);
      })
  );

  afterAll(async () => {
    await settings.deleteAccount('dummy');
  });

  test('signup', async () => {
    const data = { username: 'test_username', password: '123' };
    const post = await agent.post(`${url}/signup`).send(data);

    expect(post.body).toMatchObject({error: 'Already logged in'});
    expect(post.status).toStrictEqual(400);
  });

  test('login', async () => {
    const data = { username: 'dummy', password: '123' };
    const post = await agent.post(`${url}/login`).send(data);

    expect(post.body).toMatchObject({error: 'Already logged in'});
    expect(post.status).toStrictEqual(400);
  });

  test('logout', async () => {
    const oldData = { username: 'dummy', password: '123' };
    const oldPost = await agent.post(`${url}/login`).send(oldData);

    expect(oldPost.body).toMatchObject({error: 'Already logged in'});
    expect(oldPost.status).toStrictEqual(400);

    const data = { message: 'Log out'};
    const post = await agent.post(`${url}/logout`).send(data);

    expect(post.body).toStrictEqual({ message: 'Log out'});
    expect(post.status).toStrictEqual(200);

    const newData = { username: 'dummy', password: '123' };
    const newPost = await agent.post(`${url}/login`).send(newData);

    expect(newPost.body).toMatchObject({message: 'Cookie set'});
    expect(newPost.header['set-cookie']).toHaveLength(1);
    expect(newPost.status).toStrictEqual(200);
  });
});

describe('signup', () => {
  afterAll(async () => {
    await settings.deleteAccount('test_username');
  });

  test('rejected by validator, null data', async () => {
    const data = {};
    const post = await request(server).post(`${url}/signup`).send(data);

    expect(post.body).toMatchObject({error: 'Bad Request'});
    expect(post.status).toStrictEqual(400);
  });

  test('rejected by validator, incomplete fields', async () => {
    const data = { username: 'test_username' };
    const post = await request(server).post(`${url}/signup`).send(data);

    expect(post.body).toMatchObject({error: 'Bad Request'});
    expect(post.status).toStrictEqual(400);
  });

  test('rejected by validator, invalid values', async () => {
    const data = { username: 'test_username$', password: '123' };
    const post = await request(server).post(`${url}/signup`).send(data);

    expect(post.body).toMatchObject({error: 'Bad Request'});
    expect(post.status).toStrictEqual(400);
  });

  test('signup works properly', async () => {
    const data = { username: 'test_username', password: '123' };
    const post = await request(server).post(`${url}/signup`).send(data);

    expect(post.body).toMatchObject({message: 'Cookie set'});
    expect(post.header['set-cookie']).toHaveLength(1);
    expect(post.status).toStrictEqual(200);
  });

  test('signup with username already taken', async () => {
    const data = { username: 'test_username', password: '123' };
    const post = await request(server).post(`${url}/signup`).send(data);

    expect(post.body).toMatchObject({error: 'Username already taken'});
    expect(post.status).toStrictEqual(409);
  });
});

describe('login', () => {
  beforeAll(async () => {
    const data = { username: 'dummy', password: '123' };
    await request(server).post(`${url}/signup`).send(data);
  });

  afterAll(async () => {
    await settings.deleteAccount('test_username');
  });

  test('rejected by validator, null data', async () => {
    const data = {};
    const post = await request(server).post(`${url}/login`).send(data);

    expect(post.body).toMatchObject({error: 'Bad Request'});
    expect(post.status).toStrictEqual(400);
  });

  test('rejected by validator, incomplete fields', async () => {
    const data = { username: 'dummy' };
    const post = await request(server).post(`${url}/login`).send(data);

    expect(post.body).toMatchObject({error: 'Bad Request'});
    expect(post.status).toStrictEqual(400);
  });

  test('rejected by validator, invalid values', async () => {
    const data = { username: 'dummy$', password: '1234' };
    const post = await request(server).post(`${url}/login`).send(data);

    expect(post.body).toMatchObject({error: 'Bad Request'});
    expect(post.status).toStrictEqual(400);
  });

  test('login invalid username', async () => {
    const data = { username: 'dummy1', password: '123' };
    const post = await request(server).post(`${url}/login`).send(data);

    expect(post.body).toMatchObject({error: 'Username not found'});
    expect(post.status).toStrictEqual(401);
  });

  test('login invalid password', async () => {
    const data = { username: 'dummy', password: '1234' };
    const post = await request(server).post(`${url}/login`).send(data);

    expect(post.body).toMatchObject({error: 'Invalid password'});
    expect(post.status).toStrictEqual(401);
  });

  test('login works properly', async () => {
    const data = { username: 'dummy', password: '123' };
    const post = await request(server).post(`${url}/login`).send(data);

    expect(post.body).toMatchObject({message: 'Cookie set'});
    expect(post.header['set-cookie']).toHaveLength(1);
    expect(post.status).toStrictEqual(200);
  });
});
