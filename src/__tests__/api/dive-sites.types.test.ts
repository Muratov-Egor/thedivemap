import { describe, it, expect } from 'vitest';
import type { Site, Country, SiteType, Difficulty, SiteWithDetails } from '@/types/database';

describe('API Types Validation', () => {
  it('должен правильно типизировать объект Site', () => {
    const site: Site = {
      id: 'b1ac03ab-d766-4606-83a8-37f86eda9d3f',
      name: 'Homerun Reef',
      description: '',
      latitude: 7.614699,
      longitude: 98.379049,
      country_id: 170,
      depth_max: 24,
      visibility: 10,
      info_links: ['https://www.idcphuket.com/scuba-diving/homerun-reef-racha-yai/'],
      dive_center_links: ['https://seastar.pro/'],
      created_at: '2025-07-06T10:08:05.809658+00:00',
      rating: 4,
      site_type_id: 1,
      difficulty_id: 1,
      status: 'published',
    };

    expect(site.id).toBe('b1ac03ab-d766-4606-83a8-37f86eda9d3f');
    expect(site.name).toBe('Homerun Reef');
    expect(site.status).toBe('published');
    expect(typeof site.latitude).toBe('number');
    expect(typeof site.longitude).toBe('number');
    expect(Array.isArray(site.info_links)).toBe(true);
    expect(Array.isArray(site.dive_center_links)).toBe(true);
  });

  it('должен правильно типизировать объект Country', () => {
    const country: Country = {
      id: 1,
      name_en: 'Australia',
      name_ru: 'Австралия',
      region_id: 1,
      iso_code: 'AU',
    };

    expect(country.id).toBe(1);
    expect(country.name_en).toBe('Australia');
    expect(country.name_ru).toBe('Австралия');
    expect(country.iso_code).toBe('AU');
  });

  it('должен правильно типизировать объект SiteType', () => {
    const siteType: SiteType = {
      id: 1,
      label_en: 'Reef',
      label_ru: 'Риф',
    };

    expect(siteType.id).toBe(1);
    expect(siteType.label_en).toBe('Reef');
    expect(siteType.label_ru).toBe('Риф');
  });

  it('должен правильно типизировать объект Difficulty', () => {
    const difficulty: Difficulty = {
      id: 2,
      label_en: 'Beginner',
      label_ru: 'Новичок',
    };

    expect(difficulty.id).toBe(2);
    expect(difficulty.label_en).toBe('Beginner');
    expect(difficulty.label_ru).toBe('Новичок');
  });

  it('должен правильно типизировать объект SiteWithDetails', () => {
    const siteWithDetails: SiteWithDetails = {
      id: 'b1ac03ab-d766-4606-83a8-37f86eda9d3f',
      name: 'Homerun Reef',
      description: '',
      latitude: 7.614699,
      longitude: 98.379049,
      country_id: 170,
      depth_max: 24,
      visibility: 10,
      info_links: ['https://www.idcphuket.com/scuba-diving/homerun-reef-racha-yai/'],
      dive_center_links: ['https://seastar.pro/'],
      created_at: '2025-07-06T10:08:05.809658+00:00',
      rating: 4,
      site_type_id: 1,
      difficulty_id: 1,
      status: 'published',
      country: {
        id: 170,
        name_en: 'Thailand',
        name_ru: 'Таиланд',
        iso_code: 'TH',
        region_id: 2,
      },
      site_type: {
        id: 1,
        label_en: 'Reef',
        label_ru: 'Риф',
      },
      difficulty: {
        id: 1,
        label_en: 'Beginner',
        label_ru: 'Новичок',
      },
    };

    expect(siteWithDetails.id).toBe('b1ac03ab-d766-4606-83a8-37f86eda9d3f');
    expect(siteWithDetails.country?.name_en).toBe('Thailand');
    expect(siteWithDetails.site_type?.label_en).toBe('Reef');
    expect(siteWithDetails.difficulty?.label_en).toBe('Beginner');
  });

  it('должен проверять валидность статуса сайта', () => {
    const validStatuses: Site['status'][] = ['draft', 'published', 'rejected'];

    validStatuses.forEach((status) => {
      expect(['draft', 'published', 'rejected']).toContain(status);
    });
  });

  it('должен проверять структуру координат', () => {
    const site: Site = {
      id: 'b1ac03ab-d766-4606-83a8-37f86eda9d3f',
      name: 'Test Site',
      description: 'Test description',
      latitude: -90, // Минимальная широта
      longitude: -180, // Минимальная долгота
      country_id: 1,
      depth_max: 30,
      visibility: 25,
      info_links: [],
      dive_center_links: [],
      rating: 4.5,
      site_type_id: 1,
      difficulty_id: 2,
      status: 'published',
      created_at: '2025-07-06T10:08:05.809658+00:00',
    };

    expect(site.latitude).toBeGreaterThanOrEqual(-90);
    expect(site.latitude).toBeLessThanOrEqual(90);
    expect(site.longitude).toBeGreaterThanOrEqual(-180);
    expect(site.longitude).toBeLessThanOrEqual(180);
  });
});
