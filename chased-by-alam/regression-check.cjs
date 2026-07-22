const fs = require('fs');
const path = require('path');

const gameDirectory = __dirname;
const html = fs.readFileSync(path.join(gameDirectory, 'index.html'), 'utf8');

function requirePattern(pattern, description) {
  if (!pattern.test(html)) throw new Error(`Missing regression guard: ${description}`);
  console.log(`OK ${description}`);
}

requirePattern(/<meta name="game-version" content="beta-1\.1">/, 'Beta 1.1 version metadata');
requirePattern(/class SafePointerLockControls extends THREE\.EventDispatcher/, 'safe pointer-lock controls');
requirePattern(/resetLookInput\(100\)/, 'pointer-lock transition warm-up');
requirePattern(/Math\.abs\(rawX\) > 600 \|\| Math\.abs\(rawY\) > 600/, 'impossible mouse-delta rejection');
requirePattern(/MOVEMENT_MAX_STEP: 0\.1/, 'collision substep limit');
requirePattern(/function movePlayerWithCollisions\(delta\)/, 'substepped movement solver');
requirePattern(/function circleIntersectsNearbyWall\(position, radius\)/, 'circular player collision');
requirePattern(/function sanitizeSettings\(candidate = \{\}\)/, 'saved-settings validation');
requirePattern(/velocity\.set\(0, 0, 0\);\s*\n\s*}/, 'velocity reset on input clear');
requirePattern(/Number\.isFinite\(rawDelta\)/, 'invalid frame-delta guard');

if (/PointerLockControls\.js/.test(html)) {
  throw new Error('The unfiltered PointerLockControls import returned.');
}

const moduleMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!moduleMatch) throw new Error('Inline game module was not found.');
const syntaxOnlySource = moduleMatch[1].replace(/^\s*import\s+.*?;\s*$/gm, '');
new Function(syntaxOnlySource);
console.log('OK inline game module syntax');
console.log('All Beta 1.1 regression checks passed.');
