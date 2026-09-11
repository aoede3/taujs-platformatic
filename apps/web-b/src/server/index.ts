import { createServer } from '@taujs/server';
import config from '../../taujs.config.ts';
import { serviceRegistry } from './services/registry.ts';

// Development is requested explicitly, exactly as τjs derives its own runtime mode: every other
// value - production, test, staging, unset - is production. Do not invert this check.
const isDev = process.env.NODE_ENV === "development";

const { app, net } = await createServer({
  config,
  serviceRegistry,
  debug: isDev ? { ssr: true } : false,
});

if (app) {
  await app.listen({
    host: net.host,
    port: net.port,
  });
}
