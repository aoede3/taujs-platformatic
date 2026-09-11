# web-b - Mode B

τjs is embedded in an existing Fastify application. `watt-entry.ts` creates Fastify itself, on
Watt's logger (`getLogger()` from `@platformatic/globals`) with its own request-id policy, a
caller route, a not-found handler and a root-policy header, then passes the instance to
`createServer({ fastify })`. `hmrTransport: 'mediated'`: the entry's own `upgrade` listener offers
τjs first refusal on each upgrade through `tau.dev.hmr.tryHandleUpgrade` and destroys the rest.

The caller route is registered under the public prefix, `/b/host/before`, because under a
preserve-prefix Gateway a route registered at the application root is not reachable publicly.
The scaffold's own `src/server/index.ts` is untouched and still runs standalone with
`npm run dev`.

The contracts these settings satisfy are in [Running τjs Under a Supervisor or Behind a
Gateway](https://taujs.dev/guides/supervisors-and-gateways/).
