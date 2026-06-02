const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDatabase, getDatabase } = require('./database');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '..', 'public', 'icon.png'),
    show: false,
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.once('ready-to-show', () => mainWindow.show());

  // Window controls
  ipcMain.handle('window:minimize', () => mainWindow.minimize());
  ipcMain.handle('window:maximize', () => {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  });
  ipcMain.handle('window:close', () => mainWindow.close());
  ipcMain.handle('window:isMaximized', () => mainWindow.isMaximized());
}

// Database IPC handlers
function registerDbHandlers() {
  const db = getDatabase();

  ipcMain.handle('db:getNotebooks', () => {
    return db.prepare('SELECT * FROM notebooks ORDER BY created_at DESC').all();
  });

  ipcMain.handle('db:createNotebook', (_, name) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
    const stmt = db.prepare('INSERT INTO notebooks (id, name, created_at) VALUES (?, ?, ?)');
    stmt.run(id, name, Date.now());
    return db.prepare('SELECT * FROM notebooks WHERE id = ?').get(id);
  });

  ipcMain.handle('db:deleteNotebook', (_, id) => {
    db.prepare('DELETE FROM notes WHERE notebook_id = ?').run(id);
    db.prepare('DELETE FROM notebooks WHERE id = ?').run(id);
  });

  ipcMain.handle('db:getNotes', (_, notebookId) => {
    return db
      .prepare('SELECT * FROM notes WHERE notebook_id = ? ORDER BY is_pinned DESC, updated_at DESC')
      .all(notebookId);
  });

  ipcMain.handle('db:getNote', (_, id) => {
    return db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
  });

  ipcMain.handle('db:saveNote', (_, note) => {
    const existing = db.prepare('SELECT id FROM notes WHERE id = ?').get(note.id);
    if (existing) {
      db.prepare(
        'UPDATE notes SET title=?, content=?, tags=?, is_pinned=?, is_favorite=?, updated_at=? WHERE id=?'
      ).run(note.title, note.content, JSON.stringify(note.tags || []), note.is_pinned ? 1 : 0, note.is_favorite ? 1 : 0, Date.now(), note.id);
    } else {
      db.prepare(
        'INSERT INTO notes (id, title, content, notebook_id, tags, is_pinned, is_favorite, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)'
      ).run(note.id, note.title, note.content, note.notebookId, JSON.stringify(note.tags || []), note.is_pinned ? 1 : 0, note.is_favorite ? 1 : 0, Date.now(), Date.now());
    }
    return db.prepare('SELECT * FROM notes WHERE id = ?').get(note.id);
  });

  ipcMain.handle('db:deleteNote', (_, id) => {
    db.prepare('DELETE FROM notes WHERE id = ?').run(id);
  });

  ipcMain.handle('db:togglePin', (_, id) => {
    const note = db.prepare('SELECT is_pinned FROM notes WHERE id = ?').get(id);
    db.prepare('UPDATE notes SET is_pinned = ? WHERE id = ?').run(note.is_pinned ? 0 : 1, id);
  });

  ipcMain.handle('db:toggleFavorite', (_, id) => {
    const note = db.prepare('SELECT is_favorite FROM notes WHERE id = ?').get(id);
    db.prepare('UPDATE notes SET is_favorite = ? WHERE id = ?').run(note.is_favorite ? 0 : 1, id);
  });

  ipcMain.handle('db:searchNotes', (_, query) => {
    const q = `%${query}%`;
    return db
      .prepare('SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC LIMIT 50')
      .all(q, q);
  });

  ipcMain.handle('db:getAllNotes', () => {
    return db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all();
  });

  ipcMain.handle('db:getSetting', (_, key) => {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
    return row ? row.value : null;
  });

  ipcMain.handle('db:setSetting', (_, key, value) => {
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
  });

  ipcMain.handle('db:exportAll', () => {
    const notebooks = db.prepare('SELECT * FROM notebooks').all();
    const notes = db.prepare('SELECT * FROM notes').all();
    notes.forEach((n) => (n.tags = JSON.parse(n.tags || '[]')));
    return JSON.stringify({ notebooks, notes, exportedAt: new Date().toISOString() }, null, 2);
  });

  ipcMain.handle('db:importAll', (_, json) => {
    const data = JSON.parse(json);
    const insertNb = db.prepare('INSERT OR REPLACE INTO notebooks (id, name, icon, created_at) VALUES (?,?,?,?)');
    const insertNote = db.prepare(
      'INSERT OR REPLACE INTO notes (id, title, content, notebook_id, tags, is_pinned, is_favorite, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)'
    );
    const tx = db.transaction(() => {
      data.notebooks.forEach((n) => insertNb.run(n.id, n.name, n.icon || '📓', n.created_at));
      data.notes.forEach((n) =>
        insertNote.run(n.id, n.title, n.content, n.notebook_id, JSON.stringify(n.tags || []), n.is_pinned ? 1 : 0, n.is_favorite ? 1 : 0, n.created_at, n.updated_at)
      );
    });
    tx();
    return true;
  });
}

app.whenReady().then(() => {
  initDatabase();
  registerDbHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  const db = getDatabase();
  if (db) db.close();
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
