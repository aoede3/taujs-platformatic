import { Suspense } from "react";
import { useSSRStore } from "@taujs/react";

import "./styles.css";

type GreetingData = {
  message: string;
  timestamp: string;
};

function GreetingCard() {
  const data = useSSRStore<GreetingData>();

  return (
    <section className="card card--primary">
      <p className="card-message">{data.message}</p>
      <p className="card-meta">
        Generated at: {new Date(data.timestamp).toLocaleString()}
      </p>
    </section>
  );
}

export function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">τjs - Composing systems, not just apps</h1>
        <p className="app-subtitle">
          Request-first application composition with explicit per-route
          rendering control.
        </p>
      </header>

      <Suspense
        fallback={
          <section className="card card--primary">
            <p className="card-message">Loading greeting…</p>
            <p className="card-meta">Streaming data from the server.</p>
          </section>
        }
      >
        <GreetingCard />
      </Suspense>

      <section className="section">
        <h2 className="section-title">Quick start</h2>
        <ul className="list">
          <li>
            Edit <code>src/client/App.tsx</code> to change this page.
          </li>
          <li>
            Adjust styles in <code>src/client/styles.css</code>.
          </li>
          <li>
            Configure routes in <code>taujs.config.ts</code>.
          </li>
          <li>
            Visit <a href="/">/</a> for standard SSR and{" "}
            <a href="/streaming">/streaming</a> for streaming SSR.
          </li>
          <li>
            Further information can be found at{" "}
            <a href="http://taujs.dev" target="_blank">
              τjs Documentation and Guides
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="tip">
        <p>
          <strong>SSR:</strong> The <code>/</code> route resolves all data on
          the server before sending HTML. You get a complete, fully rendered
          document on first byte, which is ideal for predictable latency and
          caching.
        </p>
        <p>
          <strong>STREAM:</strong> The <code>/streaming</code> route uses a
          service descriptor and returns a Promise. The{" "}
          <code>&lt;Suspense&gt;</code> boundary above shows a fallback while
          the server resolves it, then progressively streams the final content.
        </p>
      </section>

      <footer className="app-footer">
        <p>
          Built with{" "}
          <a href="https://taujs.dev" target="_blank" rel="noopener">
            τjs
          </a>
          {" · "}
          <a href="https://fastify.dev" target="_blank" rel="noopener">
            Fastify
          </a>
          {" · "}
          <a href="https://react.dev" target="_blank" rel="noopener">
            React
          </a>
        </p>
      </footer>
    </div>
  );
}
