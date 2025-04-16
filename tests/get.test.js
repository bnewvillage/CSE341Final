const request = require('supertest');

const baseUrl = 'http://localhost:3000';

const getRoutes = [
  '/projects/',
  '/projects/67f8199fc49f440ec5b33fea/',
  '/projects/67f8199fc49f440ec5b33fea/tasks/67ffb11e6aae018c4bc8c61f',
  '/projects/67f8199fc49f440ec5b33fea/tasks/67ffb11e6aae018c4bc8c61f/comments',
  '/users/'

];

describe('GET Routes (manual server mode)', () => {
  getRoutes.forEach((route) => {
    it(`GET ${route}`, async () => {
      const res = await request(baseUrl).get(route);
      expect([200, 404, 401]).toContain(res.statusCode);
    });
  });
});
