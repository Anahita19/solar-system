import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { IS_PUBLIC_DEMO } from "@shared/site-mode";

let publicDemoMapCache: { bytes: Buffer; contentType: string } | null = null;

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/property-map", async (req, res) => {
    const address = typeof req.query.address === "string" ? req.query.address.trim() : "";
    if (address.length < 5 || address.length > 500) return res.status(400).json({ error: "A valid property address is required." });
    if (IS_PUBLIC_DEMO && address !== "Austin, TX") return res.status(403).json({ error: "Public demo map requests are restricted to the sample property." });
    if (IS_PUBLIC_DEMO && publicDemoMapCache) {
      return res
        .set("Content-Type", publicDemoMapCache.contentType)
        .set("Cache-Control", "public, max-age=86400")
        .status(200)
        .send(publicDemoMapCache.bytes);
    }
    const apiUrl = process.env.MANUS_API_URL;
    const key = process.env.MANUS_API_KEY;
    if (!apiUrl || !key) return res.status(503).json({ error: "Satellite mapping is not configured." });
    const url = new URL(`${apiUrl.replace(/\/$/, "")}/v1/maps/proxy/maps/api/staticmap`);
    url.search = new URLSearchParams({ center: address, zoom: "18", size: "900x560", maptype: "satellite", markers: `color:yellow|${address}`, key }).toString();
    try {
      const map = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!map.ok) {
        console.error("Maps proxy rejected satellite request:", map.status, (await map.text()).slice(0, 500));
        return res.status(502).json({ error: "Satellite imagery is temporarily unavailable." });
      }
      const contentType = map.headers.get("content-type") || "image/png";
      const bytes = Buffer.from(await map.arrayBuffer());
      if (IS_PUBLIC_DEMO) publicDemoMapCache = { bytes, contentType };
      res.set("Content-Type", contentType);
      res.set("Cache-Control", IS_PUBLIC_DEMO ? "public, max-age=86400" : "private, max-age=300");
      res.status(200).send(bytes);
    } catch (error) {
      console.error("Satellite map request failed:", error);
      res.status(502).json({ error: "Satellite imagery is temporarily unavailable." });
    }
  });
  app.get("/api/platform/config.js", (_req, res) => {
    res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
  });
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", error => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}`));
}

startServer().catch(error => { console.error(error); process.exit(1); });
