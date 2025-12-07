const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/search', (req, res) => {
  const { name } = req.query;
  
  const query = `SELECT * FROM users WHERE name = '${name}'`;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
});

router.get('/admin', (req, res) => {
  res.json({ 
    message: 'Panneau admin',
    users: 'Liste de tous les utilisateurs'
  });
});

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