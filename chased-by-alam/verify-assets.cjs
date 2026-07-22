const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const gameDirectory = __dirname;

const protectedAssets = [
  {
    file: 'alam.jpg',
    constant: 'NEXTBOT_IMAGE_URL',
    expected: '7637837f6f9417afa99fc5616b46c08f83c07176c1b554a847508441e3488a78',
  },
  {
    file: 'alam_chase.mp3',
    constant: 'CHASE_AUDIO_URL',
    expected: '40176e98af99e2dd7fe365fa372d8a87946c5bf6c589f76dbe4d28acde973e61',
  },
  {
    file: 'alam_death.MP3',
    constant: 'DEATH_AUDIO_URL',
    expected: 'dd7a53b1e500f33c49b65c104c655d6a2949a118ce5889825d417d182860c918',
  },
];

const html = fs.readFileSync(path.join(gameDirectory, 'index.html'), 'utf8');
let failed = false;

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

for (const asset of protectedAssets) {
  const local = fs.readFileSync(path.join(gameDirectory, asset.file));
  const expression = new RegExp(`const\\s+${asset.constant}\\s*=\\s*'data:[^;]+;base64,([^']+)'`);
  const match = html.match(expression);
  const localHash = sha256(local);
  const embeddedHash = match ? sha256(Buffer.from(match[1], 'base64')) : 'missing';
  const ok = localHash === asset.expected && embeddedHash === asset.expected;

  console.log(`${ok ? 'OK' : 'FAIL'} ${asset.file}`);
  console.log(`  local:    ${localHash}`);
  console.log(`  embedded: ${embeddedHash}`);
  if (!ok) failed = true;
}

if (failed) {
  console.error('Protected ALAM media verification failed.');
  process.exitCode = 1;
} else {
  console.log('All original ALAM image and audio assets are byte-for-byte intact.');
}
