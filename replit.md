# American Seekers Academy

## Overview

American Seekers Academy is a full-stack web application for a classical education homeschool co-op. The platform showcases educational programs for children of various ages, allows parents to explore curriculum details, subscribe to newsletters, and suggest new locations for the academy. The site emphasizes a classical education model with American values and civic virtue.

## Brand Guidelines

### Color Palette (Patriotic Family Theme)
- **Navy Primary**: #1e3a5f / hsl(212, 52%, 25%) - Primary brand color
- **Warm Cream**: hsl(40, 33%, 98%) - Background color
- **Vibrant Red**: hsl(352, 80%, 45%) - Secondary accent
- **Gold Accent**: hsl(38, 75%, 45%) - Accent highlights
- **Text**: hsl(210, 50%, 15%) - Dark navy text

### Typography
- **Headings**: Playfair Display (elegant serif, weights 400-800)
- **Body Text**: Inter (clean sans-serif, weights 300-700)
- Fonts loaded via Google Fonts in `client/src/index.css`

### Design System Classes (client/src/index.css)
- `.btn-primary` - Navy gradient button with white text
- `.btn-secondary` - Outlined navy button
- `.btn-accent` - Gold gradient button
- `.card-elegant` - Cards with subtle borders and hover effects
- `.section-divider` - Navy to gold gradient divider
- `.navy-gradient` - Navy gradient for CTA backgrounds

### Brand Voice & Mission
**Mission Statement**: We are aiming to provide homeschool families access to a private, in-person classical education that guarantees parents' right to choose what is best for their child. Our drop off program helps make homeschooling a success for the whole family and cultivates civic virtue while preparing students for a life of freedom and intellectual growth.

**Key Taglines**:
- "Helping others to find peace in the balance of learning and living"
- "Learn Better + Make Friends + Live Well"
- "Find the perfect balance between learning and living"
- "Making homeschooling a success for the whole family"
- "Kids Learn. Parents Heard."

**Core Messaging**:
- A meaningful, human connection with a teacher is an invaluable benefit to a child
- We believe mentors are a necessary attribute of the traditional school model that homeschoolers can greatly benefit from
- Our Hybrid Homeschooling model combines the best aspects of traditional and Classical, in person instruction with the ideal part-time schedule for modern homeschool families
- By decentralizing education, the power goes back to the parents

### Programs (6 Total)
1. **Macaronis** - Ages 6 months to 3 years
2. **Yankee Doodle** - Ages 4-5 (PreK-K)
3. **Tycoons** - Grades 1-2
4. **Seekers** - Grades 3-5
5. **Pioneers** - Grades 6-8
6. **Patriots** - Grades 9-12

### Curriculum Sources
Hillsdale College, Literacy Essentials, IEW, WOL, Dimensions Math, PragerU, MENSA, Tuttle Twins

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite with React plugin
- **Form Handling**: React Hook Form with Zod validation

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` for route components
- Reusable components in `client/src/components/` organized by feature (home, layout, common, ui)
- Shared utilities in `client/src/lib/`
- Custom hooks in `client/src/hooks/`

Path aliases configured:
- `@/*` maps to `client/src/*`
- `@shared/*` maps to `shared/*`

### Backend Architecture

- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful JSON API with `/api` prefix
- **Development**: Vite dev server integration for HMR

The server provides:
- Static file serving in production
- API routes for location suggestions and newsletter subscriptions
- Request logging middleware for API endpoints
- Error handling middleware

### Data Storage

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Neon serverless driver)
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Generated to `./migrations` directory

Current schema includes:
- `users` - Basic user authentication (id, username, password)
- `locationSuggestions` - User-submitted location requests (name, email, location, comments)
- `newsletters` - Email subscriptions (email, createdAt)
- `programInfoRequests` - Program information requests (name, email, phone, programSlug, programName)
- `contactInquiries` - Contact form submissions (name, email, phone, message)
- `blogPosts` - Blog posts (title, slug, excerpt, content, featuredImage, published, publishedAt, createdAt)

The storage layer uses an interface pattern (`IStorage`) with a `DatabaseStorage` implementation for PostgreSQL persistence.

### Blog System

The blog system includes:
- **Routes**: 
  - `/blog` - Public blog listing page showing published posts
  - `/blog/:slug` - Individual blog post page with social sharing buttons
  - `/blog/admin` - Admin page for creating, editing, and publishing posts
- **API Endpoints**:
  - `GET /api/blog` - Get published posts
  - `GET /api/blog/all` - Get all posts (for admin)
  - `GET /api/blog/:slug` - Get single post by slug
  - `POST /api/blog` - Create new post
  - `PUT /api/blog/:id` - Update post
  - `DELETE /api/blog/:id` - Delete post
- **Features**:
  - Rich HTML content support
  - Featured images
  - Draft/Published status
  - Social sharing (Facebook, Twitter/X, LinkedIn)

### Validation

- **Library**: Zod with drizzle-zod integration
- **Pattern**: Schema-first validation using `createInsertSchema` from Drizzle schemas
- **Error Formatting**: zod-validation-error for user-friendly messages

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `@neondatabase/serverless`
- **Connection**: Requires `DATABASE_URL` environment variable

### UI Component Library
- **shadcn/ui**: Comprehensive component library built on Radix UI primitives
- **Configuration**: `components.json` defines paths and styling preferences (new-york style, neutral base color)

### Third-Party Services
- **Font Awesome**: Icon library (via `@fortawesome/fontawesome-free`)
- **Google Fonts**: Playfair Display and Inter fonts
- **Lucide React**: Icon library for UI icons

### Key NPM Packages
- `drizzle-kit`: Database migrations and schema management
- `express-session` with `connect-pg-simple`: Session management
- `embla-carousel-react`: Carousel component
- `react-day-picker`: Date picker component
- `vaul`: Drawer component
- `recharts`: Charting library