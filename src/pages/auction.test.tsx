import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';

function openAuction() {
  return render(
    <MemoryRouter initialEntries={['/auction']}>
      <App />
    </MemoryRouter>,
  );
}

describe('Auction scenario', () => {
  it('lets a seller validate conditions and publish an auction', async () => {
    openAuction();
    await userEvent.click(screen.getByRole('button', { name: 'Проверить условия' }));
    expect(screen.getByRole('heading', { name: 'Проверьте условия' })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Опубликовать аукцион' }));
    expect(screen.getByText('Аукцион опубликован')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Открыть как покупатель' }));
    expect(screen.getByText('Текущая ставка')).toBeVisible();
  });

  it('validates a low bid and presents failure and finished states', async () => {
    openAuction();
    await userEvent.click(screen.getByRole('button', { name: 'Покупатель' }));
    await userEvent.type(screen.getByLabelText('Ваша ставка, ₽'), '20000000');
    await userEvent.click(screen.getByRole('button', { name: 'Сделать ставку' }));
    expect(screen.getByText(/Минимальная ставка/)).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Показать ошибку ответа' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Не удалось отправить ставку');
    await userEvent.click(screen.getByRole('button', { name: 'Показать завершённый аукцион' }));
    expect(screen.getByRole('heading', { name: 'Аукцион завершён' })).toBeVisible();
  });

  it('shows an accepted bid after the local response delay', async () => {
    openAuction();
    await userEvent.click(screen.getByRole('button', { name: 'Покупатель' }));
    await userEvent.type(screen.getByLabelText('Ваша ставка, ₽'), '20200000');
    await userEvent.click(screen.getByRole('button', { name: 'Сделать ставку' }));
    expect(screen.getByRole('button', { name: /Сделать ставку/ })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await waitFor(() => expect(screen.getByText('Ставка принята')).toBeVisible());
  });
});
