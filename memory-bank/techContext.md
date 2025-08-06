# Technical Context

## Development Environment
- **OS**: macOS (Darwin)
- **Node.js**: Required for Next.js development
- **Package Manager**: pnpm@10.14.0
- **Editor**: Cursor IDE

## Key Dependencies
### Core Framework
- Next.js 15.4.2 (React framework)
- React 19.1.0 (UI library)
- TypeScript 5.8.3 (Type safety)

### Database & Backend
- Supabase (Database and backend services)
- @supabase/supabase-js 2.52.0 (Client library)
- @supabase/ssr 0.6.1 (Server-side rendering)

### Internationalization
- i18next 25.3.2 (Internationalization framework)
- react-i18next 15.6.1 (React integration)
- i18next-browser-languagedetector 8.2.0 (Language detection)

### Development Tools
- ESLint (Code linting)
- Prettier (Code formatting)
- TypeScript (Type checking)

## Project Architecture
- **App Router**: Next.js 13+ app directory structure
- **API Routes**: Server-side API endpoints in `/src/app/api`
- **Database**: Supabase for data storage and real-time features
- **Type Safety**: Full TypeScript implementation

## Build & Development Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
