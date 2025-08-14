# Memory Bank: Project Brief

## Project Overview

**Project Name**: The Dive Map  
**Description**: Interactive map application for dive sites worldwide  
**Technology Stack**: Next.js 15.4.2, React 19.1.0, TypeScript, Tailwind CSS, Supabase  
**Package Manager**: pnpm  
**Testing**: Playwright (E2E), Jest (Unit)

## Current Development Focus

### Primary: Modern UI/UX Implementation (Level 3)
**Status**: IMPLEMENT Mode - Phase 1: Foundation  
**Goal**: Transform the application with modern design system and enhanced user experience

### Secondary: Autocomplete Component (Level 2)
**Status**: PLAN Mode - Planning Phase  
**Goal**: Create a modern autocomplete component for search functionality

## Autocomplete Component Requirements

### Functional Requirements
- Search across 4 data types: sites, countries, regions, locations
- Real-time search with debouncing
- Keyboard navigation support
- Mobile-responsive design
- Accessibility compliance (WCAG AA)

### Technical Requirements
- Integration with `/api/places/` endpoint
- TypeScript implementation
- Tailwind CSS styling
- i18n support (ru/en)
- Performance optimization

### Design Requirements
- Match existing design system
- Use tropical color palette
- Implement glassmorphism effects
- Smooth animations and transitions

## API Integration

**Endpoint**: `/api/places/`  
**Method**: GET  
**Parameters**: 
- `q` (required): Search query
- `lang` (optional): Language ('ru' | 'en', default: 'ru')

**Response Structure**:
```typescript
{
  sites: Array<{
    id: number,
    name: string,
    country: { name: string, region: { name: string } },
    site_type: { label: string },
    site_locations: Array<{ location: { name: string } }>
  }>,
  countries: Array<{ id: number, name: string, iso_code: string }>,
  regions: Array<{ id: number, name: string }>,
  locations: Array<{ id: number, name: string, country_id: number, region_id: number }>,
  errors: { countries: string | null, regions: string | null, locations: string | null }
}
```

## Success Criteria

### Functional
- [ ] Search works across all 4 data types
- [ ] Real-time results with debouncing
- [ ] Keyboard navigation (arrow keys, enter, escape)
- [ ] Mobile touch support
- [ ] Accessibility features (screen reader support)

### Technical
- [ ] TypeScript implementation
- [ ] Performance optimized (debouncing, memoization)
- [ ] Error handling for API failures
- [ ] Loading states
- [ ] Unit tests coverage

### Design
- [ ] Matches existing design system
- [ ] Responsive design
- [ ] Smooth animations
- [ ] Consistent with tropical theme

## Constraints

- Must integrate with existing component architecture
- Must maintain performance with large datasets
- Must support both Russian and English languages
- Must be accessible according to WCAG AA standards
