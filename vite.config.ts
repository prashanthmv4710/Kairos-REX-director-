import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";

export default defineConfig({
  server: {
    port: 3099,
  },
  plugins: [
    react({
      // Exclude generated LD components from Fast Refresh — they are read-only
      exclude: /src\/(components|patterns|common|hooks)\/.*/,
    }),
    a11yReportPlugin(),
  ],
  resolve: {
    alias: {
      "@livingdesign/react": path.resolve(
        __dirname,
        "src/index.ts"
      ),
    },
  },
});

/**
 * Living Design a11y dev-server plugin.
 *
 * Receives violation reports POSTed from the in-browser A11yDevAssertions
 * runtime scanner at `/__ld_a11y_report`. Writes them to the terminal with a
 * loud banner AND persists the latest report to `./.ld-a11y-report.json` at
 * the project root so a coding agent that doesn't see the browser can:
 *
 *   - tail the `npm run dev` stdout, OR
 *   - `cat .ld-a11y-report.json`, OR
 *   - `curl http://localhost:<port>/__ld_a11y_report` for the live snapshot
 *
 * to discover what's wrong and fix it.
 *
 * Dev-only: the plugin applies in "serve" mode; it is a no-op in production
 * builds (and the browser scanner itself is tree-shaken there).
 */
function a11yReportPlugin(): Plugin {
  const REPORT_PATH = path.resolve(process.cwd(), ".ld-a11y-report.json");
  // The headless Stop-hook (scripts/a11y/scan.mjs) writes the authoritative
  // axe-core report here. The in-browser modal fetches it via GET /__ld_a11y_axe
  // and prefers it over its own domScan output. Its existence means the loop ran
  // and issues remain (the post-cap "second turn").
  const AXE_REPORT_PATH = path.resolve(process.cwd(), ".a11y", "a11y-errors.json");
  let latestReport: unknown = null;

  const writeReport = (payload: unknown) => {
    latestReport = payload;
    try {
      fs.writeFileSync(REPORT_PATH, JSON.stringify(payload, null, 2) + "\n", "utf8");
    } catch {
      /* non-fatal */
    }
  };

  return {
    name: "ld-a11y-report",
    apply: "serve",
    configureServer(server) {
      // One-time startup banner so a coding agent that tails `npm run dev`
      // stdout immediately sees where to look when a violation fires.
      server.httpServer?.once("listening", () => {
        const port = (server.config.server.port ?? "") as string | number;
        const portStr = port ? `:${port}` : "";
        server.config.logger.info(
          "\n\u001b[36m[LD a11y] Runtime accessibility scanner active in dev.\u001b[0m" +
            `\n  • Violations appear here as a red \u001b[41;97m LD A11Y \u001b[0m banner when the app is loaded in a browser.` +
            `\n  • Machine-readable snapshot: \u001b[2m.ld-a11y-report.json\u001b[0m (project root)` +
            `\n  • Live snapshot: \u001b[2mcurl http://localhost${portStr}/__ld_a11y_report\u001b[0m` +
            `\n  • Scanner only runs inside a browser — visit the page (curl of / is not enough) to surface issues.\n`,
        );
      });

      // GET /__ld_a11y_axe -> the authoritative axe-core report from disk
      // (.a11y/a11y-errors.json). The browser modal reads this to render the
      // SAME ground truth the agent was handed. Empty shape when no report yet.
      server.middlewares.use("/__ld_a11y_axe", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        try {
          res.end(fs.readFileSync(AXE_REPORT_PATH, "utf8"));
        } catch {
          res.end(JSON.stringify({ ruleCount: 0, rules: [] }));
        }
      });

      // Push an HMR custom event whenever the axe report file appears / changes /
      // is cleared, so the modal can re-fetch without a full reload. The report
      // dir is often gitignored, so add the path explicitly to the watcher.
      server.watcher.add(AXE_REPORT_PATH);
      const notifyAxe = (kind: string) => (file: string) => {
        if (path.resolve(file) !== AXE_REPORT_PATH) return;
        server.ws.send({ type: "custom", event: "ld-a11y:axe", data: { kind } });
      };
      server.watcher.on("add", notifyAxe("add"));
      server.watcher.on("change", notifyAxe("change"));
      server.watcher.on("unlink", notifyAxe("unlink"));

      server.middlewares.use("/__ld_a11y_report", (req, res) => {
        if (req.method === "GET") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(latestReport ?? { count: 0, issues: [] }, null, 2));
          return;
        }
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            writeReport(payload);

            if (payload && typeof payload === "object" && typeof payload.count === "number") {
              if (payload.count === 0) {
                server.config.logger.info(
                  "\n\u001b[32m[LD a11y] All violations resolved.\u001b[0m\n",
                );
              } else {
                const issues: string[] = Array.isArray(payload.issues) ? payload.issues : [];
                const header =
                  `\n\u001b[41;97m LD A11Y \u001b[0m \u001b[31m` +
                  `${payload.count} accessibility violation(s) at ${payload.url ?? "(unknown url)"} — ` +
                  `reported ${payload.timestamp ?? ""}\u001b[0m\n` +
                  issues.map((v, i) => `  \u001b[31m${i + 1}. ${v}\u001b[0m`).join("\n") +
                  `\n\n\u001b[2mFull report: ${REPORT_PATH}\u001b[0m\n` +
                  `\u001b[2mLive snapshot: curl http://localhost:${server.config.server.port ?? ""}/__ld_a11y_report\u001b[0m\n`;
                server.config.logger.error(header);
              }
            }
          } catch {
            res.statusCode = 400;
            res.end("bad json");
            return;
          }
          res.statusCode = 204;
          res.end();
        });
      });
    },
  };
}
