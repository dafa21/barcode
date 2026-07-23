import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

import authRoutes from "./src/modules/auth/auth.routes.ts";
import officeRoutes from "./src/modules/offices/office.routes.ts";
import eventRoutes from "./src/modules/events/event.routes.ts";
import guestRoutes from "./src/modules/guests/guest.routes.ts";
import scannerRoutes from "./src/modules/scanner/scanner.routes.ts";
import reportRoutes from "./src/modules/reports/report.routes.ts";

import picRoutes from "./src/modules/pics/pic.routes.ts";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: "200mb" }));
  app.use(express.urlencoded({ limit: "200mb", extended: true }));

  // API routes FIRST
  app.get("/undangan/:slug", (req, res) => {
    res.redirect(`/api/events/public/invitation/${req.params.slug}`);
  });
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/offices', officeRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/guests', guestRoutes);
  app.use('/api/scanner', scannerRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/pics', picRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
