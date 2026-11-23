"""Capture unchanged prototype screens for the approved 15-second storyboard."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'screens'
OUT.mkdir(exist_ok=True)
BASE = os.environ.get('PROTOTYPE_URL', 'http://127.0.0.1:5177')

with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome')
    page = browser.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
    page.clock.install(time=__import__('datetime').datetime(2026, 11, 23, 12))
    def shot(name):
        page.evaluate('document.fonts.ready')
        page.locator('img').evaluate_all('(imgs) => Promise.all(imgs.map(i => i.decode().catch(() => {})))')
        page.screenshot(path=str(OUT / f'{name}.png'), animations='disabled')
    page.goto(BASE + '/auction/seller?map=conditions')
    page.get_by_role('heading', name='Настройте аукцион').wait_for()
    page.locator('[class*="formCard"]').scroll_into_view_if_needed()
    shot('conditions')
    page.get_by_role('button', name='Проверить условия', exact=True).click()
    page.get_by_role('heading', name='Проверьте условия', exact=True).wait_for()
    shot('review')
    page.get_by_role('button', name='Опубликовать аукцион', exact=True).click()
    shot('published')
    page.get_by_role('button', name='Посмотреть объявление', exact=True).click()
    page.evaluate('window.scrollTo(0, 0)')
    shot('apartment')
    field = page.get_by_label('Ваша ставка, ₽')
    page.locator('[class*="bidCard"]').scroll_into_view_if_needed()
    shot('bid')
    for n in range(1, 9):
        field.fill('20200000'[:n])
        shot(f'type-{n}')
    page.get_by_role('button', name='Сделать ставку', exact=True).click()
    shot('pending')
    page.clock.run_for(800)
    shot('accepted')
    print(page.get_by_text('Ставка принята', exact=True).inner_text())
    browser.close()
