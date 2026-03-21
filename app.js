const NOTES_PREFIX = "dd:note:";
const VIEW_STATE_KEY = "dd:view-state";
const LOCALE_KEY = "dd:locale";

const SUPPORTED_LOCALES = ["en", "ru"];

const SORT_FOR = {
  all: "default",
  work: "default",
  dirty: "changes",
  stale: "date",
  clean: "name",
};

const TRANSLATIONS = {
  en: {
    documentTitle: "DD Project Dashboard",
    headerTitle: "DD",
    headerSubtitle: "Dashboard of Dashboards",
    languageSwitcher: "Language switcher",
    reload: "Refresh",
    reloading: "Refreshing…",
    reloadDone: "Done",
    updatingTimestamp: "Refreshing…",
    updatedAt: ({ value }) => `Updated ${value}`,
    filters: {
      all: "All",
      work: "Work",
      dirty: "Dirty",
      stale: "Stale",
      clean: "Clean",
    },
    searchPlaceholder: "Search by name, tech, notes…",
    searchAriaLabel: "Search projects",
    emptyState: "No projects match the current filters.",
    archiveClosed: ({ count }) => `▸ Archive (${count})`,
    archiveOpen: ({ count }) => `▾ Archive (${count})`,
    noScript: "This dashboard requires JavaScript.",
    notesSectionLabel: "Notes",
    notePlaceholder: "add a note…",
    noteHint: "[ ] todo  [x] done  - bullet  · Enter=save  Shift+Enter=new line  Esc=cancel",
    noteSaved: "Saved",
    copySuccess: ({ path }) => `Copied: ${path}`,
    copyFailure: "Could not copy path",
    roadmapUnavailable: "Roadmap file is unavailable",
    roadmapOpenFailure: ({ message }) => `Could not open roadmap: ${message}`,
    copyPath: "Copy path",
    openRoadmap: "Open roadmap",
    workBadge: "work",
    archivedBadge: "archived",
    pinnedBadge: "pinned",
    states: {
      active: "active",
      paused: "paused",
      blocked: "blocked",
      waiting: "waiting",
      maintenance: "maintenance",
    },
    types: {
      client: "client",
      job: "job",
      personal: "personal",
      infra: "infra",
      experiment: "experiment",
      work: "work",
    },
    recentCommits: "Recent commits",
    otherBranches: "Other branches",
    pathNotFound: "Path not found",
    noGitShort: "No git",
    noUpstream: "No upstream",
    aheadLocal: ({ count }) => `↑${count} local`,
    behindRemote: ({ count }) => `↓${count} behind`,
    stashCount: ({ count }) => `📦 ${count} stash`,
    staleProject: "stale",
    roadmapMissingFile: "roadmap: missing file",
    roadmapMissingSection: "roadmap: missing section",
    roadmapUnsupportedMode: "roadmap: unsupported mode",
    roadmapEmpty: "roadmap: empty",
    roadmapPendingCount: ({ count }) => `roadmap: ${count} pending`,
    roadmapMore: ({ count }) => `+${count} more`,
    nextActionLabel: "Next",
    noNextAction: "No next action set",
    primaryBlocked: "Blocked",
    primaryWaiting: "Waiting",
    primaryPaused: "Paused",
    primaryMaintenance: "Maintenance",
    primaryBehind: ({ count }) => `${count} commit${count === 1 ? "" : "s"} behind`,
    primaryPending: ({ count }) => `${count} roadmap task${count === 1 ? "" : "s"} pending`,
    primaryChanges: ({ count }) => `${count} local change${count === 1 ? "" : "s"}`,
    primaryStale: ({ count }) => `No commits for ${count}d`,
    primaryNoUpstream: "Branch has no upstream",
    primaryHealthy: "Healthy",
    missingPathLine: "Project path not found",
    noGitLine: "Directory exists but is not a git repository",
    workingTreeClean: "Working tree is clean",
    modifiedCount: ({ count }) => `${count} modified`,
    untrackedCount: ({ count }) => `${count} untracked`,
    stagedCount: ({ count }) => `${count} staged`,
    changesSummary: ({ count, parts }) => `${count} changes (${parts})`,
    localCommitDiff: ({ count, insertions, deletions }) =>
      `${count} local commit${count === 1 ? "" : "s"}: +${insertions} −${deletions}`,
    serverHintCommand: "cp projects.example.json projects.json && uv run python serve.py --port 8787",
    loadDataError: ({ message }) => `Could not load data.json: ${message}`,
    refreshDataError: ({ message }) => `Could not refresh data via /refresh: ${message}`,
    refreshUiError: ({ message }) => `Could not refresh the interface: ${message}`,
    justNow: "just now",
    minutesAgo: ({ count }) => `${count}m ago`,
    hoursAgo: ({ count }) => `${count}h ago`,
    daysAgo: ({ count }) => `${count}d ago`,
    monthsAgo: ({ count }) => `${count}mo ago`,
    yearsAgo: ({ count }) => `${count}y ago`,
  },
  ru: {
    documentTitle: "DD Project Dashboard",
    headerTitle: "DD",
    headerSubtitle: "Дашборд дашбордов",
    languageSwitcher: "Переключатель языка",
    reload: "Обновить",
    reloading: "Обновляю…",
    reloadDone: "Готово",
    updatingTimestamp: "Обновляю…",
    updatedAt: ({ value }) => `Обновлено ${value}`,
    filters: {
      all: "Все",
      work: "Работа",
      dirty: "Грязные",
      stale: "Старые",
      clean: "Чистые",
    },
    searchPlaceholder: "Поиск по имени, стеку, заметкам…",
    searchAriaLabel: "Поиск проектов",
    emptyState: "Нет проектов под текущими фильтрами.",
    archiveClosed: ({ count }) => `▸ Архив (${count})`,
    archiveOpen: ({ count }) => `▾ Архив (${count})`,
    noScript: "Для дашборда нужен JavaScript.",
    notesSectionLabel: "Заметки",
    notePlaceholder: "добавить заметку…",
    noteHint: "[ ] todo  [x] done  - пункт  · Enter=сохранить  Shift+Enter=перенос  Esc=отмена",
    noteSaved: "Сохранено",
    copySuccess: ({ path }) => `Скопировано: ${path}`,
    copyFailure: "Не удалось скопировать путь",
    roadmapUnavailable: "Файл roadmap недоступен",
    roadmapOpenFailure: ({ message }) => `Не удалось открыть roadmap: ${message}`,
    copyPath: "Скопировать путь",
    openRoadmap: "Открыть roadmap",
    workBadge: "работа",
    archivedBadge: "архив",
    pinnedBadge: "пин",
    states: {
      active: "активный",
      paused: "пауза",
      blocked: "блокер",
      waiting: "ожидание",
      maintenance: "поддержка",
    },
    types: {
      client: "клиент",
      job: "работа",
      personal: "личный",
      infra: "инфра",
      experiment: "эксперимент",
      work: "работа",
    },
    recentCommits: "Недавние коммиты",
    otherBranches: "Другие ветки",
    pathNotFound: "Путь не найден",
    noGitShort: "Без git",
    noUpstream: "Нет upstream",
    aheadLocal: ({ count }) => `↑${count} локально`,
    behindRemote: ({ count }) => `↓${count} позади`,
    stashCount: ({ count }) => `📦 ${count} stash`,
    staleProject: "давно без коммита",
    roadmapMissingFile: "roadmap: нет файла",
    roadmapMissingSection: "roadmap: нет секции",
    roadmapUnsupportedMode: "roadmap: неизвестный mode",
    roadmapEmpty: "roadmap: пусто",
    roadmapPendingCount: ({ count }) => `roadmap: ${count} задач`,
    roadmapMore: ({ count }) => `+${count} еще`,
    nextActionLabel: "Следующее",
    noNextAction: "Следующее действие не задано",
    primaryBlocked: "Блокер",
    primaryWaiting: "Ожидание",
    primaryPaused: "На паузе",
    primaryMaintenance: "Поддержка",
    primaryBehind: ({ count }) => `Позади на ${count} коммит${count > 1 ? "а" : ""}`,
    primaryPending: ({ count }) => `В roadmap ${count} задач`,
    primaryChanges: ({ count }) => `${count} локальных изменений`,
    primaryStale: ({ count }) => `Без коммитов ${count}д`,
    primaryNoUpstream: "У ветки нет upstream",
    primaryHealthy: "Нормально",
    missingPathLine: "Путь проекта не найден",
    noGitLine: "Каталог существует, но это не git-репозиторий",
    workingTreeClean: "Рабочее дерево чистое",
    modifiedCount: ({ count }) => `${count} изменено`,
    untrackedCount: ({ count }) => `${count} новое`,
    stagedCount: ({ count }) => `${count} в индексе`,
    changesSummary: ({ count, parts }) => `${count} изменений (${parts})`,
    localCommitDiff: ({ count, insertions, deletions }) =>
      `${count} локал. коммит${count > 1 ? "ов" : ""}: +${insertions} −${deletions}`,
    serverHintCommand: "cp projects.example.json projects.json && uv run python serve.py --port 8787",
    loadDataError: ({ message }) => `Не удалось загрузить data.json: ${message}`,
    refreshDataError: ({ message }) => `Не удалось обновить данные через /refresh: ${message}`,
    refreshUiError: ({ message }) => `Не удалось обновить интерфейс: ${message}`,
    justNow: "только что",
    minutesAgo: ({ count }) => `${count}м назад`,
    hoursAgo: ({ count }) => `${count}ч назад`,
    daysAgo: ({ count }) => `${count}д назад`,
    monthsAgo: ({ count }) => `${count}мес назад`,
    yearsAgo: ({ count }) => `${count}г назад`,
  },
};

