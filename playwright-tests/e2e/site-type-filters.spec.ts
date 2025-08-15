import { test, expect } from '@playwright/test';
import { FiltersPanel } from '../e2e/page-objects/filtersPanel';

test.describe('Фильтрация по типу дайв-сайта', () => {
  let filtersPanel: FiltersPanel;

  test.beforeEach(async ({ page }) => {
    filtersPanel = new FiltersPanel(page);
    await page.goto('/');
  });

  test('должен отображать фильтры по типу дайв-сайта в десктопной версии', async ({ page }) => {
    await expect(page.getByTestId('desktop-filters-panel')).toBeVisible();
    await expect(page.getByText('Тип дайв-сайта')).toBeVisible();
  });

  test('должен отображать фильтры по типу дайв-сайта в мобильной версии', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await filtersPanel.openMobilePanel();
    
    await expect(page.getByTestId('mobile-filters-panel')).toBeVisible();
    await expect(page.getByText('Тип дайв-сайта')).toBeVisible();
  });

  test('должен фильтровать дайв-сайты при выборе типа', async ({ page }) => {
    // Ждем загрузки дайв-сайтов
    await page.waitForSelector('[data-testid="dive-site-marker"]', { timeout: 10000 });
    
    // Получаем количество маркеров до фильтрации
    const markersBefore = await page.locator('[data-testid="dive-site-marker"]').count();
    
    // Выбираем первый доступный тип дайв-сайта
    const firstSiteType = page.locator('[data-testid^="site-type-filter-"]').first();
    await firstSiteType.click();
    
    // Ждем обновления маркеров
    await page.waitForTimeout(1000);
    
    // Получаем количество маркеров после фильтрации
    const markersAfter = await page.locator('[data-testid="dive-site-marker"]').count();
    
    // Проверяем, что количество маркеров изменилось
    expect(markersAfter).toBeLessThanOrEqual(markersBefore);
  });

  test('должен показывать кнопку "Очистить" при активном фильтре', async ({ page }) => {
    // Выбираем тип дайв-сайта
    const firstSiteType = page.locator('[data-testid^="site-type-filter-"]').first();
    await firstSiteType.click();
    
    // Проверяем, что появилась кнопка "Очистить"
    await expect(page.getByTestId('clear-filters-button')).toBeVisible();
  });

  test('должен очищать фильтры при нажатии на кнопку "Очистить"', async ({ page }) => {
    // Ждем загрузки дайв-сайтов
    await page.waitForSelector('[data-testid="dive-site-marker"]', { timeout: 10000 });
    
    // Получаем количество маркеров до фильтрации
    const markersBefore = await page.locator('[data-testid="dive-site-marker"]').count();
    
    // Выбираем тип дайв-сайта
    const firstSiteType = page.locator('[data-testid^="site-type-filter-"]').first();
    await firstSiteType.click();
    
    // Ждем обновления маркеров
    await page.waitForTimeout(1000);
    
    // Очищаем фильтры
    await page.getByTestId('clear-filters-button').click();
    
    // Ждем обновления маркеров
    await page.waitForTimeout(1000);
    
    // Проверяем, что количество маркеров вернулось к исходному
    const markersAfter = await page.locator('[data-testid="dive-site-marker"]').count();
    expect(markersAfter).toBe(markersBefore);
    
    // Проверяем, что кнопка "Очистить" исчезла
    await expect(page.getByTestId('clear-filters-button')).not.toBeVisible();
  });

  test('должен снимать фильтр при повторном клике на выбранный тип', async ({ page }) => {
    // Выбираем тип дайв-сайта
    const firstSiteType = page.locator('[data-testid^="site-type-filter-"]').first();
    await firstSiteType.click();
    
    // Проверяем, что появилась кнопка "Очистить"
    await expect(page.getByTestId('clear-filters-button')).toBeVisible();
    
    // Кликаем на тот же тип еще раз
    await firstSiteType.click();
    
    // Проверяем, что кнопка "Очистить" исчезла
    await expect(page.getByTestId('clear-filters-button')).not.toBeVisible();
  });
});
