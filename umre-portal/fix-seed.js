const fs = require('fs');
let code = fs.readFileSync('prisma/seed.ts', 'utf-8');
code = code.replace(/city: i % 2 === 0 \? 'MEKKE' : 'MEDINE',/g, "locationText: i % 2 === 0 ? 'Mekke' : 'Medine',");
code = code.replace(/amenities: \['Wifi', 'Restaurant', 'Transfer'\],/g, "// removed amenities");
fs.writeFileSync('prisma/seed.ts', code);
