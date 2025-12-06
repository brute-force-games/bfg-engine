/**
 * IndexedDB backup for SQLite database files
 * Stores SQLite database bytes in IndexedDB for persistence across refreshes
 * Works alongside TinyBase's SQLite persister
 */

/**
 * Store SQLite database bytes in IndexedDB
 */
export async function saveDatabaseToIndexedDB(dbName: string, dbBytes: Uint8Array): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sqlite-backups', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['databases'], 'readwrite');
      const store = transaction.objectStore('databases');
      const putRequest = store.put({ name: dbName, data: dbBytes, timestamp: Date.now() });
      
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };
    
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('databases')) {
        db.createObjectStore('databases', { keyPath: 'name' });
      }
    };
  });
}

/**
 * Load SQLite database bytes from IndexedDB
 */
export async function loadDatabaseFromIndexedDB(dbName: string): Promise<Uint8Array | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sqlite-backups', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['databases'], 'readonly');
      const store = transaction.objectStore('databases');
      const getRequest = store.get(dbName);
      
      getRequest.onsuccess = () => {
        const result = getRequest.result;
        resolve(result ? result.data : null);
      };
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('databases')) {
        db.createObjectStore('databases', { keyPath: 'name' });
      }
    };
  });
}

/**
 * Delete database from IndexedDB
 */
export async function deleteDatabaseFromIndexedDB(dbName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sqlite-backups', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['databases'], 'readwrite');
      const store = transaction.objectStore('databases');
      const deleteRequest = store.delete(dbName);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
    
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('databases')) {
        db.createObjectStore('databases', { keyPath: 'name' });
      }
    };
  });
}

