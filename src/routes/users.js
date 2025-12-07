const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/search', (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Paramètre name requis' });
  }
  
  const query = 'SELECT * FROM users WHERE name = ?';
  
  db.all(query, [name], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.json({ users: rows });
  });
});

router.get('/admin', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || authHeader !== 'Bearer SECURE_TOKEN') {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  
  res.json({ 
    message: 'Panneau admin',
    users: 'Liste de tous les utilisateurs'
  });
});

router.get('/', (req, res) => {
  db.all('SELECT id, name, email FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
    res.json({ users: rows });
  });
});

module.exports = router;