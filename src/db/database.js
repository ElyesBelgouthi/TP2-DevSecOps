const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath);

// Création de la table users
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);

  // Insertion de données de test
  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  stmt.run('Alice Dupont', 'alice@example.com');
  stmt.run('Bob Martin', 'bob@example.com');
  stmt.finalize();
});

module.exports = db;