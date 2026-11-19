import { spawn, spawnSync } from 'node:child_process';
import net from 'node:net';

const MAX_ATTEMPTS = 15;
const SOCKET_TIMEOUT_MS = 2000;
const RETRY_DELAY_MS = 2000;

function parseSqlServerHostPort(databaseUrl) {
  if (!databaseUrl || typeof databaseUrl !== 'string') {
    throw new Error(
      'Thiếu biến môi trường DATABASE_URL. Vui lòng kiểm tra file backend/.env.docker.',
    );
  }

  const schemeIdx = databaseUrl.indexOf('://');
  const withoutScheme =
    schemeIdx >= 0 ? databaseUrl.slice(schemeIdx + 3) : databaseUrl;
  const firstSegment = withoutScheme.split(';')[0]?.trim() ?? '';
  const withoutSlash = firstSegment.split('/')[0] ?? '';
  const atIdx = withoutSlash.lastIndexOf('@');
  const hostPort = atIdx >= 0 ? withoutSlash.slice(atIdx + 1) : withoutSlash;

  if (!hostPort) {
    throw new Error(
      'DATABASE_URL không hợp lệ: không phân tích được host/port SQL Server.',
    );
  }

  const colonIdx = hostPort.lastIndexOf(':');
  if (colonIdx === -1) {
    return { host: hostPort, port: 1433 };
  }

  const host = hostPort.slice(0, colonIdx).trim();
  const parsedPort = Number(hostPort.slice(colonIdx + 1).trim());
  const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 1433;

  if (!host) {
    throw new Error(
      'DATABASE_URL không hợp lệ: không xác định được hostname SQL Server.',
    );
  }

  return { host, port };
}

function checkTcpPort(host, port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    let settled = false;

    const finish = (ok) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(ok);
    };

    socket.setTimeout(SOCKET_TIMEOUT_MS);
    socket.on('connect', () => finish(true));
    socket.on('timeout', () => finish(false));
    socket.on('error', () => finish(false));
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDatabase(host, port) {
  console.log(`[docker-start] Đang chờ kết nối SQL Server tại ${host}:${port}...`);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const reachable = await checkTcpPort(host, port);
    if (reachable) {
      console.log(
        `[docker-start] SQL Server sẵn sàng sau ${attempt}/${MAX_ATTEMPTS} lần thử.`,
      );
      return;
    }

    console.log(
      `[docker-start] Chưa kết nối được SQL Server (lần ${attempt}/${MAX_ATTEMPTS}), thử lại sau ${RETRY_DELAY_MS}ms...`,
    );
    if (attempt < MAX_ATTEMPTS) {
      await sleep(RETRY_DELAY_MS);
    }
  }

  throw new Error(
    `Không thể kết nối TCP tới SQL Server (${host}:${port}) sau ${MAX_ATTEMPTS} lần thử.`,
  );
}

async function main() {
  try {
    const { host, port } = parseSqlServerHostPort(process.env.DATABASE_URL);
    await waitForDatabase(host, port);
  } catch (error) {
    console.error(`[docker-start] LỖI: ${error.message}`);
    process.exit(1);
  }

  if (process.env.PRISMA_DB_PUSH === 'true') {
    console.log('[docker-start] PRISMA_DB_PUSH=true -> đang chạy prisma db push...');
    const pushResult = spawnSync(
      'npx',
      ['prisma', 'db', 'push', '--schema=backend/prisma/schema.prisma'],
      { stdio: 'inherit' },
    );
    if (pushResult.status !== 0) {
      console.error('[docker-start] prisma db push thất bại.');
      process.exit(pushResult.status ?? 1);
    }
  }

  console.log('[docker-start] Đang khởi động NestJS (node backend/dist/main.js)...');
  const child = spawn('node', ['backend/dist/main.js'], {
    stdio: 'inherit',
  });

  const forwardSignal = (signal) => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  process.on('SIGTERM', () => forwardSignal('SIGTERM'));
  process.on('SIGINT', () => forwardSignal('SIGINT'));

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });

  child.on('error', (err) => {
    console.error('[docker-start] Lỗi khởi chạy backend:', err);
    process.exit(1);
  });
}

void main();
