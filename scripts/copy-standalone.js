const fs = require('fs');
const path = require('path');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source path does not exist: ${src}, skipping.`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('Copying static assets for standalone build...');
  
  // Copy .next/static to .next/standalone/.next/static
  const srcStatic = path.join(__dirname, '../.next/static');
  const destStatic = path.join(__dirname, '../.next/standalone/.next/static');
  copyDirSync(srcStatic, destStatic);
  console.log('Static assets copied successfully.');

  // Copy public to .next/standalone/public
  const srcPublic = path.join(__dirname, '../public');
  const destPublic = path.join(__dirname, '../.next/standalone/public');
  copyDirSync(srcPublic, destPublic);
  console.log('Public assets copied successfully.');
} catch (err) {
  console.error('Error during post-build assets copy:', err);
  process.exit(1);
}
