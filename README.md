# dd — Project Dashboard

Локальный дашборд для отслеживания состояния проектов. Показывает git-статус, uncommitted changes, roadmap и stale-индикаторы.

## Быстрый старт

```bash
python3 refresh.py               # собрать данные → data.json
python3 -m http.server 8787      # запустить сервер
# открыть http://localhost:8787
```

Или одной строкой:
```bash
python3 refresh.py && python3 -m http.server 8787
```

## Структура

```
dd/
  refresh.py    — собирает git-данные и roadmap в data.json
  index.html    — дашборд (HTML + CSS + JS, без зависимостей)
  data.json     — генерируется скриптом, не редактировать вручную
  README.md
```

## Карточки проектов

Каждая карточка показывает:
- **Цветная полоса слева**: красный (>10 изменений), жёлтый (1–10), зелёный (чисто), серый (не git)
- **Ветка + ahead/behind** относительно remote
- **Uncommitted changes**: modified / untracked / staged
- **Последний коммит**: хэш, сообщение, relative time
- **Stale-бейдж**: если последний коммит > 30 дней назад
- **Roadmap-секция** (если настроена): прогресс-бар + список pending задач

**Клик** — раскрыть последние 4 коммита.
**Двойной клик** — скопировать путь проекта в буфер.

Карточки отсортированы по убыванию изменений, внутри чистых — по давности коммита.

## Добавить проект

В `refresh.py`, в список `PROJECTS`, добавить словарь:

```python
{
    "id": "my-project",
    "description": "Описание проекта",
    "tech": ["Python", "FastAPI"],
    "path": "/Users/doc/Dev/my-project",
}
```

С roadmap (опционально):

```python
{
    ...
    "roadmap": {
        "file": "STATUS.md",        # путь относительно корня проекта
        "section": "Next Steps",    # заголовок секции (## или ###)
        "mode": "checkboxes",       # "checkboxes" или "next_steps"
    },
}
```

### Режимы roadmap

| mode | Формат | Что показывает |
|------|--------|----------------|
| `checkboxes` | `- [x]` / `- [ ]` | Прогресс-бар done/total + список незакрытых |
| `next_steps` | нумерованный список `1. ...` | Все пункты как pending tasks |

## Обновление данных

`data.json` не обновляется автоматически — нужно перезапускать `refresh.py`. Можно настроить alias:

```fish
# ~/.config/fish/config.fish
alias dd-refresh='python3 /Users/doc/notes/dd/refresh.py'
alias dd-open='dd-refresh && python3 -m http.server -d /Users/doc/notes/dd 8787'
```
