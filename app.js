const NOTES_PREFIX = "dd:note:";
const VIEW_STATE_KEY = "dd:view-state";

const SORT_FOR = {
  all: "default",
  work: "default",
  dirty: "changes",
  stale: "date",
  clean: "name",
};

const state = {
  allProjects: [],
  archivedProjects: [],
  archiveOpen: false,
  activeStatus: "all",
  activeTech: null,
  searchQuery: "",
  currentSort: "default",
};

const els = {};

function initializeElements() {
  els.timestamp = document.getElementById("timestamp");
  els.reloadBtn = document.getElementById("reloadBtn");
  els.statusFilters = document.getElementById("statusFilters");
  els.techFilters = document.getElementById("techFilters");
  els.searchInput = document.getElementById("searchInput");
  els.resultsCount = document.getElementById("resultsCount");
  els.grid = document.getElementById("grid");
  els.archiveSection = document.getElementById("archiveSection");
  els.archiveToggle = document.getElementById("archiveToggle");
  els.archiveGrid = document.getElementById("archiveGrid");
  els.error = document.getElementById("error");
  els.toast = document.getElementById("toast");
  els.emptyState = document.getElementById("emptyState");
}

function esc(value) {
  if (value === null || value === undefined) return "";
  const div = document.createElement("div");
  div.textContent = String(value);
  return div.innerHTML;
}

function relativeDate(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes}м назад`;
  if (hours < 24) return `${hours}ч назад`;
  if (days < 30) return `${days}д назад`;
  if (days < 365) return `${Math.floor(days / 30)}мес назад`;
  return `${Math.floor(days / 365)}г назад`;
}

function isStale(project) {
  if (!project.last_commit?.date) return false;
  return (Date.now() - new Date(project.last_commit.date).getTime()) / 86400000 > 30;
}

function daysAgo(project) {
  if (!project.last_commit?.date) return 99999;
  return (Date.now() - new Date(project.last_commit.date).getTime()) / 86400000;
}

function statusColor(project) {
  if (project.status === "missing_path") return "problem";
  if (!project.is_git) return "gray";
  if (project.total_changes === 0) return "green";
  if (project.total_changes <= 10) return "yellow";
  return "red";
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toast._timeoutId);
  toast._timeoutId = setTimeout(() => els.toast.classList.remove("show"), 1800);
}

function loadViewState() {
  try {
    const raw = localStorage.getItem(VIEW_STATE_KEY);
    if (!raw) return;
    const persisted = JSON.parse(raw);
    state.activeStatus = persisted.activeStatus || "all";
    state.activeTech = persisted.activeTech || null;
    state.searchQuery = persisted.searchQuery || "";
    state.archiveOpen = Boolean(persisted.archiveOpen);
    state.currentSort = SORT_FOR[state.activeStatus] || "default";
  } catch {
    state.activeStatus = "all";
  }
}

function persistViewState() {
  localStorage.setItem(
    VIEW_STATE_KEY,
    JSON.stringify({
      activeStatus: state.activeStatus,
      activeTech: state.activeTech,
      searchQuery: state.searchQuery,
      archiveOpen: state.archiveOpen,
    }),
  );
}

function getNote(id) {
  const stored = localStorage.getItem(NOTES_PREFIX + id);
  return stored !== null ? stored : null;
}

function saveNote(id, text) {
  if (text.trim()) {
    localStorage.setItem(NOTES_PREFIX + id, text);
  } else {
    localStorage.removeItem(NOTES_PREFIX + id);
  }
}

function resolveNote(project) {
  const stored = getNote(project.id);
  return stored !== null ? stored : project.note || "";
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to manual copy
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand("copy");
  textarea.remove();
  return success;
}

async function handleCopyPath(project) {
  const success = await copyText(project.path);
  toast(success ? `Скопировано: ${project.path}` : "Не удалось скопировать путь");
}

function openRoadmap(project) {
  if (!project.roadmap?.path) {
    toast("Файл roadmap недоступен");
    return;
  }
  window.open(`file://${encodeURI(project.roadmap.path)}`, "_blank", "noopener");
}

