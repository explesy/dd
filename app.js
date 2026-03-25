const NOTES_PREFIX = "dd:note:";
const VIEW_STATE_KEY = "dd:view-state";
const LOCALE_KEY = "dd:locale";
const SHOW_GIT_INFO_KEY = "dd:show-git-info";
const PROJECT_OVERRIDE_PREFIX = "dd:project:";

const SUPPORTED_LOCALES = ["en", "ru"];

const SORT_FOR = {
  all: "default",
  dirty: "changes",
  stale: "date",
  clean: "name",
};

const CATEGORY_FILTERS = ["work", "personal", "learn", "infra", "pinned"];
const GIT_STATUS_FILTERS = ["all", "dirty", "stale", "clean"];
const PROJECT_TYPE_OPTIONS = ["work", "personal", "learn", "infra"];

const TRANSLATIONS = {
  en: {
    documentTitle: "DD Project Dashboard",
    headerTitle: "DD",
    headerSubtitle: "Dashboard of Dashboards",
    languageSwitcher: "Language switcher",
    gitToggleLabel: "Git",
    gitToggleOn: "Git info is visible",
    gitToggleOff: "Git info is hidden",
    reload: "Refresh",
    reloading: "Refreshing…",
    reloadDone: "Done",
    updatingTimestamp: "Refreshing…",
    updatedAt: ({ value }) => `Updated ${value}`,
    filters: {
      all: "All",
      work: "Work",
      personal: "Personal",
      learn: "Learn",
      infra: "Infra",
      pinned: "Pinned",
      dirty: "Dirty",
      stale: "Stale",
      clean: "Clean",
    },
    searchPlaceholder: "Search by name, tech, notes…",
    searchAriaLabel: "Search projects",
    emptyState: "No projects match the current filters.",
    emptyFilteredTitle: "No projects match this view",
    emptyFilteredBody: "Clear a filter, switch the saved view, or broaden the search.",
    emptyBootstrapTitle: "No active projects yet",
    emptyBootstrapBody: "Add at least one project entry to your local registry, then refresh the dashboard.",
    emptyArchiveTitle: "Only archived projects are left",
    emptyArchiveBody: "Open the archive below if you want to browse inactive projects.",
    emptyStateRegistryHint: "projects.json",
    emptyActionClearFilters: "Clear filters",
    emptyActionOpenArchive: "Open archive",
    archiveClosed: ({ count }) => `▸ Archive (${count})`,
    archiveOpen: ({ count }) => `▾ Archive (${count})`,
    noScript: "This dashboard requires JavaScript.",
    projectMetaSaved: "Project meta updated",
    notesSectionLabel: "Notes",
    notePlaceholder: "add a checklist item…",
    noteAllDone: "all items are done",
    noteDoneToggle: ({ count }) => `Done (${count})`,
    summaryExpand: "Expand",
    summaryCollapse: "Collapse",
    noteHint: "[ ] todo  [x] done  · Cmd/Ctrl+Enter=save  Esc=cancel",
    noteSaved: "Saved",
    noteEditAction: "Edit",
    noteAddTodoAction: "+ Todo",
    noteSaveAction: "Save",
    noteCancelAction: "Cancel",
    copySuccess: ({ path }) => `Copied: ${path}`,
    copyFailure: "Could not copy path",
    roadmapUnavailable: "Roadmap file is unavailable",
    roadmapOpenFailure: ({ message }) => `Could not open roadmap: ${message}`,
    desktopActionFailure: ({ message }) => `Could not complete desktop action: ${message}`,
    copyPath: "Copy path",
    openFolder: "Folder",
    openRoadmap: "Open roadmap",
    archiveAction: "Archive",
    restoreAction: "Restore",
    pinAction: "Pin",
    pinnedAction: "Pinned",
    stateAction: "State",
    typeAction: "Type",
    clearSearchAction: "Clear search",
    workBadge: "work",
    archivedBadge: "archived",
    states: {
      active: "active",
      paused: "paused",
      blocked: "blocked",
      waiting: "waiting",
      maintenance: "maintenance",
    },
    types: {
      work: "work",
      personal: "personal",
      learn: "learn",
      infra: "infra",
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
    gitToggleLabel: "Git",
    gitToggleOn: "Git-информация показана",
    gitToggleOff: "Git-информация скрыта",
    reload: "Обновить",
    reloading: "Обновляю…",
    reloadDone: "Готово",
    updatingTimestamp: "Обновляю…",
    updatedAt: ({ value }) => `Обновлено ${value}`,
    filters: {
      all: "Все",
      work: "Работа",
      personal: "Личное",
      learn: "Обучение",
      infra: "Инфра",
      pinned: "Закреп.",
      dirty: "Грязные",
      stale: "Старые",
      clean: "Чистые",
    },
    searchPlaceholder: "Поиск по имени, стеку, заметкам…",
    searchAriaLabel: "Поиск проектов",
    emptyState: "Нет проектов под текущими фильтрами.",
    emptyFilteredTitle: "Под этот вид ничего не подходит",
    emptyFilteredBody: "Сбрось фильтр, переключи сохраненный вид или расширь поиск.",
    emptyBootstrapTitle: "Активных проектов пока нет",
    emptyBootstrapBody: "Добавь хотя бы один проект в локальный реестр и обнови дашборд.",
    emptyArchiveTitle: "Остался только архив",
    emptyArchiveBody: "Открой архив ниже, если хочешь посмотреть неактивные проекты.",
    emptyStateRegistryHint: "projects.json",
    emptyActionClearFilters: "Сбросить фильтры",
    emptyActionOpenArchive: "Открыть архив",
    archiveClosed: ({ count }) => `▸ Архив (${count})`,
    archiveOpen: ({ count }) => `▾ Архив (${count})`,
    noScript: "Для дашборда нужен JavaScript.",
    projectMetaSaved: "Параметры проекта обновлены",
    notesSectionLabel: "Заметки",
    notePlaceholder: "добавить пункт чеклиста…",
    noteAllDone: "все пункты выполнены",
    noteDoneToggle: ({ count }) => `Сделано (${count})`,
    summaryExpand: "Развернуть",
    summaryCollapse: "Свернуть",
    noteHint: "[ ] todo  [x] done  · Cmd/Ctrl+Enter=сохранить  Esc=отмена",
    noteSaved: "Сохранено",
    noteEditAction: "Изменить",
    noteAddTodoAction: "+ Todo",
    noteSaveAction: "Сохранить",
    noteCancelAction: "Отмена",
    copySuccess: ({ path }) => `Скопировано: ${path}`,
    copyFailure: "Не удалось скопировать путь",
    roadmapUnavailable: "Файл roadmap недоступен",
    roadmapOpenFailure: ({ message }) => `Не удалось открыть roadmap: ${message}`,
    desktopActionFailure: ({ message }) => `Не удалось выполнить локальное действие: ${message}`,
    copyPath: "Скопировать путь",
    openFolder: "Папка",
    openRoadmap: "Открыть roadmap",
    archiveAction: "В архив",
    restoreAction: "Вернуть",
    pinAction: "Закрепить",
    pinnedAction: "Закреплено",
    stateAction: "Статус",
    typeAction: "Тип",
    clearSearchAction: "Очистить поиск",
    workBadge: "работа",
    archivedBadge: "архив",
    states: {
      active: "активный",
      paused: "пауза",
      blocked: "блокер",
      waiting: "ожидание",
      maintenance: "поддержка",
    },
    types: {
      work: "работа",
      personal: "личный",
      learn: "обучение",
      infra: "инфра",
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
  activeCategory: null,
  activeGitStatus: "all",
  searchQuery: "",
  currentSort: "default",
  locale: "en",
  showGitInfo: true,
  latestData: null,
  generatedAt: null,
  reloadState: "idle",
  noteDoneOpen: {},
  roadmapOpen: {},
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
  els.gitToggle = document.getElementById("gitToggle");
  els.timestamp = document.getElementById("timestamp");
  els.reloadBtn = document.getElementById("reloadBtn");
  els.statusFilters = document.getElementById("statusFilters");
  els.searchInput = document.getElementById("searchInput");
  els.searchClear = document.getElementById("searchClear");
  els.resultsCount = document.getElementById("resultsCount");
  els.grid = document.getElementById("grid");
  els.archiveSection = document.getElementById("archiveSection");
  els.archiveToggle = document.getElementById("archiveToggle");
  els.archiveGrid = document.getElementById("archiveGrid");
  els.error = document.getElementById("error");
  els.toast = document.getElementById("toast");
  els.emptyState = document.getElementById("emptyState");
  els.emptyStateTitle = document.getElementById("emptyStateTitle");
  els.emptyStateBody = document.getElementById("emptyStateBody");
  els.emptyStateCode = document.getElementById("emptyStateCode");
  els.emptyStateAction = document.getElementById("emptyStateAction");
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
  const roadmapLabel = roadmapIssueLabel(project);
  if (roadmapLabel) return { label: roadmapLabel, kind: "danger" };
  if (project.roadmap?.pending?.length) {
    return { label: t("primaryPending", { count: project.roadmap.pending.length }), kind: "warn" };
  }
  if (!state.showGitInfo) return { label: t("primaryHealthy"), kind: "ok" };
  if (project.behind > 0) return { label: t("primaryBehind", { count: project.behind }), kind: "danger" };
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
  els.localeToggle.textContent = state.locale.toUpperCase();
  els.localeToggle.setAttribute("aria-label", t("languageSwitcher"));
  els.localeToggle.title = state.locale === "en" ? "Switch to Russian" : "Switch to English";
}

function updateGitToggle() {
  const active = Boolean(state.showGitInfo);
  els.gitToggle.textContent = t("gitToggleLabel");
  els.gitToggle.classList.toggle("active", active);
  els.gitToggle.setAttribute("aria-pressed", String(active));
  els.gitToggle.title = active ? t("gitToggleOn") : t("gitToggleOff");
}

function filterLabel(key) {
  return ((TRANSLATIONS[state.locale] || TRANSLATIONS.en).filters)[key] ?? key;
}

function updateSearchClearButton() {
  const visible = Boolean(state.searchQuery);
  els.searchClear.classList.toggle("visible", visible);
  els.searchClear.disabled = !visible;
  els.searchClear.setAttribute("aria-hidden", String(!visible));
}

function hasActiveFilters() {
  return (
    state.activeCategory !== null ||
    state.activeGitStatus !== "all" ||
    Boolean(state.searchQuery)
  );
}

function resetFiltersToDefault() {
  state.activeCategory = null;
  state.activeGitStatus = "all";
  state.searchQuery = "";
  state.currentSort = "default";
  buildFilterButtons();
  els.searchInput.value = "";
  applyFilters();
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
    state.activeCategory = CATEGORY_FILTERS.includes(persisted.activeCategory)
      ? persisted.activeCategory
      : null;
    state.activeGitStatus = GIT_STATUS_FILTERS.includes(persisted.activeGitStatus)
      ? persisted.activeGitStatus
      : "all";
    state.searchQuery = persisted.searchQuery || "";
    state.currentSort = SORT_FOR[state.activeGitStatus] || "default";
  } catch {
    state.activeCategory = null;
    state.activeGitStatus = "all";
  }
}

function persistViewState() {
  localStorage.setItem(
    VIEW_STATE_KEY,
    JSON.stringify({
      activeCategory: state.activeCategory,
      activeGitStatus: state.activeGitStatus,
      searchQuery: state.searchQuery,
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

function loadShowGitInfoPreference() {
  const stored = localStorage.getItem(SHOW_GIT_INFO_KEY);
  state.showGitInfo = stored === null ? true : stored !== "false";
}

function persistShowGitInfoPreference() {
  localStorage.setItem(SHOW_GIT_INFO_KEY, String(Boolean(state.showGitInfo)));
}

function projectOverrideKey(id) {
  return PROJECT_OVERRIDE_PREFIX + id;
}

function loadProjectOverrides(id) {
  try {
    const raw = localStorage.getItem(projectOverrideKey(id));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistProjectOverrides(id, overrides) {
  const normalized = Object.fromEntries(
    Object.entries(overrides).filter(([, value]) => value !== undefined),
  );
  if (!Object.keys(normalized).length) {
    localStorage.removeItem(projectOverrideKey(id));
    return;
  }
  localStorage.setItem(projectOverrideKey(id), JSON.stringify(normalized));
}

function applyProjectOverrides(project) {
  const overrides = loadProjectOverrides(project.id);
  return {
    ...project,
    archived: Object.hasOwn(overrides, "archived") ? overrides.archived : Boolean(project.archived),
    pinned: Object.hasOwn(overrides, "pinned") ? overrides.pinned : Boolean(project.pinned),
    project_state: Object.hasOwn(overrides, "project_state") ? overrides.project_state : (project.project_state || null),
    project_type: Object.hasOwn(overrides, "project_type") ? overrides.project_type : (project.project_type || null),
  };
}

function getNote(id) {
  const stored = localStorage.getItem(NOTES_PREFIX + id);
  return stored !== null ? stored : null;
}

function saveNote(id, text) {
  const normalized = normalizeNoteValue(text);
  if (normalized.trim()) {
    localStorage.setItem(NOTES_PREFIX + id, normalized);
  } else {
    localStorage.removeItem(NOTES_PREFIX + id);
  }
}

function updateProjectOverride(projectId, updates) {
  const current = loadProjectOverrides(projectId);
  const next = { ...current, ...updates };
  persistProjectOverrides(projectId, next);
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

async function runDesktopAction(endpoint, project) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ path: project.path }),
    });

    if (!response.ok) {
      const message = await readErrorMessage(response, `HTTP ${response.status}`);
      throw new Error(message);
    }

    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Desktop action failed");
  } catch (error) {
    toast(t("desktopActionFailure", { message: error?.message || "unknown error" }));
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

function buildSearchHaystack(project) {
  const note = resolveNote(project);
  const roadmapItems = project.roadmap?.pending?.join(" ") || "";
  const stateLabel = projectStateLabel(project) || "";
  const typeLabel = projectTypeLabel(project) || "";
  const branch = project.branch || "";
  return [
    project.name,
    project.description,
    project.tech.join(" "),
    note,
    roadmapItems,
    stateLabel,
    typeLabel,
    branch,
  ]
    .join(" ")
    .toLowerCase();
}

function matchesFilters(project) {
  if (state.activeCategory === "work" && !project.work) return false;
  if (state.activeCategory === "personal" && !(project.project_type === "personal" || (!project.project_type && !project.work))) return false;
  if (state.activeCategory === "learn" && project.project_type !== "learn") return false;
  if (state.activeCategory === "infra" && project.project_type !== "infra") return false;
  if (state.activeCategory === "pinned" && !project.pinned) return false;
  if (state.activeGitStatus === "dirty" && project.total_changes === 0) return false;
  if (state.activeGitStatus === "clean" && (project.total_changes > 0 || !project.is_git)) return false;
  if (state.activeGitStatus === "stale" && !isStale(project)) return false;

  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    const haystack = buildSearchHaystack(project);
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
  updateEmptyState(visible);
  updateSearchClearButton();
  persistViewState();
}

function updateEmptyState(visibleCount) {
  if (visibleCount > 0) {
    els.emptyState.style.display = "none";
    return;
  }

  let title = t("emptyFilteredTitle");
  let body = t("emptyFilteredBody");
  let code = "";
  let action = "";
  let actionLabel = "";

  if (!state.allProjects.length && state.archivedProjects.length) {
    title = t("emptyArchiveTitle");
    body = t("emptyArchiveBody");
    if (!state.archiveOpen) {
      action = "open-archive";
      actionLabel = t("emptyActionOpenArchive");
    }
  } else if (!state.allProjects.length) {
    title = t("emptyBootstrapTitle");
    body = t("emptyBootstrapBody");
    code = t("emptyStateRegistryHint");
  } else if (hasActiveFilters()) {
    action = "clear-filters";
    actionLabel = t("emptyActionClearFilters");
  }

  els.emptyStateTitle.textContent = title;
  els.emptyStateBody.textContent = body;
  els.emptyStateCode.textContent = code;
  els.emptyStateCode.style.display = code ? "inline-flex" : "none";
  els.emptyStateAction.textContent = actionLabel;
  els.emptyStateAction.dataset.action = action;
  els.emptyStateAction.style.display = action ? "inline-flex" : "none";
  els.emptyState.style.display = "block";
}

const SORT_SUFFIX = {
  changes: " ↓",
  date:    " ↑",
  name:    " A–Z",
};

function buildFilterButtons() {
  els.statusFilters.innerHTML = "";

  // "All" — clears both category and git status
  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = "filter-btn";
  allBtn.dataset.filter = "all";
  allBtn.textContent = filterLabel("all");
  const allActive = state.activeCategory === null && state.activeGitStatus === "all";
  allBtn.classList.toggle("active", allActive);
  allBtn.setAttribute("aria-pressed", String(allActive));
  allBtn.addEventListener("click", () => {
    state.activeCategory = null;
    state.activeGitStatus = "all";
    state.currentSort = "default";
    buildFilterButtons();
    applyFilters();
  });
  els.statusFilters.appendChild(allBtn);

  // Category buttons
  CATEGORY_FILTERS.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn";
    btn.dataset.filter = cat;
    btn.textContent = filterLabel(cat);
    const active = state.activeCategory === cat;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
    btn.addEventListener("click", () => {
      state.activeCategory = state.activeCategory === cat ? null : cat;
      buildFilterButtons();
      applyFilters();
    });
    els.statusFilters.appendChild(btn);
  });

  // Inline separator between category and git status groups
  const sep = document.createElement("span");
  sep.className = "filter-inline-sep";
  sep.textContent = "·";
  sep.setAttribute("aria-hidden", "true");
  els.statusFilters.appendChild(sep);

  // Git status buttons
  GIT_STATUS_FILTERS.filter((f) => f !== "all").forEach((filter) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn";
    btn.dataset.filter = filter;
    const isActive = filter === state.activeGitStatus;
    const suffix = isActive && state.currentSort !== "default" ? (SORT_SUFFIX[state.currentSort] ?? "") : "";
    btn.textContent = filterLabel(filter) + suffix;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
    btn.addEventListener("click", () => {
      state.activeGitStatus = state.activeGitStatus === filter ? "all" : filter;
      state.currentSort = SORT_FOR[state.activeGitStatus] || "default";
      buildFilterButtons();
      applyFilters();
    });
    els.statusFilters.appendChild(btn);
  });
}


function normalizeNoteItems(raw) {
  return (raw || "")
    .split("\n")
    .map((line) => {
      const checkbox = line.match(/^\s*(?:[-*]\s+)?\[([ xX]?)\]\s*(.*)$/);
      if (checkbox) {
        const label = checkbox[2].trim();
        if (!label) return null;
        return { checked: checkbox[1].toLowerCase() === "x", label };
      }

      const bullet = line.match(/^\s*[-*]\s+(.*)$/);
      const label = (bullet ? bullet[1] : line).trim();
      if (!label) return null;
      return { checked: false, label };
    })
    .filter(Boolean);
}

function serializeNoteItems(items) {
  const active = items.filter((item) => !item.checked);
  const done = items.filter((item) => item.checked);
  return [...active, ...done].map((item) => `[${item.checked ? "x" : " "}] ${item.label}`).join("\n");
}

function normalizeNoteValue(raw) {
  return serializeNoteItems(normalizeNoteItems(raw));
}

function toggleCheckbox(raw, itemIndex) {
  const items = normalizeNoteItems(raw);
  if (!items[itemIndex]) return serializeNoteItems(items);
  items[itemIndex] = { ...items[itemIndex], checked: !items[itemIndex].checked };
  return serializeNoteItems(items);
}

function renderChecklistList(items, { interactive = false, project = null, rendered = null } = {}) {
  const list = document.createElement("ul");
  list.className = "note-list";

  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.className = "note-item";
    if (item.checked) listItem.classList.add("checked");

    if (interactive) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.checked;
      checkbox.addEventListener("click", (event) => {
        event.stopPropagation();
        const updated = toggleCheckbox(resolveNote(project), item.index);
        saveNote(project.id, updated);
        renderNoteContent(rendered, project);
      });
      listItem.appendChild(checkbox);
    } else {
      const bullet = document.createElement("span");
      bullet.className = "note-item-bullet";
      bullet.textContent = item.checked ? "✓" : "·";
      listItem.appendChild(bullet);
    }

    const label = document.createElement("span");
    label.className = "note-item-label";
    label.textContent = item.label;
    listItem.appendChild(label);
    list.appendChild(listItem);
  });

  return list;
}

