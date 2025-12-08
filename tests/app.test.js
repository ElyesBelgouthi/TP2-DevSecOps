const request = require('supertest');
const app = require('../src/app');

describe('Tests API', () => {
  test('GET / retourne message avec token CSRF', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();
    expect(response.body.csrfToken).toBeDefined();
  });

  test('GET /api/users retourne liste utilisateurs', async () => {
    const response = await request(app).get('/api/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('users');
  });

  test('Vérifie les en-têtes de sécurité', async () => {
    const response = await request(app).get('/');
    
    // Vérifie X-Powered-By n'est pas présent
    expect(response.headers['x-powered-by']).toBeUndefined();
    
    // Vérifie les en-têtes de sécurité
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['content-security-policy']).toBeDefined();
    expect(response.headers['cross-origin-resource-policy']).toBe('same-origin');
    expect(response.headers['cache-control']).toContain('no-store');
  });

  test('Vérifie les attributs des cookies CSRF', async () => {
    const response = await request(app).get('/');
    
    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    
    const csrfCookie = cookies.find(cookie => cookie.startsWith('_csrf='));
    expect(csrfCookie).toBeDefined();
    
    expect(csrfCookie).toContain('HttpOnly');
    
    expect(csrfCookie).toContain('SameSite=Strict');
  });

  test('Route non trouvée retourne 404', async () => {
    const response = await request(app).get('/route-inexistante');
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Route non trouvée');
  });
});