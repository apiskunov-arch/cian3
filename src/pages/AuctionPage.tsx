import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Icon, Input } from '@/ui';
import { AppShell, Breadcrumbs, PageLayout } from '@/components/Layout';
import { listingLabel, listings, money } from '@/data/listings';
import s from './AuctionPage.module.css';

type Role = 'seller' | 'buyer';
type SellerStep = 'setup' | 'review' | 'published';
type BidState = 'idle' | 'loading' | 'accepted' | 'failed';

const listing = listings[0];
const minBid = 20_200_000;

function RoleSwitch({ role, onChange }: { role: Role; onChange: (role: Role) => void }) {
  return (
    <div className={s.roleSwitch} aria-label="Роль в прототипе">
      <button type="button" aria-pressed={role === 'seller'} onClick={() => onChange('seller')}>
        <Icon name="PlaceholderUser16" size={18} /> Продавец
      </button>
      <button type="button" aria-pressed={role === 'buyer'} onClick={() => onChange('buyer')}>
        <Icon name="PlaceholderUser16" size={18} /> Покупатель
      </button>
    </div>
  );
}

function AuctionFacts({ finishLabel = 'до 22 ноября, 19:00' }: { finishLabel?: string }) {
  return (
    <dl className={s.facts}>
      <div>
        <dt>Стартовая цена</dt>
        <dd>{money(19_900_000)}</dd>
      </div>
      <div>
        <dt>Минимальный шаг</dt>
        <dd>{money(100_000)}</dd>
      </div>
      <div>
        <dt>Окончание</dt>
        <dd>{finishLabel}</dd>
      </div>
    </dl>
  );
}

function SellerScenario({ onOpenBuyer }: { onOpenBuyer: () => void }) {
  const [step, setStep] = useState<SellerStep>('setup');
  const [startingPrice, setStartingPrice] = useState('19900000');
  const [increment, setIncrement] = useState('100000');
  const [finishDate, setFinishDate] = useState('2026-11-22T19:00');
  const [errors, setErrors] = useState<{
    startingPrice?: string;
    increment?: string;
    finishDate?: string;
  }>({});
  const startingPriceNumber = Number(startingPrice);
  const incrementNumber = Number(increment);
  const finishLabel = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(finishDate));

  const review = () => {
    const nextErrors = {
      startingPrice:
        !Number.isFinite(startingPriceNumber) || startingPriceNumber < 1_000_000
          ? 'Укажите цену от 1 000 000 ₽'
          : undefined,
      increment:
        !Number.isFinite(incrementNumber) || incrementNumber < 10_000
          ? 'Минимальный шаг — 10 000 ₽'
          : undefined,
      finishDate: finishDate ? undefined : 'Выберите дату окончания',
    };
    setErrors(nextErrors);
    if (!Object.values(nextErrors).some(Boolean)) setStep('review');
  };

  if (step === 'published')
    return (
      <section className={s.successPanel} aria-live="polite">
        <span className={s.successIcon}>
          <Icon name="FunctionalSuccess16" size={28} />
        </span>
        <Badge tone="positive">Аукцион опубликован</Badge>
        <h2>Покупатели уже могут делать ставки</h2>
        <p>
          Объявление появилось в демонстрационной выдаче. Управление ставками здесь показано как
          локальный сценарий — без реального размещения.
        </p>
        <div className={s.inlineActions}>
          <Button onClick={onOpenBuyer}>Открыть как покупатель</Button>
          <Button theme="main_secondary" onClick={() => setStep('setup')}>
            Изменить условия
          </Button>
        </div>
      </section>
    );

  return (
    <div className={s.sellerGrid}>
      <section className={s.formCard}>
        {step === 'setup' ? (
          <>
            <div className={s.cardHeading}>
              <Badge tone="main">Шаг 1 из 2</Badge>
              <h2>Настройте аукцион</h2>
              <p>Условия увидят все покупатели в карточке квартиры.</p>
            </div>
            <div className={s.formFields}>
              <Input
                label="Стартовая цена, ₽"
                inputMode="numeric"
                value={startingPrice}
                onChange={(event) => setStartingPrice(event.currentTarget.value.replace(/\D/g, ''))}
                error={errors.startingPrice}
                hint="Цена, с которой начнутся торги"
              />
              <Input
                label="Минимальный шаг, ₽"
                inputMode="numeric"
                value={increment}
                onChange={(event) => setIncrement(event.currentTarget.value.replace(/\D/g, ''))}
                error={errors.increment}
                hint="На эту сумму или больше можно повысить ставку"
              />
              <label className={s.dateField}>
                <span>Дата и время окончания</span>
                <input
                  type="datetime-local"
                  value={finishDate}
                  onChange={(event) => setFinishDate(event.currentTarget.value)}
                  aria-invalid={Boolean(errors.finishDate)}
                />
                {errors.finishDate && <small>{errors.finishDate}</small>}
              </label>
            </div>
            <Button fullWidth size="L" onClick={review}>
              Проверить условия
            </Button>
          </>
        ) : (
          <>
            <div className={s.cardHeading}>
              <Badge tone="main">Шаг 2 из 2</Badge>
              <h2>Проверьте условия</h2>
              <p>После публикации покупатели смогут отправлять ставки.</p>
            </div>
            <AuctionFacts finishLabel={`до ${finishLabel}`} />
            <div className={s.notice}>
              <Icon name="FunctionalInformationCircle16" size={20} /> Условия — учебное допущение.
              Оплата и оформление сделки в прототип не входят.
            </div>
            <div className={s.formActions}>
              <Button fullWidth size="L" onClick={() => setStep('published')}>
                Опубликовать аукцион
              </Button>
              <Button fullWidth theme="main_secondary" onClick={() => setStep('setup')}>
                Вернуться к условиям
              </Button>
            </div>
          </>
        )}
      </section>
      <aside className={s.previewCard}>
        <img src={listing.images[0]} alt="Интерьер квартиры" />
        <Badge tone="warning">Предпросмотр лота</Badge>
        <h2>{listingLabel(listing)}</h2>
        <p>{listing.address}, Москва</p>
        <AuctionFacts finishLabel={step === 'setup' ? 'выберите дату' : `до ${finishLabel}`} />
      </aside>
    </div>
  );
}

