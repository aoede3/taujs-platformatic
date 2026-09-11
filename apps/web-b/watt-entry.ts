// MODE B under Watt: the entry creates and owns Fastify; τjs embeds through
// createServer({ fastify }) and renders only its declared routes. The RFC 0014 section 1
// mediation recipe is wired verbatim. See https://taujs.dev/reference/platformatic-watt/
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';

import { getLogger } from '@platformatic/globals';
import Fastify from 'fastify';
import { createServer } from '@taujs/server';

import config from './taujs.config.ts';
import { serviceRegistry } from './src/server/services/registry.ts';

const appRoot = import.meta.dirname;
const SAFE_REQUEST_ID = /^[a-zA-Z0-9-_:.]{1,128}$/;

export async function create() {
  const logger = getLogger();
  const isDev = process.env.NODE_ENV === 'development';

  const app = Fastify({
    loggerInstance: logger,
    genReqId(raw) {
      const incoming = raw.headers['x-request-id'];
      return typeof incoming === 'string' && SAFE_REQUEST_ID.test(incoming) ? incoming : randomUUID();
    },
  });

  // Caller root policy: an active CSP header and a marker on every response.
  app.addHook('onRequest', async (_req, reply) => {
    reply.header('content-security-policy', "default-src 'self'; script-src 'self' 'unsafe-inline'");
    reply.header('x-host-policy', 'watt-mode-b');
  });
  app.setNotFoundHandler((req, reply) => {
    reply.code(404).send({ error: 'not_found', marker: 'caller-not-found', url: req.url });
  });
  // Registered under the public prefix - under a preserve-prefix Gateway a route registered at
  // the application root is not reachable publicly.
  app.get('/b/host/before', async () => ({ host: 'before', marker: 'caller-route' }));

  const tau = await createServer({
    config,
    serviceRegistry,
    fastify: app,
    debug: isDev ? { ssr: true } : false,
    clientRoot: join(appRoot, isDev ? 'src/client' : 'dist/client'),
    projectRoot: appRoot,
  });
  if (tau.app !== undefined) throw new Error('Mode B: createServer must not return an app for a caller-owned Fastify');

  // RFC 0014 section 1 mediation recipe, verbatim.
  const onUpgrade = (req: IncomingMessage, socket: Duplex, head: Buffer): void => {
    if (tau.dev.hmr.tryHandleUpgrade(req, socket, head)) return;
    socket.destroy();
  };
  app.server.on('upgrade', onUpgrade);
  app.addHook('onClose', async () => { app.server.off('upgrade', onUpgrade); });

  return app;
}
