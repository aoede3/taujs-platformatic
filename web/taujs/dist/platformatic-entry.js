import { createServer } from "@taujs/server";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import config from "./taujs.config.js";
import { serviceRegistry } from "./src/server/services/registry.js";
const isDev = process.env.NODE_ENV !== "production";
const rootDir = dirname(fileURLToPath(import.meta.url));
const serviceRoot = resolve(rootDir, "..");
const clientRoot = resolve(serviceRoot, isDev ? "src/client" : "dist/client");
export async function create() {
    const { app } = await createServer({
        config,
        serviceRegistry,
        clientRoot,
        debug: isDev ? { ssr: true } : false,
        // optional: only if your @taujs/server supports it:
        // basePath: globalThis.platformatic?.basePath ?? '/',
    });
    if (!app)
        throw new Error("TauJS did not return a Fastify instance");
    // CRITICAL: do NOT call app.listen()
    return app;
}
