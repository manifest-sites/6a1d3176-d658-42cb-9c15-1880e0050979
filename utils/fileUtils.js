const fs = require('fs');
const path = require('path');

/**
 * Recursively get files and folders from a directory
 * @param {string} dirPath - The directory path to scan
 * @param {string} basePath - The base path for relative paths (default: '')
 * @returns {Array} Array of file and directory objects
 */
function getFilesRecursively(dirPath, basePath = '') {
    const items = [];
    
    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            const relativePath = path.join(basePath, entry.name);
            
            // Skip dist and node_modules directories
            if (entry.name === 'dist' || entry.name === 'node_modules') {
                continue;
            }
            
            if (entry.isDirectory()) {
                items.push({
                    name: entry.name,
                    path: relativePath,
                    type: 'directory',
                    content: null,
                    children: getFilesRecursively(fullPath, relativePath)
                });
            } else {
                // Read file content
                let content = null;
                try {
                    content = fs.readFileSync(fullPath, 'utf8');
                } catch (readError) {
                    console.error(`Error reading file ${fullPath}:`, readError.message);
                    content = `Error reading file: ${readError.message}`;
                }
                
                items.push({
                    name: entry.name,
                    path: relativePath,
                    type: 'file',
                    content: content
                });
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error.message);
    }
    
    return items;
}

module.exports = {
    getFilesRecursively
}; 