function buildCaretSummary(label, open, onToggle, extraClass = "") {
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = `caret-summary${extraClass ? ` ${extraClass}` : ""}`;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.title = open ? t("summaryCollapse") : t("summaryExpand");

  const caret = document.createElement("span");
  caret.className = `caret-summary-icon${open ? " open" : ""}`;
  caret.textContent = "▸";

  const text = document.createElement("span");
  text.className = "caret-summary-label";
  text.textContent = label;

  toggle.appendChild(caret);
  toggle.appendChild(text);
  toggle.addEventListener("click", onToggle);
  return toggle;
}

function renderNoteContent(rendered, project) {
  const items = normalizeNoteItems(resolveNote(project)).map((item, index) => ({ ...item, index }));
  const activeItems = items.filter((item) => !item.checked);
  const doneItems = items.filter((item) => item.checked);

  rendered.innerHTML = "";

  if (!items.length) {
    rendered.textContent = t("notePlaceholder");
    rendered.classList.add("empty");
    return;
  }

  rendered.classList.remove("empty");

  if (activeItems.length) {
    rendered.appendChild(renderChecklistList(activeItems, { interactive: true, project, rendered }));
  } else {
    const empty = document.createElement("div");
    empty.className = "note-all-done";
    empty.textContent = t("noteAllDone");
    rendered.appendChild(empty);
  }

  if (!doneItems.length) return;

  const doneOpen = Boolean(state.noteDoneOpen[project.id]);
  const doneSection = document.createElement("div");
  doneSection.className = "note-done";
  doneSection.appendChild(
    buildCaretSummary(
      t("noteDoneToggle", { count: doneItems.length }),
      doneOpen,
      (event) => {
        event.stopPropagation();
        state.noteDoneOpen[project.id] = !doneOpen;
        renderNoteContent(rendered, project);
      },
      "note-done-toggle",
    ),
  );

  if (doneOpen) {
    doneSection.appendChild(renderChecklistList(doneItems, { interactive: false }));
  }

  rendered.appendChild(doneSection);
}

