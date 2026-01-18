import { defineConfig } from '@taujs/server/config';

const port = Number(process.env.PORT ?? 5173);
const hmrPort = Number(process.env.HMR_PORT ?? 5174);
const host = process.env.HOST ?? 'localhost';

export default defineConfig({
  server: {
    port,
    host,
    hmrPort,
  },
  apps: [
    {
      appId: 'main',
      entryPoint: '',
      routes: [
        {
          path: '/',
          attr: {
            render: 'ssr',
            hydrate: true,
            // Direct service invocation: standard SSR
            data: async (params, ctx) => {
              return ctx.call('example', 'greet', { name: 'SSR' });
            },
          },
        },
        {
          path: '/streaming',
          attr: {
            render: 'streaming',
            hydrate: true,
            // Descriptor-based data: resolved by the server
            data: async (params) => ({
              args: { name: 'Streaming' },
              serviceName: 'example',
              serviceMethod: 'greet',
            }),
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
