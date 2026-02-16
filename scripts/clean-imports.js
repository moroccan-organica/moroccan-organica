
import fs from 'fs';
import path from 'path';

function getFiles(dir, files = []) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            if (!name.includes('node_modules') && !name.includes('.next')) {
                getFiles(name, files);
            }
        } else {
            if (name.endsWith('.ts') || name.endsWith('.tsx')) {
                files.push(name);
            }
        }
    }
    return files;
}

function removeUnusedImports(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const newLines = [];
    let modified = false;

    const importRegex = /^import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"](.+)['"];?$/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(importRegex);
        if (match) {
            const imports = match[1].split(',').map(s => s.trim());
            const usedImports = imports.filter(name => {
                // Skip aliases (e.g., "name as alias")
                const actualName = name.includes(' as ') ? name.split(' as ')[1].trim() : name;

                // Count occurrences of the name in the file, excluding the import line itself
                const regex = new RegExp(`\\b${actualName}\\b`, 'g');
                const matches = content.match(regex);
                return matches && matches.length > 1;
            });

            if (usedImports.length === 0) {
                modified = true;
                continue; // Remove entire line
            } else if (usedImports.length < imports.length) {
                newLines.push(line.replace(match[1], ` ${usedImports.join(', ')} `));
                modified = true;
            } else {
                newLines.push(line);
            }
        } else {
            newLines.push(line);
        }
    }

    if (modified) {
        console.log(`Cleaning: ${filePath}`);
        fs.writeFileSync(filePath, newLines.join('\n'));
    }
}

const files = getFiles('./src');
files.forEach(removeUnusedImports);
