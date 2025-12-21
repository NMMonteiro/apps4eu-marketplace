/* eslint-disable */
const fs = require('fs');
const { execSync } = require('child_process');

const envFile = fs.readFileSync('.env', 'utf8');
const lines = envFile.split('\n');

for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx);
    let val = trimmed.slice(eqIdx + 1);

    // Remove quotes if present
    if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
    }

    // Skip placeholders
    if (val.includes('sk_test_') || val.includes('pk_test_') || val.includes('whsec_')) {
        console.log(`Skipping placeholder: ${key}`);
        continue;
    }

    try {
        console.log(`Setting ${key}...`);
        // Use shell piping to feed the value
        execSync(`echo "${val}" | vercel env add ${key} production`, { stdio: 'inherit' });
    } catch (e) {
        console.log(`Failed to set ${key}, might already exist or error.`);
    }
}
