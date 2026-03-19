import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test, { after, before } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const port = 8791;
const baseUrl = `http://127.0.0.1:${port}`;

let server;

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // retry
    }
    await delay(100);
  }
  throw new Error("Timed out waiting for smoke server");
}

function extractFunctionBody(source, name) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `Function ${name} should exist`);

  let index = source.indexOf("{", start);
  let depth = 0;
  for (; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(source.indexOf("{", start) + 1, index);
      }
    }
  }

  throw new Error(`Could not extract ${name}`);
}

before(async () => {
  server = spawn("python3", ["serve.py", "--port", String(port), "--bind", "127.0.0.1"], {
    cwd: root,
    stdio: "ignore",
  });
  await waitForServer();
});

after(async () => {
  if (!server) return;
  server.kill("SIGINT");
  await once(server, "exit");
});

test("page serves split assets and normalized data contract", async () => {
  const refreshResponse = await fetch(`${baseUrl}/refresh`, { method: "POST" });
  assert.equal(refreshResponse.status, 200);
  const refreshPayload = await refreshResponse.json();
  assert.equal(refreshPayload.ok, true);
  assert.ok(Array.isArray(refreshPayload.data.projects));

  const [htmlResponse, cssResponse, jsResponse, dataResponse] = await Promise.all([
    fetch(`${baseUrl}/`),
    fetch(`${baseUrl}/styles.css`),
    fetch(`${baseUrl}/app.js`),
    fetch(`${baseUrl}/data.json`),
  ]);

  assert.equal(htmlResponse.status, 200);
  assert.equal(cssResponse.status, 200);
  assert.equal(jsResponse.status, 200);
  assert.equal(dataResponse.status, 200);

  const html = await htmlResponse.text();
  assert.match(html, /styles\.css/);
  assert.match(html, /app\.js/);

  const data = await dataResponse.json();
  assert.ok(Array.isArray(data.projects));
  assert.ok(data.projects.length > 0);

  for (const project of data.projects) {
    for (const key of [
      "work",
      "archived",
      "exists",
      "status",
      "error",
      "roadmap_status",
      "roadmap_error",
    ]) {
      assert.ok(Object.hasOwn(project, key), `project should include ${key}`);
    }
  }
});

test("app.js keeps global event binding out of render", async () => {
  const source = await readFile(path.join(root, "app.js"), "utf8");
  const renderBody = extractFunctionBody(source, "render");
  const bindBody = extractFunctionBody(source, "bindStaticEvents");

  assert.ok(!renderBody.includes("addEventListener"), "render() should not register listeners");
  assert.ok(bindBody.includes("addEventListener"), "bindStaticEvents() should register listeners");
  assert.ok(!source.includes("project.exists !== false"), "missing projects should not be filtered out");
  assert.ok(source.includes('fetch("/refresh"'), "soft reload should call the refresh endpoint");
});
