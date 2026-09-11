# τjs under Platformatic Watt

This repository is the runnable worked example of [Running τjs Under a Supervisor or Behind a
Gateway](https://taujs.dev/guides/supervisors-and-gateways/) for Platformatic Watt with the
Gateway. The generic guide states five contracts a supervisor, gateway or ingress must satisfy to
carry τjs through development; the [Platformatic Watt
reference](https://taujs.dev/reference/platformatic-watt/) fills them in with the concrete Watt
settings; this repository is those settings, running.

It is not a τjs integration package. τjs contains no Platformatic dependency and does no
Platformatic detection - everything here is a consumer of ordinary τjs capabilities
(`createServer`, `hmrTransport`, `mountPrefix`/`publicBasePath`) from the host side, and there is
no `@taujs/watt` package.

## The applications

One Watt runtime, three applications, the Gateway as entrypoint on port 3042.

| Application | Ownership mode | What it demonstrates |
| --- | --- | --- |
| `apps/gateway` | - | `@platformatic/gateway`, proxying `/a` and `/b` with the prefix preserved |
| `apps/web-a` | Mode A - τjs is the application | τjs creates and owns Fastify; `hmrTransport: 'attached'`; served under `/a` |
| `apps/web-b` | Mode B - τjs is embedded | The entry creates and owns Fastify, with Watt's logger, its own request-id policy, its own routes and not-found handler; τjs embeds; `hmrTransport: 'mediated'`; served under `/b` |

Running both modes under one Gateway is the point: it is the arrangement that shows an attached
HMR channel and a mediated one on the same runtime with no cross-talk between them.

Each application is a `@taujs/create-taujs` React scaffold plus the edits the reference page
describes: a `watt-entry.ts` exporting `create()` for the supervisor to call, a `watt.json`
carrying the restart-watcher scope, three settings in `taujs.config.ts` (`vite.server.allowedHosts`,
`server.mountPrefix`/`publicBasePath`, `server.hmrTransport`) and pinned packages. The scaffold's
own `src/server/index.ts` is untouched and still runs standalone. `NODE_ENV` is supplied by the
runtime configuration's per-application `env` block, never by an npm script.

## Running

```bash
npm install
npm run dev      # wattpm dev   - http://127.0.0.1:3042/a/ and /b/, HMR through the Gateway
npm run build    # wattpm build - each application's own build, into its dist/
npm start        # wattpm start -c watt.prod.json
```

`watt.json` is the development configuration and `watt.prod.json` the production one; they differ
only in `NODE_ENV`.

## What is certified

Node 22.19.0, `@taujs/server` 0.39.1, `@taujs/react` 0.9.0, `@taujs/create-taujs` 0.9.0,
Platformatic (`wattpm`, `@platformatic/node`, `@platformatic/gateway`, `@platformatic/globals`)
3.69.0, Fastify 5.12.3, Vite 8.3.0. Dated 2026-09-11.

| Cell | Result |
| --- | --- |
| C1 production runtime-import isolation | Zero build-tool modules in either production worker's module graph, both modes |
| C2 non-root production links | Every τjs-emitted script, stylesheet and asset URL carries the public prefix and returns 200 |
| C3 Gateway development, no environment workaround | `NODE_ENV` from the runtime configuration only; 200 through the Gateway, both modes |
| C4 HMR direct and through the Gateway | Connected, one attributed update, byte-identical restore - both modes, both paths |
| C5 two prefixed applications, isolated HMR | No cross-talk between the attached and the mediated channel; 0 stops / 0 starts |
| C6 exactly-once development teardown | One Stopping and one Stopped per application; every port silent afterwards |
| C7 Mode B ownership | Caller route, not-found policy, CSP marker, request identity and Watt logger lineage all intact |
| C8 build/dist restart loop, watcher scope | No loop with the ruled scope; one watched-source edit gives exactly one restart |
| C9 admission classification | `Origin` dropped and `Host` rewritten through the Gateway, so Vite's token check does not run there; direct refuses missing and invalid tokens |

The cells are those of the reference page's certification, re-run on the pins above. C9 is a
classification rather than a defect: behind a rewriting proxy the requirement is a trusted
development network, as the [`server.hmrTransport`
reference](https://taujs.dev/reference/taujs-config/#serverhmrtransport) states.

## What is not covered

Other Platformatic versions; other supervisors or gateways - hold them against the generic
guide's five contracts directly; production HMR - none exists, in any mode, on any host. There is
no backend application here: both τjs applications serve their own routes, and a τjs service
calling another Watt application over the mesh is not part of what was certified.

## History

The first attempt at this repository, from January 2026, is kept at the tag
`2026-01-first-attempt`. It predates the supervisor and gateway contracts and is superseded by
the tree on `main`.
