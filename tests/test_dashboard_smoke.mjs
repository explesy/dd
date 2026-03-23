import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const FIXTURE_FILES = [
  "serve.py",
  "refresh.py",
  "index.html",
  "app.js",
  "styles.css",
  "favicon.svg",
  "favicon.png",
  "projects.example.json",
  "notes.example.json",
];

async function waitForServer(baseUrl) {
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

function extractFunctionSource(source, name) {
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
        return source.slice(start, index + 1);
      }
    }
  }

  throw new Error(`Could not extract ${name}`);
}

async function createWorkspace({ projects = "[]\n", notes = "{}\n", includeProjects = true } = {}) {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "dd-smoke-"));
  for (const file of FIXTURE_FILES) {
    await cp(path.join(root, file), path.join(workspace, file));
  }
  if (includeProjects) {
    await writeFile(path.join(workspace, "projects.json"), projects);
  }
  await writeFile(path.join(workspace, "notes.json"), notes);
  return workspace;
}

async function getFreePort() {
  return await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Could not determine free port"));
        return;
      }
      const { port } = address;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
    server.on("error", reject);
  });
}

async function startServer(workspace, env = {}) {
  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = spawn("python3", ["serve.py", "--port", String(port), "--bind", "127.0.0.1"], {
    cwd: workspace,
    env: { ...process.env, ...env },
    stdio: "ignore",
  });
  await waitForServer(baseUrl);
  return { baseUrl, server };
}

async function stopServer(server) {
  if (!server) return;
  server.kill("SIGINT");
  await once(server, "exit");
}

test("page serves split assets and normalized data contract with empty config", async () => {
  const workspace = await createWorkspace();
  let server;
  try {
    const started = await startServer(workspace);
    server = started.server;

    const refreshResponse = await fetch(`${started.baseUrl}/refresh`, { method: "POST" });
    assert.equal(refreshResponse.status, 200);
    const refreshPayload = await refreshResponse.json();
    assert.equal(refreshPayload.ok, true);
    assert.ok(Array.isArray(refreshPayload.data.projects));
    assert.equal(refreshPayload.data.projects.length, 0);

    const [htmlResponse, cssResponse, jsResponse, dataResponse, svgFaviconResponse, pngFaviconResponse] =
      await Promise.all([
        fetch(`${started.baseUrl}/`),
        fetch(`${started.baseUrl}/styles.css`),
        fetch(`${started.baseUrl}/app.js`),
        fetch(`${started.baseUrl}/data.json`),
        fetch(`${started.baseUrl}/favicon.svg`),
        fetch(`${started.baseUrl}/favicon.png`),
      ]);

    assert.equal(htmlResponse.status, 200);
    assert.equal(cssResponse.status, 200);
    assert.equal(jsResponse.status, 200);
    assert.equal(dataResponse.status, 200);
    assert.equal(svgFaviconResponse.status, 200);
    assert.equal(pngFaviconResponse.status, 200);

    const html = await htmlResponse.text();
    assert.match(html, /styles\.css/);
    assert.match(html, /app\.js/);
    assert.match(html, /favicon\.svg/);
    assert.match(html, /favicon\.png/);
    assert.doesNotMatch(html, /attentionSection/);
    assert.doesNotMatch(html, /attentionGrid/);
    assert.match(html, /data-locale="en"/);
    assert.match(html, /data-locale="ru"/);
    assert.doesNotMatch(html, /All projects/);
    assert.doesNotMatch(html, /Full inventory with filters and search\./);

    const data = await dataResponse.json();
    assert.ok(Array.isArray(data.projects));
    assert.equal(data.projects.length, 0);
  } finally {
    await stopServer(server);
    await rm(workspace, { recursive: true, force: true });
  }
});

test("server surfaces actionable setup errors when projects.json is missing", async () => {
  const workspace = await createWorkspace({ includeProjects: false });
  let server;
  try {
    const started = await startServer(workspace);
    server = started.server;

    const [rootResponse, dataResponse, refreshResponse] = await Promise.all([
      fetch(`${started.baseUrl}/`),
      fetch(`${started.baseUrl}/data.json?bootstrap`),
      fetch(`${started.baseUrl}/refresh`, { method: "POST" }),
    ]);

    assert.equal(rootResponse.status, 200);
    assert.equal(dataResponse.status, 500);
    assert.equal(refreshResponse.status, 500);

    const dataPayload = await dataResponse.json();
    const refreshPayload = await refreshResponse.json();

    assert.equal(dataPayload.ok, false);
    assert.equal(refreshPayload.ok, false);
    assert.match(dataPayload.error, /projects\.example\.json/);
    assert.match(refreshPayload.error, /projects\.example\.json/);
  } finally {
    await stopServer(server);
    await rm(workspace, { recursive: true, force: true });
  }
});

