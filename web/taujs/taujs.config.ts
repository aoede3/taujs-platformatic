import { defineConfig } from '@taujs/server/config';

export default defineConfig({
  server: {
    port: 5173,
    host: 'localhost',
    hmrPort: 5174,
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
