import { spawn, spawnSync } from 'node:child_process';
import net from 'node:net';

spawnSync('pnpm', ['exec', 'astro', 'preview', 'stop'], { stdio: 'ignore' });

const preview = spawn('pnpm', ['exec', 'astro', 'preview', '--host', '127.0.0.1', '--port', '4399'], {
  stdio: 'inherit',
  detached: true,
});

function stop(code) {
  try {
    process.kill(-preview.pid, 'SIGKILL');
  } catch {
    preview.kill('SIGKILL');
  }
  process.exit(code);
}

function waitForPort(port, timeoutMs) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = net.connect({ port, host: '127.0.0.1' }, () => {
        socket.end();
        resolve();
      });
      socket.on('error', () => {
        if (Date.now() - started > timeoutMs) reject(new Error(`preview no escuchó en ${port}`));
        else setTimeout(attempt, 200);
      });
    };
    attempt();
  });
}

process.on('SIGINT', () => stop(1));
process.on('SIGTERM', () => stop(1));

try {
  await waitForPort(4399, 20_000);
} catch (error) {
  console.error(error);
  stop(1);
}

const tests = spawn('pnpm', ['exec', 'playwright', 'test'], { stdio: 'inherit' });
tests.on('exit', (code) => stop(code ?? 1));
