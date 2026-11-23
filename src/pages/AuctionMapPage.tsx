import { Link } from 'react-router-dom';
import { METRIKA_COUNTER_ID, type AuctionGoal, type AuctionRole } from '@/analytics/metrika';
import { Badge, Icon } from '@/ui';
import { AppShell, PageLayout } from '@/components/Layout';
import s from './AuctionMapPage.module.css';

type Screen = {
  title: string;
  detail: string;
  goal: AuctionGoal;
  step: string;
  path: string;
  state?: 'success' | 'warning' | 'error';
};

type Transition = {
  label: string;
  goal: AuctionGoal;
  step: string;
};

const sellerFlow: { screen: Screen; transition?: Transition }[] = [
  {
    screen: {
      title: 'Выбор объявления',
      detail: 'Продажа → Жилая → Квартира',
      goal: 'auction_seller_home_view',
      step: 'placement',
      path: '/auction/place',
    },
    transition: {
      label: 'Выбрать квартиру',
      goal: 'auction_seller_placement_choice',
      step: 'placement-choice',
    },
  },
  {
    screen: {
      title: 'Мои объявления',
      detail: 'Квартира собственника',
      goal: 'auction_seller_listing_view',
      step: 'listing',
      path: '/auction/seller',
    },
    transition: {
      label: 'Продать на аукционе',
      goal: 'auction_seller_choose_auction',
      step: 'sale-method',
    },
  },
  {
    screen: {
      title: 'Условия аукциона',
      detail: 'Цена · шаг · срок',
      goal: 'auction_seller_conditions_view',
      step: 'conditions',
      path: '/auction/seller?map=conditions',
    },
    transition: {
      label: 'Проверить условия',
      goal: 'auction_seller_review_open',
      step: 'review',
    },
  },
  {
    screen: {
      title: 'Проверка',
      detail: 'Сводка условий',
      goal: 'auction_seller_review_view',
      step: 'review',
      path: '/auction/seller?map=review',
    },
    transition: {
      label: 'Опубликовать аукцион',
      goal: 'auction_seller_publish',
      step: 'publish',
    },
  },
  {
    screen: {
      title: 'Аукцион опубликован',
      detail: 'Лот доступен покупателям',
      goal: 'auction_seller_published_view',
      step: 'published',
      path: '/auction/seller?map=published',
      state: 'success',
    },
  },
];

const buyerFlow: { screen: Screen; transition?: Transition }[] = [
  {
    screen: {
      title: 'Главная',
      detail: 'Рекомендация с меткой «Аукцион»',
      goal: 'auction_buyer_home_view',
      step: 'home',
      path: '/auction',
    },
    transition: {
      label: 'Открыть поиск',
      goal: 'auction_buyer_search_view',
      step: 'search',
    },
  },
  {
    screen: {
      title: 'Поиск и рекомендации',
      detail: 'Карточка с меткой «Аукцион»',
      goal: 'auction_buyer_search_view',
      step: 'search',
      path: '/auction/search',
    },
    transition: {
      label: 'Открыть квартиру',
      goal: 'auction_buyer_listing_open',
      step: 'listing-open',
    },
  },
  {
    screen: {
      title: 'Карточка квартиры',
      detail: 'Условия и текущая ставка',
      goal: 'auction_buyer_listing_view',
      step: 'listing',
      path: '/auction/apartment',
    },
    transition: {
      label: 'Сделать ставку',
      goal: 'auction_buyer_bid_submit',
      step: 'bid-submit',
    },
  },
  {
    screen: {
      title: 'Отправляем ставку',
      detail: 'Ожидание ответа',
      goal: 'auction_buyer_bid_pending',
      step: 'bid-pending',
      path: '/auction/apartment?map=pending',
      state: 'warning',
    },
    transition: {
      label: 'Ставка принята',
      goal: 'auction_buyer_bid_accepted',
      step: 'bid-accepted',
    },
  },
  {
    screen: {
      title: 'Ставка лидирует',
      detail: 'Новая текущая цена',
      goal: 'auction_buyer_bid_accepted',
      step: 'bid-accepted',
      path: '/auction/apartment?map=accepted',
      state: 'success',
    },
  },
];

const buyerExceptions: Screen[] = [
  {
    title: 'Ставка ниже минимума',
    detail: 'Показать допустимую сумму',
    goal: 'auction_buyer_bid_below_min',
    step: 'bid-validation',
    path: '/auction/apartment?map=below-min',
    state: 'error',
  },
  {
    title: 'Ошибка ответа',
    detail: 'Оставить сумму и дать повторить',
    goal: 'auction_buyer_bid_error',
    step: 'bid-error',
    path: '/auction/apartment?map=error',
    state: 'error',
  },
  {
    title: 'Аукцион завершён',
    detail: 'Победившая ставка или нет ставок',
    goal: 'auction_buyer_auction_finished',
    step: 'finished',
    path: '/auction/apartment?map=finished',
    state: 'success',
  },
];

function EventLabel({ goal, role, step }: { goal: AuctionGoal; role: AuctionRole; step: string }) {
  return (
    <span className={s.eventLabel}>
      <b>{goal}</b>
      <span>
        role={role} · step={step}
      </span>
    </span>
  );
}

