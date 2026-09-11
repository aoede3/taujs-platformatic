/**
 * The application's type contract, DERIVED from taujs.config.ts - never hand-written.
 * Every import here is type-only, so nothing from the config or server reaches the client bundle.
 */
import type config from '../../taujs.config.ts';
import type { RouteContext, RouteData } from '@taujs/server/config';

/** The route-discriminated context the host passes to appComponent and headContent. */
export type AppRouteContext = RouteContext<typeof config>;

/**
 * The union of every declared route's resolved data - both scaffold routes resolve greet(), so
 * one shared type serves the whole app.
 *
 * A declared route WITHOUT `attr.data` contributes `Record<string, undefined>` (the server
 * supplies `{}` for it), so the union stays usable when such routes exist: reads become
 * `T | undefined`, making code account for the no-data route. When routes diverge further,
 * narrow per route with the derived aliases below - still from the config, never hand-written.
 */
export type AppData = RouteData<typeof config>;

// Optional narrowing when routes diverge:
// export type HomeData = RouteData<typeof config, '/'>;
// export type StreamingData = RouteData<typeof config, '/streaming'>;
