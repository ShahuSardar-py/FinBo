const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');

// Recursive file scanner
function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getFiles(srcDir);

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Replace db.prepare or db.exec calls with await versions if they aren't already awaited
  // We match cases where there's no await beforehand
  content = content.replace(/(?<!await\s+)db\.prepare/g, 'await db.prepare');
  content = content.replace(/(?<!await\s+)db\.exec/g, 'await db.exec');

  // 2. Fix the loop constructs in page.tsx, habitats/page.tsx, notifications/page.tsx, and seedActions.ts
  // Let's replace the .forEach loops that have database actions inside them with async-friendly for...of loops
  
  // Pattern 1: habitats/page.tsx and page.tsx
  if (filePath.endsWith('habitats/page.tsx') || filePath.endsWith('page.tsx')) {
    content = content.replace(
      /tanks\.forEach\(tank\s*=>\s*\{([\s\S]*?)\}\);/g,
      `for (const tank of tanks) {$1}`
    );
  }

  // Pattern 2: notifications/page.tsx
  if (filePath.endsWith('notifications/page.tsx')) {
    content = content.replace(
      /tanks\.forEach\(tank\s*=>\s*\{([\s\S]*?)\}\);/g,
      `for (const tank of tanks) {$1}`
    );
  }

  // Pattern 3: seedActions.ts
  if (filePath.endsWith('seedActions.ts')) {
    // Replace tank seed loop
    content = content.replace(
      /seedTanks\.forEach\(tank\s*=>\s*\{([\s\S]*?)\}\);/g,
      `for (const tank of seedTanks) {$1}`
    );
    // Replace fish seed loop
    content = content.replace(
      /seedLivestock\.forEach\(fish\s*=>\s*\{([\s\S]*?)\}\);/g,
      `for (const fish of seedLivestock) {$1}`
    );
    // Replace plants seed loop
    content = content.replace(
      /seedPlants\.forEach\(plant\s*=>\s*\{([\s\S]*?)\}\);/g,
      `for (const plant of seedPlants) {$1}`
    );
    // Replace equipment seed loop
    content = content.replace(
      /seedEquipment\.forEach\(eq\s*=>\s*\{([\s\S]*?)\}\);/g,
      `for (const eq of seedEquipment) {$1}`
    );
    // Replace logs seed loop
    content = content.replace(
      /seedLogs\.forEach\(log\s*=>\s*\{([\s\S]*?)\}\);/g,
      `for (const log of seedLogs) {$1}`
    );
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully migrated: ${path.relative(process.cwd(), filePath)}`);
  }
});