test("app.js keeps global event binding out of render and preserves locale helpers", async () => {
  const source = await readFile(path.join(root, "app.js"), "utf8");
  const renderBody = extractFunctionBody(source, "render");
  const bindBody = extractFunctionBody(source, "bindStaticEvents");

  assert.ok(!renderBody.includes("addEventListener"), "render() should not register listeners");
  assert.ok(bindBody.includes("addEventListener"), "bindStaticEvents() should register listeners");
  assert.ok(!source.includes("project.exists !== false"), "missing projects should not be filtered out");
  assert.ok(source.includes('fetch("/refresh"'), "soft reload should call the refresh endpoint");
  assert.ok(source.includes('fetch("/open-roadmap"'), "roadmap opening should go through the local server");
  assert.ok(source.includes('runDesktopAction("/open-folder"'), "folder opening should go through the local server");
  assert.ok(source.includes('const LOCALE_KEY = "dd:locale";'));
  assert.ok(source.includes('const SHOW_GIT_INFO_KEY = "dd:show-git-info";'));
  assert.ok(source.includes('const PROJECT_OVERRIDE_PREFIX = "dd:project:";'));
  assert.ok(source.includes('localStorage.setItem(LOCALE_KEY, state.locale);'));
  assert.ok(source.includes('localStorage.setItem(SHOW_GIT_INFO_KEY, String(Boolean(state.showGitInfo)));'));
  assert.ok(source.includes("function applyProjectOverrides(project)"));
  assert.ok(source.includes("function normalizeNoteItems(raw)"));
  assert.ok(source.includes("function normalizeNoteValue(raw)"));
  assert.ok(source.includes("function buildCaretSummary("));
  assert.ok(source.includes("function renderRoadmapContent(wrapper, project)"));
  assert.ok(source.includes("function buildRoadmapSection(project)"));
  assert.ok(source.includes("function buildSearchHaystack(project)"));
  assert.ok(source.includes("function getAttentionScore(project)"));
  assert.ok(source.includes('archived: Object.hasOwn(overrides, "archived")'));
  assert.ok(source.includes("project.project_state"));
  assert.ok(source.includes("project.roadmap?.pending?.join"));
  assert.ok(source.includes("if (!state.showGitInfo) return \"\";"));
  assert.ok(source.includes("state.showGitInfo ? buildAttentionHtml(project) : \"\""));
  assert.ok(source.includes("roadmapOpen: {},"));
  assert.ok(source.includes("state.roadmapOpen = {};"));
  assert.ok(!source.includes("localStorage.setItem(ROADMAP"), "roadmap collapse state should not persist");

  const helperFactory = new Function(
    `const SUPPORTED_LOCALES = ["en", "ru"];
${extractFunctionSource(source, "detectBrowserLocale")}
${extractFunctionSource(source, "resolveLocalePreference")}
return { detectBrowserLocale, resolveLocalePreference };`,
  );
  const { detectBrowserLocale, resolveLocalePreference } = helperFactory();

  assert.equal(detectBrowserLocale("ru-RU"), "ru");
  assert.equal(detectBrowserLocale("en-US"), "en");
  assert.equal(resolveLocalePreference("ru", "en-US"), "ru");
  assert.equal(resolveLocalePreference(null, "ru-RU"), "ru");
  assert.equal(resolveLocalePreference("de", "en-US"), "en");

  const noteHelperFactory = new Function(
    `${extractFunctionSource(source, "normalizeNoteItems")}
${extractFunctionSource(source, "serializeNoteItems")}
${extractFunctionSource(source, "normalizeNoteValue")}
return { normalizeNoteItems, serializeNoteItems, normalizeNoteValue };`,
  );
  const { normalizeNoteItems, serializeNoteItems, normalizeNoteValue } = noteHelperFactory();

  assert.deepEqual(normalizeNoteItems("plain line\n- bullet\n[x] done"), [
    { checked: false, label: "plain line" },
    { checked: false, label: "bullet" },
    { checked: true, label: "done" },
  ]);
  assert.equal(
    serializeNoteItems([
      { checked: true, label: "done" },
      { checked: false, label: "todo" },
    ]),
    "[ ] todo\n[x] done",
  );
  assert.equal(normalizeNoteValue("alpha\n[x] beta\n- gamma"), "[ ] alpha\n[ ] gamma\n[x] beta");

  assert.ok(source.includes('headerSubtitle: "Dashboard of Dashboards"'));
  assert.ok(source.includes('headerSubtitle: "Дашборд дашбордов"'));
  assert.ok(source.includes('loadDataError: ({ message }) => `Could not load data.json: ${message}`'));
  assert.ok(source.includes('loadDataError: ({ message }) => `Не удалось загрузить data.json: ${message}`'));
});