const state = {
  allProjects: [],
  archivedProjects: [],
  archiveOpen: false,
  activeStatus: "all",
  activeTech: null,
  searchQuery: "",
  currentSort: "default",
  locale: "en",
  latestData: null,
  generatedAt: null,
  reloadState: "idle",
};

const els = {};

function detectBrowserLocale(browserLanguage) {
  return String(browserLanguage || "").toLowerCase().startsWith("ru") ? "ru" : "en";
}

function resolveLocalePreference(storedLocale, browserLanguage) {
  return SUPPORTED_LOCALES.includes(storedLocale) ? storedLocale : detectBrowserLocale(browserLanguage);
}

function initializeElements() {
  els.headerTitle = document.getElementById("headerTitle");
  els.headerSubtitle = document.getElementById("headerSubtitle");
  els.localeToggle = document.getElementById("localeToggle");
  els.localeButtons = Array.from(document.querySelectorAll("#localeToggle .locale-btn"));
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
  els.noScript = document.getElementById("noScript");
}

function esc(value) {
  if (value === null || value === undefined) return "";
  const div = document.createElement("div");
  div.textContent = String(value);
  return div.innerHTML;
}

function t(key, params = {}) {
  const dict = TRANSLATIONS[state.locale] || TRANSLATIONS.en;
  const value = dict[key] ?? TRANSLATIONS.en[key];
  return typeof value === "function" ? value(params) : value;
}

