const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

let db = null;

function getDbPath() {
  const userData = process.env.APPDATA || path.join(require('os').homedir(), 'AppData', 'Roaming');
  const dir = path.join(userData, 'notion-lite');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, 'database.sqlite');
}

async function initDatabase() {
  const SQL = await initSqlJs();
  const dbPath = getDbPath();

  try {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } catch {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS notebooks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '未命名',
      icon TEXT DEFAULT '📓',
      created_at INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      notebook_id TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      is_pinned INTEGER DEFAULT 0,
      is_favorite INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Auto-save every 5 seconds
  setInterval(() => {
    if (db) {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbPath, buffer);
    }
  }, 5000);

  return db;
}

function getDatabase() {
  return db;
}

module.exports = { initDatabase, getDatabase };