function autosizeTextarea(textarea) {
  textarea.style.height = "0px";
  textarea.style.height = `${Math.max(textarea.scrollHeight, 80)}px`;
}

function appendTodoLine(raw) {
  const normalized = normalizeNoteValue(raw);
  const prefix = normalized ? `${normalized}\n` : "";
  return `${prefix}[ ] `;
}

function buildNoteWidget(project) {
  const wrapper = document.createElement("div");
  wrapper.className = "card-note";

  const header = document.createElement("div");
  header.className = "card-note-header";

  const label = document.createElement("div");
  label.className = "card-note-label";
  label.textContent = t("notesSectionLabel");

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "card-note-edit-btn";
  editButton.textContent = t("noteEditAction");

  const todoButton = document.createElement("button");
  todoButton.type = "button";
  todoButton.className = "card-note-edit-btn";
  todoButton.textContent = t("noteAddTodoAction");

  header.appendChild(label);

  const headerActions = document.createElement("div");
  headerActions.className = "card-note-header-actions";
  headerActions.appendChild(todoButton);
  headerActions.appendChild(editButton);
  header.appendChild(headerActions);

  const rendered = document.createElement("div");
  rendered.className = "note-rendered";
  renderNoteContent(rendered, project);

  const startEditing = (event, options = {}) => {
    event.stopPropagation();
    if (wrapper.classList.contains("editing")) return;
    wrapper.classList.add("editing");

    const textarea = document.createElement("textarea");
    textarea.className = "note-textarea";
    textarea.value = options.prefill ?? normalizeNoteValue(resolveNote(project));

    const hint = document.createElement("div");
    hint.className = "note-hint";
    hint.textContent = t("noteHint");

    const actions = document.createElement("div");
    actions.className = "note-edit-actions";

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "note-edit-btn note-edit-save";
    saveButton.textContent = t("noteSaveAction");

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "note-edit-btn note-edit-cancel";
    cancelButton.textContent = t("noteCancelAction");

    actions.appendChild(saveButton);
    actions.appendChild(cancelButton);

    wrapper.replaceChild(textarea, rendered);
    wrapper.appendChild(actions);
    wrapper.appendChild(hint);
    autosizeTextarea(textarea);
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    const commit = () => {
      saveNote(project.id, textarea.value);
      wrapper.classList.remove("editing");
      if (wrapper.contains(textarea)) wrapper.replaceChild(rendered, textarea);
      if (wrapper.contains(actions)) actions.remove();
      if (wrapper.contains(hint)) hint.remove();
      renderNoteContent(rendered, project);
      applyFilters();
    };

    const cancel = () => {
      wrapper.classList.remove("editing");
      if (wrapper.contains(textarea)) wrapper.replaceChild(rendered, textarea);
      if (wrapper.contains(actions)) actions.remove();
      if (wrapper.contains(hint)) hint.remove();
      renderNoteContent(rendered, project);
    };

    saveButton.addEventListener("click", (clickEvent) => {
      clickEvent.stopPropagation();
      commit();
      toast(t("noteSaved"));
    });

    cancelButton.addEventListener("click", (clickEvent) => {
      clickEvent.stopPropagation();
      cancel();
    });

    textarea.addEventListener("input", () => autosizeTextarea(textarea));

    textarea.addEventListener("keydown", (keyEvent) => {
      if (keyEvent.key === "Escape") {
        keyEvent.stopPropagation();
        cancel();
      } else if ((keyEvent.metaKey || keyEvent.ctrlKey) && keyEvent.key === "Enter") {
        keyEvent.preventDefault();
        commit();
        toast(t("noteSaved"));
      }
    });
    textarea.addEventListener("click", (clickEvent) => clickEvent.stopPropagation());
  };

  editButton.addEventListener("click", startEditing);
  todoButton.addEventListener("click", (event) => startEditing(event, { prefill: appendTodoLine(resolveNote(project)) }));
  rendered.addEventListener("click", startEditing);

  wrapper.appendChild(header);
  wrapper.appendChild(rendered);
  return wrapper;
}

