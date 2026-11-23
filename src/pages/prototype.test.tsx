import { render, screen, waitFor, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';
import { filterListings, listings } from '@/data/listings';

beforeEach(() => {
  window.localStorage.clear();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
function open(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}
describe('Prototype scenarios', () => {
  it('searches, filters, sorts and returns from detail without losing filters', async () => {
    open();
    await userEvent.type(screen.getByLabelText('Город, район или метро'), 'Сокольники');
    await userEvent.click(screen.getByRole('button', { name: 'Найти квартиру' }));
    expect(await screen.findByText('Найдено 2 объявления')).toBeVisible();
    await userEvent.selectOptions(screen.getByLabelText('Комнатность'), '2');
    await userEvent.type(screen.getByLabelText('Цена до, ₽'), '20000000');
    await userEvent.click(screen.getByRole('button', { name: 'Показать' }));
    expect(await screen.findByText('Найдено 1 объявление')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Показать' }));
    expect(await screen.findByText('Найдено 1 объявление')).toBeVisible();
    await userEvent.selectOptions(screen.getByLabelText('Сортировка'), 'price-asc');
    await userEvent.click(
      await screen.findByRole('link', { name: '2-комн. квартира, 54 м², 7/17 этаж' }),
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('54 м²');
    await userEvent.click(screen.getByRole('link', { name: '← К результатам поиска' }));
    expect(await screen.findByText('Найдено 1 объявление')).toBeVisible();
    expect(screen.getByLabelText('Город, район или метро')).toHaveValue('Сокольники');
    expect(screen.getByLabelText('Цена до, ₽')).toHaveValue(20000000);
    expect(screen.getByLabelText('Сортировка')).toHaveValue('price-asc');
  });
  it('persists favorites and updates header and filtered results together', async () => {
    open('/listing/1');
    await userEvent.click(
      screen.getByRole('button', { name: 'В избранное: Светлая квартира рядом с парком' }),
    );
    expect(screen.getByRole('link', { name: 'Избранное: 1' })).toBeVisible();
    cleanup();
    open('/search?favorites=1');
    expect(await screen.findByText('Найдено 1 объявление')).toBeVisible();
    await userEvent.click(
      screen.getByRole('button', { name: 'Убрать из избранного: Светлая квартира рядом с парком' }),
    );
    expect(screen.getByRole('heading', { name: 'Здесь будут избранные квартиры' })).toBeVisible();
  });
  it('recovers from error with the original query intact', async () => {
    open('/search?q=Сокольники&state=error');
    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить');
    await userEvent.click(screen.getByRole('button', { name: 'Попробовать снова' }));
    expect(await screen.findByText('Найдено 2 объявления')).toBeVisible();
    expect(screen.getByLabelText('Город, район или метро')).toHaveValue('Сокольники');
  });
  it('offers a route out of empty results and handles unknown listings', async () => {
    open('/search?q=НесуществующийРайон');
    expect(
      await screen.findByRole('heading', { name: 'По вашему запросу ничего не найдено' }),
    ).toBeVisible();
    await userEvent.click(screen.getByRole('link', { name: 'Показать все квартиры' }));
    expect(await screen.findByText('Найдено 8 объявлений')).toBeVisible();
    cleanup();
    open('/listing/unknown');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Этой страницы пока нет');
  });
  it('changes gallery photos and submits a local contact scenario', async () => {
    open('/listing/1');
    await userEvent.click(screen.getByRole('button', { name: 'Фото 2' }));
    expect(screen.getByRole('button', { name: 'Фото 2' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Связаться с продавцом' }));
    const dialog = screen.getByRole('dialog');
    await userEvent.type(within(dialog).getByLabelText('Ваше имя'), 'Дизайнер');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Отправить сообщение' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('status')).toHaveTextContent('Сообщение сохранено в прототипе');
  });
});
describe('Listing selection', () => {
  it('combines studio, budget and favorites filters without mutating fixtures', () => {
    const original = listings.map((x) => x.id);
    expect(
      filterListings(listings, new URLSearchParams('rooms=0&maxPrice=10000000&favorites=1'), [
        '5',
      ]).map((x) => x.id),
    ).toEqual(['5']);
    const sorted = filterListings(listings, new URLSearchParams('sort=price-asc'), []);
    expect(sorted[0].id).toBe('5');
    expect(listings.map((x) => x.id)).toEqual(original);
  });
});
