// Browser polyfill for Node.js fs module
// Stub implementations for fs functions that yargs imports but may not actually use for help generation
// These are minimal implementations that throw errors if actually called (which shouldn't happen for help)

export const readFileSync = (path: string, encoding?: any): Buffer | string => {
  // Yargs tries to read locale files and config files - return empty JSON for those
  // Always return empty JSON for any file read attempt in browser (yargs doesn't actually need real files for help)
  const pathStr = String(path || '');
  const result = '{}';
  
  // Return as string if encoding is specified as utf8/utf-8, otherwise as Buffer
  if (encoding === 'utf8' || encoding === 'utf-8') {
    return result;
  }
  // For Buffer or no encoding, return Buffer
  return Buffer.from(result);
};

export const readdirSync = (path: string): string[] => {
  throw new Error(`readdirSync called in browser: ${path}`);
};

export const statSync = (path: string): any => {
  throw new Error(`statSync called in browser: ${path}`);
};

export const writeFile = (path: string, data: any, callback?: (err: any) => void): void => {
  if (callback) callback(new Error(`writeFile called in browser: ${path}`));
};

export const writeFileSync = (path: string, data: any): void => {
  throw new Error(`writeFileSync called in browser: ${path}`);
};

export const existsSync = (path: string): boolean => {
  return false; // Return false for existsSync - yargs uses this to check for config files
};

export const mkdirSync = (path: string, options?: any): void => {
  throw new Error(`mkdirSync called in browser: ${path}`);
};

export const readdir = (path: string, callback: (err: any, files: string[]) => void): void => {
  callback(new Error(`readdir called in browser: ${path}`), []);
};

export const stat = (path: string, callback: (err: any, stats: any) => void): void => {
  callback(new Error(`stat called in browser: ${path}`), null);
};

export const readFile = (path: string, encoding: any, callback: (err: any, data: any) => void): void => {
  callback(new Error(`readFile called in browser: ${path}`), null);
};

// Export default object with all methods
export default {
  readFileSync,
  readdirSync,
  statSync,
  writeFile,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdir,
  stat,
  readFile,
};

