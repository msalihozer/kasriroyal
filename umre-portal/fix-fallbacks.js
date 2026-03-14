const fs = require('fs');
const path = require('path');

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const file of fs.readdirSync(dir)) {
        const p = path.join(dir, file);
        if (fs.statSync(p).isDirectory()) {
            if (!['node_modules', '.next', 'dist'].includes(file)) walk(p);
        } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
            let cnt = fs.readFileSync(p, 'utf8');
            let orig = cnt;
            // Remove strictly || 'http://localhost:4000' and || "http://localhost:4000"
            cnt = cnt.replace(/\|\|\s*'http:\/\/localhost:4000'/g, "");
            cnt = cnt.replace(/\|\|\s*"http:\/\/localhost:4000"/g, "");
            
            // Also replace cases where we have `${process.env.NEXT_PUBLIC_API_URL}${url}` into a helper check
            // Actually, wait, replacing `|| 'http...'` to empty string `""` becomes `${process.env.... || ""}` which evaluates to false or string. Since process.env might be undefined, it becomes undefined + "/uploads..." which is "undefined/uploads...". NextJS gives undefined!
            
            // Better to replace `|| 'http://localhost:4000'` with `|| ''`
            cnt = orig.replace(/\|\|\s*'http:\/\/localhost:4000'/g, "|| ''");
            cnt = cnt.replace(/\|\|\s*"http:\/\/localhost:4000"/g, "|| ''");

            if (cnt !== orig) {
                fs.writeFileSync(p, cnt);
                console.log('Fixed:', p);
            }
        }
    }
}
walk('apps/admin');
walk('apps/web');
