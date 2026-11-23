import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '@/App';
import { METRIKA_COUNTER_ID, reachAuctionGoal } from '@/analytics/metrika';

describe('Auction map and Metrika goals', () => {
  afterEach(() => {
    delete window.ym;
  });

  it('renders the map, the event labels and feature metrics on a dedicated route', () => {
    render(
      <MemoryRouter initialEntries={['/map']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Сценарии аукциона: продавец и покупатель' }),
    ).toBeVisible();
    expect(screen.getByText('auction_seller_publish')).toBeVisible();
    expect(screen.getByText('auction_buyer_bid_error')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Метрики фичи' })).toBeVisible();
    expect(screen.getByText('Успешность ставки')).toBeVisible();
    expect(document.querySelectorAll('iframe')).toHaveLength(13);
    expect(document.querySelector('iframe[src="/auction/seller?map=published"]')).toBeInTheDocument();
    expect(document.querySelector('iframe[src="/auction/apartment?map=finished"]')).toBeInTheDocument();
  });

  it('sends a goal to the stub counter with role and step parameters', () => {
    const ym = vi.fn();
    window.ym = ym;

    reachAuctionGoal('auction_buyer_bid_submit', { role: 'buyer', step: 'bid-submit' });

    expect(ym).toHaveBeenCalledWith(METRIKA_COUNTER_ID, 'reachGoal', 'auction_buyer_bid_submit', {
      role: 'buyer',
      step: 'bid-submit',
    });
  });
});
