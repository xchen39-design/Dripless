import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('../', import.meta.url))
process.chdir(root)
if (existsSync('.env')) process.loadEnvFile('.env')
if (process.argv.includes('--demo')) process.env.DEMO_MODE = 'true'
const children = [spawn(process.execPath, ['--watch', 'server/index.js'], { stdio: 'inherit' }), spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev', '--workspace', 'client'], { stdio: 'inherit', shell: process.platform === 'win32' })]
let stopping = false
function stop(code = 0) { if (stopping) return; stopping = true; children.forEach(child => child.kill()); process.exitCode = code }
for (const child of children) { child.on('error', error => { console.error(error.message); stop(1) }); child.on('exit', code => stop(code || 0)) }
process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())