function rerenderCurrentView(options = {}) {
  if (!state.latestData) return;
  const { focusProjectId = null } = options;
  render(state.latestData);

  if (focusProjectId) {
    const target = els.grid.querySelector(`.card[data-project-id="${focusProjectId}"]`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("flash-focus");
      setTimeout(() => target.classList.remove("flash-focus"), 1200);
    }
  }
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
  if (!state.showGitInfo) return [];
  const items = [];

  if (project.status === "missing_path") {
    items.push({ label: t("pathNotFound"), kind: "danger" });
  } else {
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

  if (!project.is_git) return "";

  if (!state.showGitInfo) return "";

  let html = "";
  if (project.total_changes > 0) {
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

function renderRoadmapContent(wrapper, project) {
  const roadmap = project.roadmap;
  if (!roadmap) return;
  const roadmapOpen = Boolean(state.roadmapOpen[project.id]);
  wrapper.innerHTML = "";
  wrapper.className = `roadmap${roadmapOpen ? " open" : ""}`;

  wrapper.appendChild(
    buildCaretSummary(
      roadmap.section,
      roadmapOpen,
      (event) => {
        event.stopPropagation();
        state.roadmapOpen[project.id] = !roadmapOpen;
        renderRoadmapContent(wrapper, project);
      },
      "roadmap-toggle",
    ),
  );

  const count = document.createElement("span");
  count.className = "roadmap-count";
  count.textContent = `${roadmap.done}/${roadmap.total}`;
  wrapper.querySelector(".roadmap-toggle").appendChild(count);

  if (!roadmapOpen) return;

  const previewItems = roadmap.pending.slice(0, 1);
  const hiddenCount = Math.max(roadmap.pending.length - previewItems.length, 0);

  if (previewItems.length) {
    const list = document.createElement("ul");
    list.className = `pending-items pending-items-preview${hiddenCount ? " has-overflow" : ""}`;
    previewItems.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.className = "pending-item";
      listItem.textContent = item;
      list.appendChild(listItem);
    });
    wrapper.appendChild(list);
  }

  if (hiddenCount) {
    const more = document.createElement("div");
    more.className = "roadmap-more";
    more.textContent = t("roadmapMore", { count: hiddenCount });
    wrapper.appendChild(more);
  }
}

function buildRoadmapSection(project) {
  const wrapper = document.createElement("div");
  renderRoadmapContent(wrapper, project);
  return wrapper;
}

function buildActions(project) {
  const wrapper = document.createElement("div");
  wrapper.className = "card-actions";

  const stateField = document.createElement("label");
  stateField.className = "card-state-field";

  const stateSelect = document.createElement("select");
  stateSelect.className = "card-state-select";
  stateSelect.setAttribute("aria-label", t("stateAction"));

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = t("stateAction");
  stateSelect.appendChild(emptyOption);

  ["active", "paused", "blocked", "waiting", "maintenance"].forEach((stateKey) => {
    const option = document.createElement("option");
    option.value = stateKey;
    option.textContent = projectStateLabel({ project_state: stateKey }) || stateKey;
    option.selected = project.project_state === stateKey;
    stateSelect.appendChild(option);
  });
  if (!project.project_state) emptyOption.selected = true;
  stateSelect.addEventListener("click", (event) => event.stopPropagation());
  stateSelect.addEventListener("change", () => {
    updateProjectOverride(project.id, { project_state: stateSelect.value || null });
    toast(t("projectMetaSaved"));
    rerenderCurrentView({ focusProjectId: project.id });
  });

  stateField.appendChild(stateSelect);
  wrapper.appendChild(stateField);

  const typeField = document.createElement("label");
  typeField.className = "card-state-field";

  const typeSelect = document.createElement("select");
  typeSelect.className = "card-state-select";
  typeSelect.setAttribute("aria-label", t("typeAction"));

  const typeEmptyOption = document.createElement("option");
  typeEmptyOption.value = "";
  typeEmptyOption.textContent = t("typeAction");
  typeSelect.appendChild(typeEmptyOption);

  PROJECT_TYPE_OPTIONS.forEach((typeKey) => {
    const option = document.createElement("option");
    option.value = typeKey;
    option.textContent = projectTypeLabel({ project_type: typeKey }) || typeKey;
    option.selected = project.project_type === typeKey;
    typeSelect.appendChild(option);
  });
  if (!project.project_type) typeEmptyOption.selected = true;
  typeSelect.addEventListener("click", (event) => event.stopPropagation());
  typeSelect.addEventListener("change", () => {
    updateProjectOverride(project.id, { project_type: typeSelect.value || null });
    toast(t("projectMetaSaved"));
    rerenderCurrentView({ focusProjectId: project.id });
  });

  typeField.appendChild(typeSelect);
  wrapper.appendChild(typeField);

  const folderButton = document.createElement("button");
  folderButton.type = "button";
  folderButton.className = "card-action";
  folderButton.textContent = t("openFolder");
  folderButton.addEventListener("click", (event) => {
    event.stopPropagation();
    runDesktopAction("/open-folder", project);
  });
  wrapper.appendChild(folderButton);

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "card-action";
  copyButton.textContent = t("copyPath");
  copyButton.addEventListener("click", async (event) => {
    event.stopPropagation();
    await handleCopyPath(project);
  });
  wrapper.appendChild(copyButton);

  const archiveButton = document.createElement("button");
  archiveButton.type = "button";
  archiveButton.className = "card-action";
  archiveButton.textContent = project.archived ? t("restoreAction") : t("archiveAction");
  archiveButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const nextArchived = !project.archived;
    updateProjectOverride(project.id, { archived: nextArchived });
    toast(t("projectMetaSaved"));
    rerenderCurrentView();
  });
  wrapper.appendChild(archiveButton);

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

  if (typeLabel) {
    const view = project.project_type === "work" ? "work-filter" : project.project_type;
    parts.push(
      `<button class="card-chip type-chip chip-action" data-view="${esc(view)}" type="button">${esc(typeLabel)}</button>`,
    );
  }
  if (project.work && !project.project_type) {
    parts.push(
      `<button class="card-chip work-chip chip-action" data-view="work-filter" type="button">${esc(t("workBadge"))}</button>`,
    );
  }
  if (stateLabel) {
    parts.push(
      `<span class="card-chip state-chip state-chip-${esc(project.project_state)}">${esc(stateLabel)}</span>`,
    );
  }
  if (archived) parts.push(`<span class="card-chip archived-badge">${esc(t("archivedBadge"))}</span>`);

  return parts.join("");
}