function BuyerScenario() {
  const [bid, setBid] = useState('');
  const [bidState, setBidState] = useState<BidState>('idle');
  const [bidError, setBidError] = useState('');
  const [finished, setFinished] = useState(false);
  const numericBid = Number(bid.replace(/\D/g, ''));
  const submitBid = () => {
    if (numericBid < minBid) {
      setBidError(`Минимальная ставка — ${money(minBid)}`);
      setBidState('idle');
      return;
    }
    setBidError('');
    setBidState('loading');
    window.setTimeout(() => setBidState('accepted'), 700);
  };
  return (
    <div className={s.buyerGrid}>
      <section className={s.listingCard}>
        <img src={listing.images[0]} alt="Интерьер квартиры" />
        <div className={s.listingBody}>
          <div className={s.listingBadges}>
            <Badge tone={finished ? 'neutral' : 'positive'}>
              {finished ? 'Аукцион завершён' : 'Торги идут'}
            </Badge>
            {!finished && <span>Осталось 2 дня 4 часа</span>}
          </div>
          <h2>{listingLabel(listing)}</h2>
          <p className={s.address}>
            {listing.address}, {listing.district}
          </p>
          <p className={s.metro}>
            М {listing.metro} · {listing.walkMinutes} минут пешком
          </p>
          <AuctionFacts finishLabel={finished ? '22 ноября, 19:00' : 'до 22 ноября, 19:00'} />
        </div>
      </section>
      <aside className={s.bidCard}>
        {finished ? (
          <section className={s.finished} aria-live="polite">
            <span className={s.finishIcon}>
              <Icon name="FunctionalSuccess16" size={24} />
            </span>
            <h2>Аукцион завершён</h2>
            <p>
              Победила ставка {money(20_500_000)}. Новый участник больше не может сделать ставку.
            </p>
            <Button theme="main_secondary" fullWidth onClick={() => setFinished(false)}>
              Показать активный аукцион
            </Button>
          </section>
        ) : (
          <>
            <Badge tone="main">Текущая ставка</Badge>
            <strong className={s.currentPrice}>{money(20_100_000)}</strong>
            <p className={s.bidHint}>Следующая ставка — от {money(minBid)}</p>
            {bidState === 'accepted' ? (
              <section className={s.bidAccepted} aria-live="polite">
                <Icon name="FunctionalSuccess16" size={24} />
                <div>
                  <strong>Ставка принята</strong>
                  <p>Вы лидируете. Сообщим, если ставку перебьют.</p>
                </div>
              </section>
            ) : bidState === 'failed' ? (
              <section className={s.bidFailed} role="alert">
                <Icon name="FunctionalInformationCircle16" size={22} />
                <div>
                  <strong>Не удалось отправить ставку</strong>
                  <p>Проверьте подключение и попробуйте ещё раз.</p>
                </div>
              </section>
            ) : (
              <Input
                label="Ваша ставка, ₽"
                inputMode="numeric"
                placeholder="20 200 000"
                value={bid}
                onChange={(event) => {
                  setBid(event.currentTarget.value.replace(/\D/g, ''));
                  setBidError('');
                }}
                error={bidError}
              />
            )}
            {bidState !== 'accepted' && (
              <Button fullWidth size="L" loading={bidState === 'loading'} onClick={submitBid}>
                Сделать ставку
              </Button>
            )}
            {bidState === 'failed' && (
              <Button fullWidth theme="main_secondary" onClick={() => setBidState('idle')}>
                Попробовать снова
              </Button>
            )}
            <div className={s.simulations}>
              <button type="button" onClick={() => setBidState('failed')}>
                Показать ошибку ответа
              </button>
              <button type="button" onClick={() => setFinished(true)}>
                Показать завершённый аукцион
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function AuctionPage() {
  const [role, setRole] = useState<Role>('seller');
  return (
    <AppShell>
      <PageLayout className={s.page}>
        <Breadcrumbs
          items={[
            { label: 'Главная', to: '/' },
            { label: 'Продажа', to: '/search' },
            { label: 'Аукцион квартиры' },
          ]}
        />
        <section className={s.hero}>
          <div>
            <Badge tone="main">Новый сценарий</Badge>
            <h1>Продажа квартиры на аукционе</h1>
            <p>Пройдите путь продавца или покупателя в мобильном прототипе.</p>
          </div>
          <RoleSwitch role={role} onChange={setRole} />
        </section>
        {role === 'seller' ? (
          <SellerScenario onOpenBuyer={() => setRole('buyer')} />
        ) : (
          <BuyerScenario />
        )}
        <Link className={s.backLink} to="/search">
          ← Вернуться к объявлениям
        </Link>
      </PageLayout>
    </AppShell>
  );
}