function relativeDate(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return t("justNow");
  if (minutes < 60) return t("minutesAgo", { count: minutes });
  if (hours < 24) return t("hoursAgo", { count: hours });
  if (days < 30) return t("daysAgo", { count: days });
  if (days < 365) return t("monthsAgo", { count: Math.floor(days / 30) });
  return t("yearsAgo", { count: Math.floor(days / 365) });
}

function isStale(project) {
  if (!project.last_commit?.date) return false;
  const threshold = project.stale_days ?? 30;
  return (Date.now() - new Date(project.last_commit.date).getTime()) / 86400000 > threshold;
}

function daysAgo(project) {
  if (!project.last_commit?.date) return 99999;
  return (Date.now() - new Date(project.last_commit.date).getTime()) / 86400000;
}

function projectStateLabel(project) {
  if (!project.project_state) return null;
  return TRANSLATIONS[state.locale].states[project.project_state] || project.project_state;
}

function projectTypeLabel(project) {
  const type = project.project_type;
  if (!type) return null;
  return TRANSLATIONS[state.locale].types[type] || type;
}

function getPrimaryStatus(project) {
  if (project.status === "missing_path") return { label: t("missingPathLine"), kind: "danger" };
  if (project.status === "no_git") return { label: t("noGitLine"), kind: "muted" };
  if (project.project_state === "blocked") return { label: t("primaryBlocked"), kind: "danger" };
  if (project.project_state === "waiting") return { label: t("primaryWaiting"), kind: "info" };
  if (project.project_state === "paused") return { label: t("primaryPaused"), kind: "muted" };
  if (project.project_state === "maintenance") return { label: t("primaryMaintenance"), kind: "muted" };
  if (project.behind > 0) return { label: t("primaryBehind", { count: project.behind }), kind: "danger" };
  if (project.roadmap?.pending?.length) {
    return { label: t("primaryPending", { count: project.roadmap.pending.length }), kind: "warn" };
  }
  if (project.total_changes > 0) {
    return { label: t("primaryChanges", { count: project.total_changes }), kind: "warn" };
  }
  if (isStale(project)) {
    return { label: t("primaryStale", { count: Math.floor(daysAgo(project)) }), kind: "warn" };
  }
  if (project.is_git && !project.has_upstream) return { label: t("primaryNoUpstream"), kind: "info" };
  return { label: t("primaryHealthy"), kind: "ok" };
}

