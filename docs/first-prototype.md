# Первый прототип

1. Запустите проект: `npm ci`, затем `npm run dev`.
2. Откройте `/guide`, `/ui` и `/patterns`; снимки боевого сайта находятся в `docs/references/`.
3. Попросите агента использовать `cian-design` и опишите пользователя, действие и критерий успеха. Например: «Собери экран сохранённых поисков, дай удалить поиск и открой подтверждение. Используй существующие компоненты».
4. Создайте компонент страницы в `src/pages/` на основе `PrototypePage` и добавьте маршрут в `src/App.tsx`.

```tsx
import { PrototypePage } from '@/templates/PrototypePage';
import { Button } from '@/ui';
import { usePrototype } from '@/hooks/prototype-context';

export function SavedSearchesPage() {
  const { notify } = usePrototype();
  return (
    <PrototypePage title="Сохранённые поиски" description="Вернитесь к подходящим квартирам">
      <Button onClick={() => notify('Новый поиск сохранён в примере')}>Сохранить поиск</Button>
    </PrototypePage>
  );
}
```

Импортируйте страницу в `App.tsx` и добавьте `<Route path="/saved-searches" element={<SavedSearchesPage />} />`. Этот пример объясняет подключение, а не добавляет готовую фичу в стартовый репозиторий.

Скилл лежит в `.agents/skills/cian-design/`. В Claude Code доступен тот же файл через `.claude/skills/cian-design` (ссылка на каноническую папку), а `CLAUDE.md` указывает на `AGENTS.md`. Если среда не обнаружила проектный скилл автоматически, попросите её прочитать `SKILL.md` по этому пути. Глобальная установка не нужна.

Проверьте: основной путь, пустой список, ошибку, длинные названия, Tab/Enter/Escape, возврат из диалога и ширины 1440/390 px. Запустите `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. Фиксируйте поведение и ограничения нового сценария в `docs/`.
