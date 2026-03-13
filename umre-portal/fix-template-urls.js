const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    
    // Replace URL paths
    content = content.replace(/`http:\/\/localhost:4000(\$\{[^}]+\})`/g, 
        "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}$1`");
    
    if (content !== original) {
        console.log(`Updated: ${filePath}`);
        fs.writeFileSync(filePath, content, 'utf-8');
    }
}

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (!['node_modules', '.next', 'dist'].includes(file)) {
                walk(filePath);
            }
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            replaceInFile(filePath);
        }
    }
}

walk('apps/admin/components/ui');
walk('apps/web/components');
walk('apps/web/app');