function ScreenCard({ screen, role }: { screen: Screen; role: AuctionRole }) {
  return (
    <article className={`${s.screenCard} ${screen.state ? s[screen.state] : ''}`}>
      <div className={s.screenTopline}>
        <span className={s.phoneCamera} aria-hidden="true" />
        <small>Экран</small>
      </div>
      <h3>{screen.title}</h3>
      <p>{screen.detail}</p>
      <div className={s.prototypeFrame} aria-hidden="true">
        <iframe src={screen.path} title="" tabIndex={-1} />
      </div>
      <EventLabel goal={screen.goal} role={role} step={screen.step} />
    </article>
  );
}

function Flow({ role, items }: { role: AuctionRole; items: { screen: Screen; transition?: Transition }[] }) {
  return (
    <div className={s.flow}>
      {items.map(({ screen, transition }) => (
        <div className={s.flowUnit} key={screen.title}>
          <ScreenCard screen={screen} role={role} />
          {transition && (
            <div className={s.arrow}>
              <EventLabel goal={transition.goal} role={role} step={transition.step} />
              <Icon name="ActionChevronRight16" size={24} />
              <span>{transition.label}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const metrics = [
  {
    metric: 'Публикация продавцом',
    calculation:
      'Уникальные сессии с auction_seller_publish ÷ сессии с auction_seller_placement_start',
    target: '≥ 45%',
  },
  {
    metric: 'Переход к проверке условий',
    calculation: 'auction_seller_review_open ÷ auction_seller_conditions_view',
    target: '≥ 70%',
  },
  {
    metric: 'Намерение сделать ставку',
    calculation: 'auction_buyer_bid_submit ÷ auction_buyer_listing_view',
    target: '≥ 18%',
  },
  {
    metric: 'Успешность ставки',
    calculation: 'auction_buyer_bid_accepted ÷ auction_buyer_bid_submit',
    target: '≥ 92%',
  },
  {
    metric: 'Понятность минимальной суммы',
    calculation: 'auction_buyer_bid_below_min ÷ auction_buyer_bid_submit',
    target: '≤ 8%',
  },
  {
    metric: 'Технические ошибки ставки',
    calculation: 'auction_buyer_bid_error ÷ auction_buyer_bid_submit',
    target: '≤ 3%',
  },
];

export function AuctionMapPage() {
  return (
    <AppShell>
      <PageLayout className={s.page}>
        <Link className={s.back} to="/auction">
          ← Открыть прототип аукциона
        </Link>
        <section className={s.hero}>
          <div>
            <Badge tone="main">Аналитическая карта</Badge>
            <h1>Сценарии аукциона: продавец и покупатель</h1>
            <p>
              Экран — событие просмотра, стрелка — цель действия. Все цели отправляются с
              параметрами <code>role</code> и <code>step</code>.
            </p>
          </div>
          <aside className={s.counter}>
            <small>Яндекс Метрика</small>
            <strong>№ {METRIKA_COUNTER_ID}</strong>
            <span>Заглушка для прототипа</span>
          </aside>
        </section>

        <section className={s.mapSection} aria-labelledby="seller-flow">
          <div className={s.sectionHeading}>
            <span className={s.roleBadge}>Продавец</span>
            <h2 id="seller-flow">Разместить квартиру на аукционе</h2>
          </div>
          <div className={s.placementNote}>
            <EventLabel goal="auction_seller_placement_start" role="seller" step="placement" />
            <span>Старт размещения: «Разместить» → «Продажа» → «Жилая» → «Квартира»</span>
            <EventLabel
              goal="auction_seller_placement_choice"
              role="seller"
              step="placement-choice"
            />
          </div>
          <Flow role="seller" items={sellerFlow} />
        </section>

        <section className={s.mapSection} aria-labelledby="buyer-flow">
          <div className={s.sectionHeading}>
            <span className={`${s.roleBadge} ${s.buyerBadge}`}>Покупатель</span>
            <h2 id="buyer-flow">Найти квартиру и сделать ставку</h2>
          </div>
          <Flow role="buyer" items={buyerFlow} />
          <div className={s.exceptionRow}>
            <div className={s.branchArrow}>
              <span>альтернативные состояния после отправки ставки</span>
              <span>↓</span>
            </div>
            {buyerExceptions.map((screen) => (
              <ScreenCard key={screen.title} screen={screen} role="buyer" />
            ))}
          </div>
        </section>

        <section className={s.metrics} aria-labelledby="metrics-heading">
          <div className={s.metricsIntro}>
            <Badge tone="positive">Проверка гипотезы</Badge>
            <h2 id="metrics-heading">Метрики фичи</h2>
            <p>
              Значения ниже — условные ориентиры для первого двухнедельного теста. Считаем по
              уникальным сессиям, отфильтрованным по <code>role</code> и <code>step</code>.
            </p>
          </div>
          <div className={s.metricTableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Целевой показатель</th>
                  <th>Как считаем из целей</th>
                  <th>Условная цель</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((item) => (
                  <tr key={item.metric}>
                    <th scope="row">{item.metric}</th>
                    <td>{item.calculation}</td>
                    <td>
                      <strong>{item.target}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </PageLayout>
    </AppShell>
  );
}
