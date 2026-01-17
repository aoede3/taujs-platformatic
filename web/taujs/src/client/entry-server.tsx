import { createRenderer } from '@taujs/react';
import { App } from './App';

export const { renderSSR, renderStream } = createRenderer({
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
