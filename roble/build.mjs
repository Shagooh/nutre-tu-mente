import { build, context } from "esbuild";
import { mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL(".", import.meta.url));
const out = path.join(root, "..", "dist", "roble");
await mkdir(out, { recursive: true });
await copyFile(path.join(root, "index.html"), path.join(out, "index.html"));
const options = {
  entryPoints: [path.join(root, "main.tsx")],
  bundle: true,
  outfile: path.join(out, "app.js"),
  define: { "process.env.NODE_ENV": '"production"' },
  minify: true,
  logLevel: "info",
};
if (process.argv.includes("--serve")) {
  const ctx = await context(options);
  await ctx.watch();
  const server = await ctx.serve({
    servedir: out,
    host: "127.0.0.1",
    port: 4173,
  });
  console.log("Roble emocional · http://127.0.0.1:" + server.port);
} else await build(options);
