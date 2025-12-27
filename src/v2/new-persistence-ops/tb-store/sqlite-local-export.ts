// /**
//  * Generic CLI/Local (Node.js) specific SQLite database export functionality
//  * Uses sqlite3 native module
//  */

// import { readFileSync } from 'fs';
// import { join } from 'path';

// /**
//  * Export a SQLite database from a CLI/Node.js environment
//  * @param dbName - The database file name (e.g., 'my-data.db')
//  * @returns The database file as Uint8Array, or null if export fails
//  */
// export async function exportSqliteDatabaseCli(dbName: string): Promise<Uint8Array | null> {
//   try {
//     // In Node.js/CLI environment, the database is stored as a file on the filesystem
//     // The sqlite3 persister uses a file-based database
//     const dbPath = join(process.cwd(), dbName);
    
//     try {
//       const dbBuffer = readFileSync(dbPath);
//       console.log(`Successfully read database file from: ${dbPath}`);
//       return new Uint8Array(dbBuffer);
//     } catch (fileError: any) {
//       if (fileError.code === 'ENOENT') {
//         console.warn(`Database file not found at: ${dbPath}`);
//         console.warn('The database may not have been created yet. Try creating data first.');
//       } else {
//         console.error('Error reading database file:', fileError);
//       }
//       return null;
//     }
//   } catch (error) {
//     console.error('Error exporting database in CLI environment:', error);
//     return null;
//   }
// }

