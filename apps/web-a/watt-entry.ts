// MODE A under Watt: taujs creates and owns Fastify; Watt supervises it.
//
// Difference from the scaffold's own `src/server/index.ts` (recorded as recipe content):
//  - exports `create()` and RETURNS the application instead of calling `app.listen()` - the
//    supervisor owns listening;
//  - `clientRoot` and `projectRoot` are ABSOLUTE - a Watt worker's cwd is the runtime root, not
//    the application directory, so the scaffold's implicit `process.cwd()` defaults would resolve
//    against the wrong directory;
//  - the development predicate is `NODE_ENV === 'development'`, exactly as the scaffold's entry
//    has it (every other value, including unset, is production).
import { join } from 'node:path';

import { createServer } from '@taujs/server';

import config from './taujs.config.ts';
import { serviceRegistry } from './src/server/services/registry.ts';

const appRoot = import.meta.dirname;

export async function create() {
  const isDev = process.env.NODE_ENV === 'development';

  const { app } = await createServer({
    config,
    serviceRegistry,
    debug: isDev ? { ssr: true } : false,
    clientRoot: join(appRoot, isDev ? 'src/client' : 'dist/client'),
    projectRoot: appRoot,
  });

  if (!app) throw new Error('Mode A: expected a taujs-created Fastify application');

  return app;
}
