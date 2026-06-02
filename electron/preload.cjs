const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Window controls
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  onMaximizeChange: (cb) => {
    ipcRenderer.on('window:maximize-change', (_, val) => cb(val));
  },

  // Notebooks
  getNotebooks: () => ipcRenderer.invoke('db:getNotebooks'),
  createNotebook: (name) => ipcRenderer.invoke('db:createNotebook', name),
  deleteNotebook: (id) => ipcRenderer.invoke('db:deleteNotebook', id),

  // Notes
  getNotes: (notebookId) => ipcRenderer.invoke('db:getNotes', notebookId),
  getNote: (id) => ipcRenderer.invoke('db:getNote', id),
  saveNote: (note) => ipcRenderer.invoke('db:saveNote', note),
  deleteNote: (id) => ipcRenderer.invoke('db:deleteNote', id),
  togglePin: (id) => ipcRenderer.invoke('db:togglePin', id),
  toggleFavorite: (id) => ipcRenderer.invoke('db:toggleFavorite', id),

  // Search
  searchNotes: (query) => ipcRenderer.invoke('db:searchNotes', query),
  getAllNotes: () => ipcRenderer.invoke('db:getAllNotes'),

  // Settings
  getSetting: (key) => ipcRenderer.invoke('db:getSetting', key),
  setSetting: (key, value) => ipcRenderer.invoke('db:setSetting', key, value),

  // Data
  exportAll: () => ipcRenderer.invoke('db:exportAll'),
  importAll: (json) => ipcRenderer.invoke('db:importAll', json),
});
