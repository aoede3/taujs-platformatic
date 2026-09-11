# web-a - Mode A

τjs is the application. `watt-entry.ts` exports `create()`, calls `createServer` and returns the
Fastify instance τjs created; Watt owns listening. `hmrTransport: 'attached'` puts the HMR channel
on τjs's own server, so there is nothing else to wire.

`clientRoot` and `projectRoot` are absolute because a Watt worker's current directory is the
runtime root, not this directory. The scaffold's own `src/server/index.ts` is untouched and
still runs standalone with `npm run dev`.

The settings and the reasoning are on the [Platformatic Watt
reference](https://taujs.dev/reference/platformatic-watt/).