test("server opens roadmap paths through a local endpoint", async () => {
  const workspace = await createWorkspace({
    projects: JSON.stringify(
      [
        {
          id: "roadmap-test",
          description: "Roadmap opener",
          tech: ["Docs"],
          path: ".",
          roadmap: { file: "ROADMAP.md", section: null, mode: "next_steps" },
        },
      ],
      null,
      2,
    ),
  });

  const openerDir = await mkdtemp(path.join(os.tmpdir(), "dd-opener-"));
  const openerLog = path.join(openerDir, "opener.log");
  const openerScript = `#!/bin/sh\nprintf '%s\\n' \"$1\" >> \"${openerLog}\"\n`;
  await writeFile(path.join(openerDir, "open"), openerScript, { mode: 0o755 });
  await writeFile(path.join(openerDir, "xdg-open"), openerScript, { mode: 0o755 });
  await writeFile(path.join(workspace, "ROADMAP.md"), "- item\n");

  let server;
  try {
    const started = await startServer(workspace, {
      PATH: `${openerDir}${path.delimiter}${process.env.PATH || ""}`,
    });
    server = started.server;

    const openResponse = await fetch(`${started.baseUrl}/open-roadmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: path.join(workspace, "ROADMAP.md") }),
    });

    assert.equal(openResponse.status, 200);
    const payload = await openResponse.json();
    assert.equal(payload.ok, true);

    let loggedPath = "";
    for (let attempt = 0; attempt < 60; attempt += 1) {
      try {
        loggedPath = (await readFile(openerLog, "utf8")).trim();
        if (loggedPath) break;
      } catch {
        // opener can complete shortly after the HTTP response
      }
      await delay(50);
    }

    assert.equal(loggedPath, path.join(workspace, "ROADMAP.md"));
  } finally {
    await stopServer(server);
    await rm(workspace, { recursive: true, force: true });
    await rm(openerDir, { recursive: true, force: true });
  }
});

test("server runs local desktop actions through endpoints", async () => {
  const workspace = await createWorkspace({
    projects: JSON.stringify(
      [
        {
          id: "desktop-actions",
          description: "Desktop actions",
          tech: ["Docs"],
          path: ".",
        },
      ],
      null,
      2,
    ),
  });

  const helperDir = await mkdtemp(path.join(os.tmpdir(), "dd-desktop-actions-"));
  const helperLog = path.join(helperDir, "helper.log");
  const helperScript = `#!/bin/sh\nprintf '%s %s\\n' \"$0\" \"$*\" >> \"${helperLog}\"\n`;
  await writeFile(path.join(helperDir, "open"), helperScript, { mode: 0o755 });
  await writeFile(path.join(helperDir, "xdg-open"), helperScript, { mode: 0o755 });
  await writeFile(path.join(helperDir, "code"), helperScript, { mode: 0o755 });

  let server;
  try {
    const started = await startServer(workspace, {
      PATH: `${helperDir}${path.delimiter}${process.env.PATH || ""}`,
      EDITOR: "",
      VISUAL: "",
    });
    server = started.server;

    for (const endpoint of ["/open-folder"]) {
      const response = await fetch(`${started.baseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: workspace }),
      });
      assert.equal(response.status, 200, endpoint);
      const payload = await response.json();
      assert.equal(payload.ok, true, endpoint);
    }

    let logText = "";
    for (let attempt = 0; attempt < 60; attempt += 1) {
      try {
        logText = (await readFile(helperLog, "utf8")).trim();
        if (logText) break;
      } catch {
        // helper can finish shortly after the HTTP response
      }
      await delay(50);
    }

    assert.match(logText, /open|xdg-open/);
    assert.match(logText, new RegExp(workspace.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  } finally {
    await stopServer(server);
    await rm(workspace, { recursive: true, force: true });
    await rm(helperDir, { recursive: true, force: true });
  }
});