async function softReload() {
  els.reloadBtn.disabled = true;
  els.reloadBtn.textContent = "↻ …";
  els.timestamp.textContent = "Обновляю…";

  const data = await refreshData();
  if (data) {
    render(data);
    els.reloadBtn.textContent = "✓ Готово";
    setTimeout(() => {
      els.reloadBtn.textContent = "↻ Обновить";
      els.reloadBtn.disabled = false;
    }, 1200);
  } else {
    els.reloadBtn.textContent = "↻ Обновить";
    els.reloadBtn.disabled = false;
  }
}

async function refreshData() {
  try {
    const response = await fetch("/refresh", {
      method: "POST",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const payload = await response.json();
    if (!payload.ok || !payload.data) throw new Error(payload.error || "Refresh failed");

    els.error.style.display = "none";
    return payload.data;
  } catch {
    els.error.style.display = "block";
    els.error.innerHTML =
      "Не удалось обновить данные через /refresh" +
      "<code>uv run python serve.py --port 8787</code>";
    return null;
  }
}

async function loadData() {
  try {
    const response = await fetch(`./data.json?${Date.now()}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    els.error.style.display = "none";
    return data;
  } catch {
    els.error.style.display = "block";
    els.error.innerHTML =
      "Не удалось загрузить data.json" +
      "<code>uv run python serve.py --port 8787</code>";
    return null;
  }
}

function getSortedIndices() {
  const indices = state.allProjects.map((_, index) => index);
  if (state.currentSort === "changes") {
    return indices.sort(
      (left, right) => state.allProjects[right].total_changes - state.allProjects[left].total_changes,
    );
  }
  if (state.currentSort === "date") {
    return indices.sort((left, right) => daysAgo(state.allProjects[right]) - daysAgo(state.allProjects[left]));
  }
  if (state.currentSort === "name") {
    return indices.sort((left, right) => state.allProjects[left].name.localeCompare(state.allProjects[right].name));
  }
  return indices;
}

function applySortToGrid() {
  const sorted = getSortedIndices();
  sorted.forEach((index) => {
    const card = els.grid.querySelector(`.card[data-idx="${index}"]`);
    if (card) els.grid.appendChild(card);
  });
}

function matchesFilters(project) {
  if (state.activeStatus === "work" && !project.work) return false;
  if (state.activeStatus === "dirty" && project.total_changes === 0) return false;
  if (state.activeStatus === "clean" && (project.total_changes > 0 || !project.is_git)) return false;
  if (state.activeStatus === "stale" && !isStale(project)) return false;
  if (state.activeTech && !project.tech.includes(state.activeTech)) return false;

  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    const note = resolveNote(project).toLowerCase();
    const haystack = `${project.name} ${project.description} ${project.tech.join(" ")} ${note}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }

  return true;
}

function applyFilters() {
  applySortToGrid();

  let visible = 0;
  els.grid.querySelectorAll(".card").forEach((card) => {
    const project = state.allProjects[Number(card.dataset.idx)];
    const show = matchesFilters(project);
    card.classList.toggle("hidden", !show);
    if (show) visible += 1;
  });

  els.resultsCount.textContent =
    visible < state.allProjects.length ? `${visible} / ${state.allProjects.length}` : "";
  els.emptyState.style.display = visible === 0 ? "block" : "none";
  persistViewState();
}

function updateStatusButtons() {
  els.statusFilters.querySelectorAll(".filter-btn").forEach((button) => {
    const isActive = button.dataset.filter === state.activeStatus;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function buildTechFilters() {
  const counts = {};
  state.allProjects.forEach((project) => {
    project.tech.forEach((tech) => {
      counts[tech] = (counts[tech] || 0) + 1;
    });
  });

  if (state.activeTech && !counts[state.activeTech]) {
    state.activeTech = null;
  }

  const topTech = Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([tech]) => tech);

  els.techFilters.innerHTML = "";
  topTech.forEach((tech) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-btn";
    button.textContent = tech;
    button.classList.toggle("active", tech === state.activeTech);
    button.addEventListener("click", () => {
      state.activeTech = state.activeTech === tech ? null : tech;
      buildTechFilters();
      applyFilters();
    });
    els.techFilters.appendChild(button);
  });
}

function parseNoteLines(raw) {
  return (raw || "").split("\n").map((line) => {
    const checkbox = line.match(/^(\s*)(?:[-*]\s+)?\[([ xX]?)\]\s*(.*)/);
    if (checkbox) {
      const stateValue = checkbox[2].toLowerCase();
      return {
        type: "checkbox",
        checked: stateValue === "x",
        label: checkbox[3].trim(),
        indent: checkbox[1].length > 0,
      };
    }

    const bullet = line.match(/^(\s*)[-*]\s+(.*)/);
    if (bullet) return { type: "bullet", label: bullet[2], indent: bullet[1].length > 0 };
    return { type: "text", label: line };
  });
}

function toggleCheckbox(raw, lineIndex) {
  const lines = raw.split("\n");
  lines[lineIndex] = lines[lineIndex].replace(
    /^(\s*(?:[-*]\s+)?\[)([ xX]?)(\]\s*.*)/,
    (_, prefix, stateValue, suffix) => prefix + (stateValue.toLowerCase() === "x" ? " " : "x") + suffix,
  );
  return lines.join("\n");
}

function renderNoteContent(rendered, project) {
  const raw = resolveNote(project);
  if (!raw.trim()) {
    rendered.innerHTML = "";
    rendered.textContent = "добавить заметку…";
    rendered.classList.add("empty");
    return;
  }

  rendered.classList.remove("empty");
  const lines = parseNoteLines(raw);
  const list = document.createElement("ul");
  list.className = "note-list";

  lines.forEach((item, lineIndex) => {
    if (item.type === "text") {
      if (!item.label.trim()) return;
      const listItem = document.createElement("li");
      listItem.className = "note-item";
      const text = document.createElement("span");
      text.className = "note-plain-line";
      text.textContent = item.label;
      listItem.appendChild(text);
      list.appendChild(listItem);
      return;
    }

    const listItem = document.createElement("li");
    listItem.className = "note-item";
    if (item.indent) listItem.classList.add("indent");
    if (item.checked) listItem.classList.add("checked");

    if (item.type === "checkbox") {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.checked;
      checkbox.addEventListener("click", (event) => {
        event.stopPropagation();
        const updated = toggleCheckbox(resolveNote(project), lineIndex);
        saveNote(project.id, updated);
        renderNoteContent(rendered, project);
      });

      const label = document.createElement("span");
      label.className = "note-item-label";
      label.textContent = item.label;
      listItem.appendChild(checkbox);
      listItem.appendChild(label);
    } else {
      const bullet = document.createElement("span");
      bullet.className = "note-item-bullet";
      bullet.textContent = "·";
      const label = document.createElement("span");
      label.className = "note-item-label";
      label.textContent = item.label;
      listItem.appendChild(bullet);
      listItem.appendChild(label);
    }

    list.appendChild(listItem);
  });

  rendered.innerHTML = "";
  rendered.appendChild(list);
}

function buildNoteWidget(project) {
  const wrapper = document.createElement("div");
  wrapper.className = "card-note";

  const rendered = document.createElement("div");
  rendered.className = "note-rendered";
  renderNoteContent(rendered, project);

  rendered.addEventListener("click", (event) => {
    event.stopPropagation();

    const textarea = document.createElement("textarea");
    textarea.className = "note-textarea";
    textarea.value = resolveNote(project);
    textarea.rows = Math.max(3, (textarea.value.match(/\n/g) || []).length + 2);

    const hint = document.createElement("div");
    hint.className = "note-hint";
    hint.textContent = "[ ] todo  [x] done  - пункт  · Enter=сохранить  Shift+Enter=перенос  Esc=отмена";

    wrapper.replaceChild(textarea, rendered);
    wrapper.appendChild(hint);
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    const commit = () => {
      saveNote(project.id, textarea.value);
      if (wrapper.contains(textarea)) wrapper.replaceChild(rendered, textarea);
      if (wrapper.contains(hint)) hint.remove();
      renderNoteContent(rendered, project);
      applyFilters();
    };

    textarea.addEventListener("keydown", (keyEvent) => {
      if (keyEvent.key === "Escape") {
        keyEvent.stopPropagation();
        if (wrapper.contains(textarea)) wrapper.replaceChild(rendered, textarea);
        if (wrapper.contains(hint)) hint.remove();
        renderNoteContent(rendered, project);
      } else if (keyEvent.key === "Enter" && !keyEvent.shiftKey) {
        keyEvent.preventDefault();
        commit();
        toast("Сохранено");
      }
    });

    textarea.addEventListener("blur", () => {
      if (wrapper.contains(textarea)) commit();
    });
    textarea.addEventListener("click", (clickEvent) => clickEvent.stopPropagation());
  });

  wrapper.appendChild(rendered);
  return wrapper;
}

function roadmapIssueLabel(project) {
  switch (project.roadmap_status) {
    case "missing_file":
      return "roadmap: нет файла";
    case "missing_section":
      return "roadmap: нет секции";
    case "unsupported_mode":
      return "roadmap: неизвестный mode";
    case "empty":
      return "roadmap: пусто";
    default:
      return null;
  }
}

function buildAttentionItems(project) {
  const items = [];

  if (project.status === "missing_path") {
    items.push({ label: "Путь не найден", kind: "danger" });
  } else {
    if (!project.is_git) items.push({ label: "Без git", kind: "muted" });
    if (project.is_git && !project.has_upstream) items.push({ label: "Нет upstream", kind: "warn" });
    if (project.ahead > 0) items.push({ label: `↑${project.ahead} локально`, kind: "info" });
    if (project.behind > 0) items.push({ label: `↓${project.behind} позади`, kind: "danger" });
    if (project.stash_count > 0) items.push({ label: `📦 ${project.stash_count} stash`, kind: "warn" });
    if (isStale(project)) items.push({ label: "давно без коммита", kind: "warn" });
  }

  const roadmapLabel = roadmapIssueLabel(project);
  if (roadmapLabel) items.push({ label: roadmapLabel, kind: "danger" });
  if (project.roadmap?.pending?.length) {
    items.push({ label: `roadmap: ${project.roadmap.pending.length} задач`, kind: "muted" });
  }

  return items;
}

function buildAttentionHtml(project) {
  const items = buildAttentionItems(project);
  if (!items.length) return "";
  return items
    .map((item) => `<span class="status-pill ${item.kind}">${esc(item.label)}</span>`)
    .join("");
}

function buildStatsHtml(project) {
  if (project.status === "missing_path") {
    return `
      <div class="problem-line">Путь проекта не найден</div>
      <div class="stat-commit"><code>${esc(project.path)}</code></div>
    `;
  }

  if (!project.is_git) {
    return '<div class="no-git">Каталог существует, но это не git-репозиторий</div>';
  }

  let html = "";
  if (project.total_changes === 0) {
    html += '<div class="stat-changes clean">Рабочее дерево чистое</div>';
  } else {
    const parts = [];
    if (project.modified > 0) parts.push(`${project.modified} изменено`);
    if (project.untracked > 0) parts.push(`${project.untracked} новое`);
    if (project.staged > 0) parts.push(`${project.staged} в индексе`);
    const tone = project.total_changes > 10 ? "alert" : "warn";
    html += `<div class="stat-changes ${tone}">${project.total_changes} изменений (${parts.join(", ")})</div>`;
  }

  if (project.last_commit?.hash) {
    html += `
      <div class="stat-commit">
        <span class="hash">${esc(project.last_commit.hash)}</span> ${esc(project.last_commit.message)}
        <br>${relativeDate(project.last_commit.date)}
      </div>
    `;
  }

  if (project.unpushed_stats) {
    const stats = project.unpushed_stats;
    html += `
      <div class="unpushed-stats">
        ${project.ahead} локал. коммит${project.ahead > 1 ? "ов" : ""}:
        <span class="ins">+${stats.insertions}</span> <span class="del">−${stats.deletions}</span>
      </div>
    `;
  }

  return html;
}

function buildRoadmapHtml(project) {
  if (!project.roadmap) return "";
  const roadmap = project.roadmap;
  const percent = roadmap.total > 0 ? Math.round((roadmap.done / roadmap.total) * 100) : 0;
  const pendingHtml = roadmap.pending.length
    ? `<ul class="pending-items">${roadmap.pending
        .map((item) => `<li class="pending-item">${esc(item)}</li>`)
        .join("")}</ul>`
    : "";

  return `
    <div class="roadmap">
      <div class="roadmap-header">
        <span class="roadmap-label">${esc(roadmap.section)}</span>
        <span class="roadmap-count">${roadmap.done}/${roadmap.total}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${percent}%"></div></div>
      ${pendingHtml}
    </div>
  `;
}

function buildExpandHtml(project) {
  let html = "";

  if (project.recent_commits?.length > 1) {
    const lines = project.recent_commits
      .slice(1)
      .map(
        (commit) =>
          `<div class="commit-line"><span class="hash">${esc(commit.hash)}</span> ${esc(commit.message)}</div>`,
      )
      .join("");
    html += `<div class="expand-label">Недавние коммиты</div>${lines}`;
  }

  if (project.other_branches?.length) {
    const branches = project.other_branches
      .map((branch) => `<span class="branch-chip">${esc(branch)}</span>`)
      .join("");
    html += `
      <div class="expand-label" style="margin-top:8px">Другие ветки</div>
      <div class="branch-list">${branches}</div>
    `;
  }

  return html ? `<div class="expand-section">${html}</div>` : "";
}

function buildActions(project) {
  const wrapper = document.createElement("div");
  wrapper.className = "card-actions";

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "card-action";
  copyButton.textContent = "Скопировать путь";
  copyButton.addEventListener("click", async (event) => {
    event.stopPropagation();
    await handleCopyPath(project);
  });
  wrapper.appendChild(copyButton);

  if (project.roadmap?.path) {
    const roadmapButton = document.createElement("button");
    roadmapButton.type = "button";
    roadmapButton.className = "card-action";
    roadmapButton.textContent = "Открыть roadmap";
    roadmapButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openRoadmap(project);
    });
    wrapper.appendChild(roadmapButton);
  }

  return wrapper;
}

function bindCardInteractions(card) {
  card.addEventListener("click", () => {
    const expanded = !card.classList.contains("expanded");
    card.classList.toggle("expanded", expanded);
    card.setAttribute("aria-expanded", String(expanded));
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest("button, textarea, input")) return;
    event.preventDefault();
    card.click();
  });
}

function buildCard(project, index, archived = false) {
  const card = document.createElement("div");
  card.className = `card ${statusColor(project)}`;
  if (project.work) card.classList.add("work");
  if (archived) card.classList.add("archived");
  card.dataset.idx = String(index);
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-expanded", "false");

  const workBadge = project.work ? '<span class="work-badge">работа</span>' : "";
  const archivedBadge = archived ? '<span class="archived-badge">архив</span>' : "";

  let metaHtml = "";
  if (project.is_git && project.branch) {
    let pills = "";
    if (project.has_upstream) {
      if (project.ahead > 0) pills += `<span class="meta-pill ahead-pill">↑${project.ahead}</span>`;
      if (project.behind > 0) pills += `<span class="meta-pill behind-pill">↓${project.behind}</span>`;
    }
    if (project.other_branches?.length) {
      pills += `<span class="meta-pill branch-pill">⎇ ${project.other_branches.length}</span>`;
    }
    if (project.stash_count > 0) {
      pills += `<span class="meta-pill status-pill warn">📦 ${project.stash_count}</span>`;
    }
    metaHtml = `
      <div class="card-meta">
        <span class="branch-name">${esc(project.branch)}</span>
        ${pills}
      </div>
    `;
  }

  const techTags = (project.tech || [])
    .map((tech) => `<span class="tech-tag" data-tech="${esc(tech)}">${esc(tech)}</span>`)
    .join("");

  const attentionHtml = buildAttentionHtml(project);

  card.innerHTML = `
    <div class="card-header">
      <div class="card-title">
        <span class="card-name">${esc(project.name)}</span>
        ${workBadge}
        ${archivedBadge}
      </div>
      ${metaHtml}
    </div>
    <div class="card-desc">${esc(project.description)}</div>
    <div class="card-tech">${techTags}</div>
    <div class="attention-row">${attentionHtml}</div>
    <div>${buildStatsHtml(project)}</div>
    ${buildRoadmapHtml(project)}
    ${buildExpandHtml(project)}
  `;

  card.appendChild(buildActions(project));
  card.appendChild(buildNoteWidget(project));

  card.querySelectorAll(".tech-tag").forEach((tag) => {
    tag.addEventListener("click", (event) => {
      event.stopPropagation();
      const tech = tag.dataset.tech;
      state.activeTech = state.activeTech === tech ? null : tech;
      buildTechFilters();
      applyFilters();
    });
  });

  bindCardInteractions(card);
  return card;
}

function renderArchiveSection() {
  if (!state.archivedProjects.length) {
    els.archiveSection.style.display = "none";
    return;
  }

  els.archiveSection.style.display = "block";
  els.archiveGrid.innerHTML = "";
  state.archivedProjects.forEach((project, index) => {
    els.archiveGrid.appendChild(buildCard(project, index, true));
  });
  els.archiveGrid.style.display = state.archiveOpen ? "grid" : "none";
  els.archiveToggle.textContent = state.archiveOpen
    ? `▾ Архив (${state.archivedProjects.length})`
    : `▸ Архив (${state.archivedProjects.length})`;
}

function render(data) {
  state.allProjects = data.projects.filter((project) => !project.archived);
  state.archivedProjects = data.projects.filter((project) => project.archived);

  els.timestamp.textContent = `Обновлено ${relativeDate(data.generated_at)}`;
  els.grid.innerHTML = "";
  state.allProjects.forEach((project, index) => els.grid.appendChild(buildCard(project, index)));

  buildTechFilters();
  updateStatusButtons();
  els.searchInput.value = state.searchQuery;
  renderArchiveSection();
  applyFilters();
}

function toggleArchive() {
  state.archiveOpen = !state.archiveOpen;
  renderArchiveSection();
  persistViewState();
}

function handleGlobalKeydown(event) {
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;

  if (event.key === "r") {
    event.preventDefault();
    softReload();
  }

  if (event.key === "/") {
    event.preventDefault();
    els.searchInput.focus();
  }

  if (event.key === "Escape") {
    state.activeStatus = "all";
    state.activeTech = null;
    state.searchQuery = "";
    state.currentSort = "default";
    updateStatusButtons();
    buildTechFilters();
    els.searchInput.value = "";
    applyFilters();
  }
}

function bindStaticEvents() {
  els.reloadBtn.addEventListener("click", () => {
    softReload();
  });

  els.statusFilters.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeStatus = button.dataset.filter;
      state.currentSort = SORT_FOR[state.activeStatus] || "default";
      updateStatusButtons();
      applyFilters();
    });
  });

  els.searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value.trim();
    applyFilters();
  });

  els.archiveToggle.addEventListener("click", () => toggleArchive());
  document.addEventListener("keydown", handleGlobalKeydown);
}

async function initializeApp() {
  initializeElements();
  loadViewState();
  bindStaticEvents();
  const data = await loadData();
  if (data) render(data);
}

initializeApp();
