# τjs & Platformatic Watt Runtime

This repository contains a **Platformatic Watt runtime** that starts:

- a backend API (via Watt applications), and
- a **τjs server**, co-located and started under the same process supervisor.

τjs is consumed as a frontend/page orchestrator and communicates with the backend **over HTTP**.

No in-process coupling or shared service internals are used.

---

## Requirements

- Node.js **v20.16.0+** or **v22.3.0+**
- macOS, Linux, or Windows (WSL recommended)

---

## Setup

Install dependencies:

```bash
npm install
```

---

## Running

Start the Watt runtime (which also starts τjs):

```bash
npm start
```

By default:

- Watt exposes backend APIs on its configured port
- τjs runs as a separate HTTP service and calls the backend via `BACKEND_URL`

Refer to environment configuration for exact ports and URLs.

---

## Architecture Notes

- Watt acts as the **backend runtime / gateway**
- τjs acts as the **page-level orchestrator**
- The integration boundary is **HTTP**, even when co-located
- Backend contracts are expected to be described via OpenAPI

---

## Adding Backend Applications

To add additional backend applications or services to the Watt runtime:

```bash
npx create-platformatic
```

This will scaffold a new Watt application within the workspace.

---

## Notes

- τjs should not import or depend on Watt internals
- Backend aggregation happens either in Watt **or** in τjs per route, never both
- Co-location is an operational choice and does not change the architectural boundary