function buildPinControl(project) {
  const pinButton = document.createElement("button");
  pinButton.type = "button";
  pinButton.className = `card-pin-toggle${project.pinned ? " active" : ""}`;
  pinButton.setAttribute("aria-pressed", String(Boolean(project.pinned)));
  pinButton.setAttribute("aria-label", project.pinned ? t("pinnedAction") : t("pinAction"));
  pinButton.title = project.pinned ? t("pinnedAction") : t("pinAction");
  pinButton.innerHTML = `
    <svg class="card-pin-icon" aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path
        class="card-pin-outline"
        d="M8 1.9l1.8 3.65 4.03.59-2.91 2.83.69 4-3.61-1.9-3.6 1.9.68-4-2.9-2.83 4-.59L8 1.9Z"
        stroke="currentColor"
        stroke-width="1.15"
        stroke-linejoin="round"
      />
      <path
        class="card-pin-fill"
        d="M8 2.75 9.45 5.7l3.26.47-2.36 2.3.56 3.25L8 10.18l-2.91 1.54.56-3.25-2.36-2.3 3.26-.47L8 2.75Z"
        fill="currentColor"
      />
      <path
        class="card-pin-spark"
        d="M11.75 2.2h1.55M12.53 1.43v1.55"
        stroke="currentColor"
        stroke-width="1.1"
        stroke-linecap="round"
      />
    </svg>
  `;
  pinButton.addEventListener("click", (event) => {
    event.stopPropagation();
    updateProjectOverride(project.id, { pinned: !project.pinned });
    toast(t("projectMetaSaved"));
    rerenderCurrentView({ focusProjectId: project.id });
  });
  return pinButton;
}

