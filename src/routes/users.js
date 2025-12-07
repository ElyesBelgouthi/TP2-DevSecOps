const express = require('express');
const router = express.Router();
const db = require('../db/database');

// ⚠️ VULNÉRABILITÉ : Injection SQL
router.get('/search', (req, res) => {
  const { name } = req.query;
  
  // Requête SQL non sécurisée (injection SQL possible)
  const query = `SELECT * FROM users WHERE name = '${name}'`;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
});

// ⚠️ VULNÉRABILITÉ : Pas de validation d'authentification
router.get('/admin', (req, res) => {
  // Route admin sans vérification
  res.json({ 
    message: 'Panneau admin',
    users: 'Liste de tous les utilisateurs'
  });
});

// Route normale
router.get('/', (req, res) => {
  db.all('SELECT id, name, email FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
});

module.exports = router;