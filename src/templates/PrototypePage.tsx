import type { ReactNode } from 'react';
import { AppShell, Breadcrumbs, PageLayout } from '@/components/Layout';
/** Compose a new scenario without duplicating site chrome. Use inside PrototypeProvider. */
export function PrototypePage({
  title,
  description,
  children,
  aside,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <AppShell>
      <PageLayout aside={aside}>
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: title }]} />
        <div className="stack">
          <h1>{title}</h1>
          {description && <p className="muted">{description}</p>}
          {children}
        </div>
      </PageLayout>
    </AppShell>
  );
}
