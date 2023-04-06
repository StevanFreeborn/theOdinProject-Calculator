import fs from 'fs';
import path from 'path';

/**
 * Load a view from the filesystem
 * @param {string} viewName - The name of the view to load
 * @returns {string} The view contents
 */
export function loadView(viewName) {
  const viewPath = path.join(
    path.resolve(path.dirname('')),
    viewName
  );
  return fs.readFileSync(viewPath, 'utf8');
}