function getAttentionScore(project) {
  if (project.archived) return -1;

  let score = 0;
  if (project.pinned) score += 120;
  if (project.project_state === "blocked") score += 100;
  if (project.project_state === "waiting") score += 60;
  if (project.project_state === "paused") score += 10;
  if (project.status === "missing_path") score += 90;
  if (project.status === "no_git") score += 50;
  if (project.behind > 0) score += 35 + Math.min(project.behind * 3, 25);
  if (project.total_changes > 0) score += Math.min(project.total_changes * 2, 40);
  if (project.roadmap?.pending?.length) score += Math.min(project.roadmap.pending.length * 6, 30);
  if (project.is_git && !project.has_upstream) score += 12;
  if (isStale(project)) score += 18;
  if (project.work) score += 5;
  return score;
}

function statusColor(project) {
  if (project.status === "missing_path") return "problem";
  if (!project.is_git) return "gray";
  if (project.total_changes === 0) return "green";
  if (project.total_changes <= 10) return "yellow";
  return "red";
}

function updateReloadButton() {
  const labels = {
    idle: t("reload"),
    loading: t("reloading"),
    done: t("reloadDone"),
  };
  els.reloadBtn.textContent = labels[state.reloadState] || labels.idle;
  els.reloadBtn.disabled = state.reloadState === "loading";
}

function updateTimestamp() {
  if (state.reloadState === "loading") {
    els.timestamp.textContent = t("updatingTimestamp");
    return;
  }
  if (!state.generatedAt) {
    els.timestamp.textContent = "";
    return;
  }
  els.timestamp.textContent = t("updatedAt", { value: relativeDate(state.generatedAt) });
  const ageHours = (Date.now() - new Date(state.generatedAt).getTime()) / 3600000;
  els.timestamp.dataset.stale = String(ageHours > 1);
}

function updateLocaleButtons() {
  document.documentElement.lang = state.locale;
  document.title = t("documentTitle");
  els.headerTitle.textContent = t("headerTitle");
  els.headerSubtitle.textContent = t("headerSubtitle");
  els.localeToggle.setAttribute("aria-label", t("languageSwitcher"));
  els.localeButtons.forEach((button) => {
    const active = button.dataset.locale === state.locale;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
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

function loadLocalePreference() {
  const storedLocale = localStorage.getItem(LOCALE_KEY);
  const browserLanguage = navigator.languages?.[0] || navigator.language;
  state.locale = resolveLocalePreference(storedLocale, browserLanguage);
}

function persistLocalePreference() {
  localStorage.setItem(LOCALE_KEY, state.locale);
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
  toast(success ? t("copySuccess", { path: project.path }) : t("copyFailure"));
}

function showError(message) {
  els.error.innerHTML = `${esc(message)}<br><code>${esc(t("serverHintCommand"))}</code>`;
  els.error.style.display = "block";
}

function clearError() {
  els.error.style.display = "none";
}

async function openRoadmap(project) {
  if (!project.roadmap?.path) {
    toast(t("roadmapUnavailable"));
    return;
  }

  try {
    const response = await fetch("/open-roadmap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ path: project.roadmap.path }),
    });

    if (!response.ok) {
      const message = await readErrorMessage(response, `HTTP ${response.status}`);
      throw new Error(message);
    }

    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Open roadmap failed");
  } catch (error) {
    toast(t("roadmapOpenFailure", { message: error?.message || "unknown error" }));
  }
}

async function readErrorMessage(response, fallback) {
  try {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const payload = await response.json();
      return payload.error || fallback;
    }
    const text = (await response.text()).trim();
    return text || fallback;
  } catch {
    return fallback;
  }
}

async function softReload() {
  let success = false;
  state.reloadState = "loading";
  updateReloadButton();
  updateTimestamp();

  try {
    const data = await refreshData();
    if (!data) return;
    render(data);
    success = true;
    state.reloadState = "done";
    updateReloadButton();
    updateTimestamp();
  } catch (error) {
    console.error("Soft reload failed", error);
    showError(t("refreshUiError", { message: error?.message || "unknown error" }));
  } finally {
    setTimeout(
      () => {
        state.reloadState = "idle";
        updateReloadButton();
        updateTimestamp();
      },
      success ? 1200 : 0,
    );
  }
}

async function refreshData() {
  try {
    const response = await fetch("/refresh", {
      method: "POST",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const message = await readErrorMessage(response, `HTTP ${response.status}`);
      throw new Error(message);
    }

    const payload = await response.json();
    if (!payload.ok || !payload.data) throw new Error(payload.error || "Refresh failed");

    clearError();
    return payload.data;
  } catch (error) {
    showError(t("refreshDataError", { message: error?.message || "unknown error" }));
    return null;
  }
}

async function loadData() {
  try {
    const response = await fetch(`./data.json?${Date.now()}`);

    if (!response.ok) {
      const message = await readErrorMessage(response, `HTTP ${response.status}`);
      throw new Error(message);
    }

    const data = await response.json();
    clearError();
    return data;
  } catch (error) {
    showError(t("loadDataError", { message: error?.message || "unknown error" }));
    return null;
  }
}

function getSortedIndices() {
  const indices = state.allProjects.map((_, index) => index);
  if (state.currentSort === "default") {
    return indices.sort((left, right) => {
      const scoreDiff = getAttentionScore(state.allProjects[right]) - getAttentionScore(state.allProjects[left]);
      if (scoreDiff !== 0) return scoreDiff;
      const dateDiff = daysAgo(state.allProjects[left]) - daysAgo(state.allProjects[right]);
      if (dateDiff !== 0) return dateDiff;
      return state.allProjects[left].name.localeCompare(state.allProjects[right].name);
    });
  }
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
    if (show) {
      visible += 1;
    }
  });

  els.resultsCount.textContent =
    visible < state.allProjects.length ? `${visible} / ${state.allProjects.length}` : "";
  els.emptyState.style.display = visible === 0 ? "block" : "none";
  persistViewState();
}