function buildCard(project, index, archived = false) {
  const card = document.createElement("div");
  card.className = `card ${statusColor(project)}`;
  if (project.work) card.classList.add("work");
  if (archived) card.classList.add("archived");
  card.dataset.idx = String(index);
  card.dataset.projectId = project.id;
  const primaryStatus = getPrimaryStatus(project);

  let metaHtml = "";
  if (state.showGitInfo && project.is_git && project.branch) {
    let pills = "";
    if (project.has_upstream) {
      if (project.ahead > 0) pills += `<span class="meta-pill ahead-pill">↑${project.ahead}</span>`;
      if (project.behind > 0) pills += `<span class="meta-pill behind-pill">↓${project.behind}</span>`;
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

  const attentionHtml = state.showGitInfo ? buildAttentionHtml(project) : "";
  const identityBadges = buildProjectIdentityBadges(project, archived);
  const pinControl = buildPinControl(project).outerHTML;
  const statsHtml = buildStatsHtml(project);
  const attentionBlock = attentionHtml ? `<div class="attention-row">${attentionHtml}</div>` : "";
  const statsBlock = statsHtml ? `<div>${statsHtml}</div>` : "";

  card.innerHTML = `
    <div class="card-header">
      <div class="card-title">
        <span class="card-name">${esc(project.name)}</span>
        ${identityBadges}
      </div>
      <div class="card-header-side">
        ${metaHtml}
        ${pinControl}
      </div>
    </div>
    <div class="card-desc">${esc(project.description)}</div>
    <div class="primary-status ${primaryStatus.kind}">${esc(primaryStatus.label)}</div>
    <div class="card-tech">${techTags}</div>
    ${attentionBlock}
    ${statsBlock}
  `;

  if (project.roadmap) {
    card.appendChild(buildRoadmapSection(project));
  }
  card.appendChild(buildActions(project));
  card.appendChild(buildNoteWidget(project));


  card.querySelectorAll(".chip-action[data-view]").forEach((chip) => {
    chip.addEventListener("click", (event) => {
      event.stopPropagation();
      const view = chip.dataset.view;
      const cat = view === "work-filter" ? "work" : view;
      state.activeCategory = state.activeCategory === cat ? null : cat;
      buildFilterButtons();
      applyFilters();
    });
  });

  const renderedPinControl = card.querySelector(".card-pin-toggle");
  if (renderedPinControl) renderedPinControl.replaceWith(buildPinControl(project));

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
  els.archiveToggle.setAttribute("aria-expanded", String(state.archiveOpen));
  els.archiveToggle.textContent = state.archiveOpen
    ? t("archiveOpen", { count: state.archivedProjects.length })
    : t("archiveClosed", { count: state.archivedProjects.length });
}

function applyLocaleToStaticUi() {
  updateLocaleButtons();
  updateGitToggle();
  updateReloadButton();
  updateTimestamp();
  buildFilterButtons();
  els.searchInput.placeholder = t("searchPlaceholder");
  els.searchInput.setAttribute("aria-label", t("searchAriaLabel"));
  els.searchClear.setAttribute("aria-label", t("clearSearchAction"));
  els.searchClear.title = t("clearSearchAction");
  updateSearchClearButton();
  if (state.latestData) updateEmptyState(0);
  els.noScript.textContent = t("noScript");
}

function render(data) {
  state.latestData = data;
  state.generatedAt = data.generated_at || null;
  const projects = data.projects.map(applyProjectOverrides);
  state.allProjects = projects.filter((project) => !project.archived);
  state.archivedProjects = projects.filter((project) => project.archived);
  state.noteDoneOpen = {};
  state.roadmapOpen = {};

  applyLocaleToStaticUi();
  els.grid.innerHTML = "";
  state.allProjects.forEach((project, index) => els.grid.appendChild(buildCard(project, index)));

  buildFilterButtons();
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
    resetFiltersToDefault();
  }
}

function bindStaticEvents() {
  els.reloadBtn.addEventListener("click", () => {
    softReload();
  });

  els.localeToggle.addEventListener("click", () => {
    state.locale = SUPPORTED_LOCALES.find((l) => l !== state.locale) ?? "en";
    persistLocalePreference();
    if (state.latestData) {
      rerenderCurrentView();
    } else {
      applyLocaleToStaticUi();
    }
  });

  els.gitToggle.addEventListener("click", () => {
    state.showGitInfo = !state.showGitInfo;
    persistShowGitInfoPreference();
    if (state.latestData) {
      rerenderCurrentView();
    } else {
      updateGitToggle();
    }
  });

  buildFilterButtons();

  els.searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value.trim();
    applyFilters();
  });

  els.searchClear.addEventListener("click", () => {
    state.searchQuery = "";
    els.searchInput.value = "";
    applyFilters();
    els.searchInput.focus();
  });

  els.emptyStateAction.addEventListener("click", () => {
    if (els.emptyStateAction.dataset.action === "clear-filters") {
      resetFiltersToDefault();
      return;
    }
    if (els.emptyStateAction.dataset.action === "open-archive") {
      state.archiveOpen = true;
      renderArchiveSection();
      updateEmptyState(0);
    }
  });

  els.archiveToggle.addEventListener("click", () => toggleArchive());
  document.addEventListener("keydown", handleGlobalKeydown);
}

async function initializeApp() {
  initializeElements();
  loadLocalePreference();
  loadShowGitInfoPreference();
  loadViewState();
  applyLocaleToStaticUi();
  bindStaticEvents();
  const data = await loadData();
  if (data) render(data);
}

initializeApp();
