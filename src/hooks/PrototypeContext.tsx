import { useEffect, useState, type ReactNode } from 'react';
import { PrototypeContext } from './prototype-context';
import { Button, Modal } from '@/ui';
const storageKey = 'cian3:favorites:v1';
function readFavorites(): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}
export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState(readFavorites);
  const [demo, setDemo] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch {
      /* Prototypes remain usable when storage is unavailable. */
    }
  }, [favorites]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(timer);
  }, [notice]);
  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };
  return (
    <PrototypeContext.Provider
      value={{ favorites, toggleFavorite, showDemo: setDemo, notify: setNotice }}
    >
      {children}
      <div className="prototype-toast" role="status">
        {notice}
      </div>
      <Modal open={!!demo} title={demo} onClose={() => setDemo('')}>
        <div className="stack">
          <p>
            Этот раздел можно спроектировать в рамках вашего прототипа. Сейчас доступен пример
            поиска, выдачи и просмотра квартиры.
          </p>
          <Button fullWidth onClick={() => setDemo('')}>
            Понятно
          </Button>
        </div>
      </Modal>
    </PrototypeContext.Provider>
  );
}