const SORT_SUFFIX = {
  changes: " ↓",
  date:    " ↑",
  name:    " A–Z",
};

function updateStatusButtons() {
  els.statusFilters.querySelectorAll(".filter-btn").forEach((button) => {
    const filter = button.dataset.filter;
    const label = TRANSLATIONS[state.locale].filters[filter];
    const isActive = filter === state.activeStatus;
    const suffix = isActive && state.currentSort !== "default" ? (SORT_SUFFIX[state.currentSort] ?? "") : "";
    button.textContent = label + suffix;
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
    rendered.textContent = t("notePlaceholder");
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

  const label = document.createElement("div");
  label.className = "card-note-label";
  label.textContent = t("notesSectionLabel");

  const rendered = document.createElement("div");
  rendered.className = "note-rendered";
  renderNoteContent(rendered, project);

  rendered.addEventListener("click", (event) => {
    event.stopPropagation();
    wrapper.classList.add("editing");

    const textarea = document.createElement("textarea");
    textarea.className = "note-textarea";
    textarea.value = resolveNote(project);
    textarea.rows = Math.max(3, (textarea.value.match(/\n/g) || []).length + 2);

    const hint = document.createElement("div");
    hint.className = "note-hint";
    hint.textContent = t("noteHint");

    wrapper.replaceChild(textarea, rendered);
    wrapper.appendChild(hint);
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    const commit = () => {
      saveNote(project.id, textarea.value);
      wrapper.classList.remove("editing");
      if (wrapper.contains(textarea)) wrapper.replaceChild(rendered, textarea);
      if (wrapper.contains(hint)) hint.remove();
      renderNoteContent(rendered, project);
      applyFilters();
    };

    textarea.addEventListener("keydown", (keyEvent) => {
      if (keyEvent.key === "Escape") {
        keyEvent.stopPropagation();
        wrapper.classList.remove("editing");
        if (wrapper.contains(textarea)) wrapper.replaceChild(rendered, textarea);
        if (wrapper.contains(hint)) hint.remove();
        renderNoteContent(rendered, project);
      } else if (keyEvent.key === "Enter" && !keyEvent.shiftKey) {
        keyEvent.preventDefault();
        commit();
        toast(t("noteSaved"));
      }
    });

    textarea.addEventListener("blur", () => {
      if (wrapper.contains(textarea)) commit();
    });
    textarea.addEventListener("click", (clickEvent) => clickEvent.stopPropagation());
  });

  wrapper.appendChild(label);
  wrapper.appendChild(rendered);
  return wrapper;
}

function roadmapIssueLabel(project) {
  switch (project.roadmap_status) {
    case "missing_file":
      return t("roadmapMissingFile");
    case "missing_section":
      return t("roadmapMissingSection");
    case "unsupported_mode":
      return t("roadmapUnsupportedMode");
    case "empty":
      return t("roadmapEmpty");
    default:
      return null;
  }
}

function buildAttentionItems(project) {
  const items = [];

  if (project.status === "missing_path") {
    items.push({ label: t("pathNotFound"), kind: "danger" });
  } else {
    if (!project.is_git) items.push({ label: t("noGitShort"), kind: "muted" });
    if (project.is_git && !project.has_upstream) items.push({ label: t("noUpstream"), kind: "warn" });
    if (project.ahead > 0) items.push({ label: t("aheadLocal", { count: project.ahead }), kind: "info" });
    if (project.behind > 0) items.push({ label: t("behindRemote", { count: project.behind }), kind: "danger" });
    if (project.stash_count > 0) items.push({ label: t("stashCount", { count: project.stash_count }), kind: "warn" });
    if (isStale(project)) items.push({ label: t("staleProject"), kind: "warn" });
  }

  const roadmapLabel = roadmapIssueLabel(project);
  if (roadmapLabel) items.push({ label: roadmapLabel, kind: "danger" });

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
      <div class="problem-line">${esc(t("missingPathLine"))}</div>
      <div class="stat-commit"><code>${esc(project.path)}</code></div>
    `;
  }

  if (!project.is_git) {
    return `<div class="no-git">${esc(t("noGitLine"))}</div>`;
  }

  let html = "";
  if (project.total_changes === 0) {
    html += `<div class="stat-changes clean">${esc(t("workingTreeClean"))}</div>`;
  } else {
    const parts = [];
    if (project.modified > 0) parts.push(t("modifiedCount", { count: project.modified }));
    if (project.untracked > 0) parts.push(t("untrackedCount", { count: project.untracked }));
    if (project.staged > 0) parts.push(t("stagedCount", { count: project.staged }));
    const tone = project.total_changes > 10 ? "alert" : "warn";
    html += `<div class="stat-changes ${tone}">${esc(
      t("changesSummary", { count: project.total_changes, parts: parts.join(", ") }),
    )}</div>`;
  }

  if (project.last_commit?.hash) {
    html += `
      <div class="stat-commit">
        <span class="hash">${esc(project.last_commit.hash)}</span> ${esc(project.last_commit.message)}
        <span class="stat-sep">·</span>${esc(relativeDate(project.last_commit.date))}
      </div>
    `;
  }

  return html;
}

function buildRoadmapHtml(project) {
  if (!project.roadmap) return "";
  const roadmap = project.roadmap;
  const percent = roadmap.total > 0 ? Math.round((roadmap.done / roadmap.total) * 100) : 0;
  const previewItems = roadmap.pending.slice(0, 1);
  const hiddenCount = Math.max(roadmap.pending.length - previewItems.length, 0);
  const pendingPreviewHtml = previewItems.length
    ? `<ul class="pending-items pending-items-preview${hiddenCount ? " has-overflow" : ""}">${previewItems
        .map((item) => `<li class="pending-item">${esc(item)}</li>`)
        .join("")}</ul>`
    : "";
  const pendingFullHtml = hiddenCount
    ? `<ul class="pending-items pending-items-full">${roadmap.pending
        .map((item) => `<li class="pending-item">${esc(item)}</li>`)
        .join("")}</ul>`
    : "";
  const moreHtml = hiddenCount ? `<div class="roadmap-more">${esc(t("roadmapMore", { count: hiddenCount }))}</div>` : "";

  return `
    <div class="roadmap">
      <div class="roadmap-header">
        <span class="roadmap-label">${esc(roadmap.section)}</span>
        <span class="roadmap-count">${roadmap.done}/${roadmap.total}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${percent}%"></div></div>
      ${pendingPreviewHtml}
      ${moreHtml}
      ${pendingFullHtml}
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
    html += `<div class="expand-label">${esc(t("recentCommits"))}</div>${lines}`;
  }

  if (project.other_branches?.length) {
    const branches = project.other_branches
      .map((branch) => `<span class="branch-chip">${esc(branch)}</span>`)
      .join("");
    html += `
      <div class="expand-label" style="margin-top:8px">${esc(t("otherBranches"))}</div>
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
  copyButton.textContent = t("copyPath");
  copyButton.addEventListener("click", async (event) => {
    event.stopPropagation();
    await handleCopyPath(project);
  });
  wrapper.appendChild(copyButton);

  if (project.roadmap?.path) {
    const roadmapButton = document.createElement("button");
    roadmapButton.type = "button";
    roadmapButton.className = "card-action";
    roadmapButton.textContent = t("openRoadmap");
    roadmapButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openRoadmap(project);
    });
    wrapper.appendChild(roadmapButton);
  }

  return wrapper;
}

function buildProjectIdentityBadges(project, archived = false) {
  const parts = [];
  const typeLabel = projectTypeLabel(project);
  const stateLabel = projectStateLabel(project);

  if (typeLabel) parts.push(`<span class="card-chip type-chip">${esc(typeLabel)}</span>`);
  if (project.work && !project.project_type) parts.push(`<span class="card-chip work-chip">${esc(t("workBadge"))}</span>`);
  if (stateLabel) {
    parts.push(
      `<span class="card-chip state-chip state-chip-${esc(project.project_state)}">${esc(stateLabel)}</span>`,
    );
  }
  if (project.pinned) parts.push(`<span class="card-chip pin-chip">${esc(t("pinnedBadge"))}</span>`);
  if (archived) parts.push(`<span class="card-chip archived-badge">${esc(t("archivedBadge"))}</span>`);

  return parts.join("");
}

function buildNextActionHtml(project, compact = false) {
  if (!project.next_action) return "";
  if (compact) {
    return `<div class="next-action next-action-compact">${esc(project.next_action)}</div>`;
  }
  const label = t("nextActionLabel");
  return `<div class="next-action"><span class="next-action-label">${esc(label)}:</span> ${esc(project.next_action)}</div>`;
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
  card.dataset.projectId = project.id;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-expanded", "false");
  const primaryStatus = getPrimaryStatus(project);

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
  const identityBadges = buildProjectIdentityBadges(project, archived);

  card.innerHTML = `
    <div class="card-header">
      <div class="card-title">
        <span class="card-name">${esc(project.name)}</span>
        ${identityBadges}
      </div>
      ${metaHtml}
    </div>
    <div class="card-desc">${esc(project.description)}</div>
    <div class="primary-status ${primaryStatus.kind}">${esc(primaryStatus.label)}</div>
    ${buildNextActionHtml(project)}
    <div class="card-tech">${techTags}</div>
    <div class="attention-row">${attentionHtml}</div>
    <div>${buildStatsHtml(project)}</div>
  `;

  if (project.roadmap || project.recent_commits?.length > 1 || project.other_branches?.length) {
    const secondary = document.createElement("div");
    secondary.innerHTML = `${buildRoadmapHtml(project)}${buildExpandHtml(project)}`;
    while (secondary.firstChild) card.appendChild(secondary.firstChild);
  }
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
    ? t("archiveOpen", { count: state.archivedProjects.length })
    : t("archiveClosed", { count: state.archivedProjects.length });
}

function applyLocaleToStaticUi() {
  updateLocaleButtons();
  updateReloadButton();
  updateTimestamp();
  updateStatusButtons();
  els.searchInput.placeholder = t("searchPlaceholder");
  els.searchInput.setAttribute("aria-label", t("searchAriaLabel"));
  els.emptyState.textContent = t("emptyState");
  els.noScript.textContent = t("noScript");
}

function render(data) {
  state.latestData = data;
  state.generatedAt = data.generated_at || null;
  state.allProjects = data.projects.filter((project) => !project.archived);
  state.archivedProjects = data.projects.filter((project) => project.archived);

  applyLocaleToStaticUi();
  els.grid.innerHTML = "";
  state.allProjects.forEach((project, index) => els.grid.appendChild(buildCard(project, index)));

  buildTechFilters();
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

  els.localeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.locale === state.locale) return;
      state.locale = button.dataset.locale;
      persistLocalePreference();
      if (state.latestData) {
        render(state.latestData);
      } else {
        applyLocaleToStaticUi();
      }
    });
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
  loadLocalePreference();
  loadViewState();
  applyLocaleToStaticUi();
  bindStaticEvents();
  const data = await loadData();
  if (data) render(data);
}

initializeApp();
