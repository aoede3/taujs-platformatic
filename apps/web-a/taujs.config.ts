import { createServiceData, defineConfig } from '@taujs/server/config';
import { reactRenderer } from '@taujs/react/renderer';

import type { ServiceRegistry } from './src/server/services/registry.ts';

// Registry-typed service declarations: the helper carries each method's RESULT type into
// RouteData, so the app's types derive from this file instead of being hand-written
// (see src/client/app-types.ts). Closure handlers and ctx.call remain available for dynamic
// dispatch - https://taujs.dev/guides/services/
const serviceData = createServiceData<ServiceRegistry>();

export default defineConfig({
  // The Gateway proxies to this application over a rewritten prefix and the browser dials the
  // same origin, so Vite has to admit the proxy host.
  vite: { server: { allowedHosts: ['web-a.plt.local'] } },
  server: {
    port: 5173,
    host: 'localhost',
    hmrPort: 5174,
    // Preserve topology - these two equal the Gateway's proxy prefix/rewritePrefix for this
    // application.
    mountPrefix: '/a',
    publicBasePath: '/a',
    // The development transport for this ownership mode.
    hmrTransport: 'attached',
  },
  // Declared Vite surface - applied to dev and build. See https://taujs.dev/reference/taujs-config/#vite-configuration
  // vite: {
  //   define: { __APP_VERSION__: JSON.stringify('0.0.0') },
  //   plugins: [],
  // },
  // alias: { '@components': './src/client/shared/components' },
  apps: [
    {
      appId: 'main',
      entryPoint: '',
      renderer: reactRenderer({ project: './tsconfig.json' }),
      routes: [
        {
          path: '/',
          attr: {
            render: 'ssr',
            hydrate: true,
            // Declared service edge: RouteData<typeof config, '/'> is greet()'s resolved result
            data: serviceData('example', 'greet', () => ({ name: 'SSR' })),
          },
        },
        {
          path: '/streaming',
          attr: {
            render: 'streaming',
            hydrate: true,
            // The same declared edge on a streaming route: the shell streams while greet() resolves
            data: serviceData('example', 'greet', () => ({ name: 'Streaming' })),
            // meta recommended for streaming routes for SEO/social and render timing
            meta: {
              title: "τjs — Streaming",
              description:
                "Streaming SSR route (Suspense progressively reveals content).",
            },
          },
        },
      ],
    },
  ],
});
