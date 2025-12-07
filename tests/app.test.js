const request = require('supertest');
const app = require('../src/app');

describe('Tests de l\'API', () => {
  test('GET / devrait retourner un message de bienvenue', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('Bienvenue');
  });

  test('GET /api/users devrait retourner la liste des utilisateurs', async () => {
    const response = await request(app).get('/api/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('users');
  });
});