import { createRenderer } from '@taujs/react';
import { App } from './App';

import type { AppData, AppRouteContext } from './app-types';

// Generics derived from taujs.config.ts: typed data for headContent and the store, typed
// routeContext for appComponent.
export const { renderSSR, renderStream } = createRenderer<AppData, AppRouteContext>({
  appComponent: () => <App />,
  headContent: ({ data, meta }) => `
    <title>${meta?.title || "τjs - Composing systems, not just apps"}</title>
    <meta name="description" content="${
      meta?.description ||
      data?.message ||
      "τjs - Composing systems, not just apps"
    }">
  `,
  enableDebug: process.env.NODE_ENV === "development",
});
