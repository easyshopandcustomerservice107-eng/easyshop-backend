const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, 'node_modules', 'bcryptjs', 'package.json');
console.log('Reading:', pkgPath);
const start = Date.now();
try {
    const data = fs.readFileSync(pkgPath, 'utf8');
    const end = Date.now();
    console.log('Read success in', end - start, 'ms');
    console.log('Content length:', data.length);
} catch (err) {
    console.error('Error:', err);
}
