import { createServer } from '@taujs/server';
import config from '../../taujs.config.js';
import { serviceRegistry } from './services/registry.js';

const isDev = process.env.NODE_ENV !== "production";

const { app, net } = await createServer({
  config,
  serviceRegistry,
  debug: isDev ? { ssr: true } : false,
});

if (app) {
  const port = Number(process.env.PORT ?? net.port);
  const host = process.env.HOST ?? net.host;

  await app.listen({
    host,
    port,
  });
}
