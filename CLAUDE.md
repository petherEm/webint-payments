# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PaymentCharts v2 is a financial markets tracking application built with Next.js 15, featuring real-time stock market data visualization, user authentication, AI-powered email personalization, and content management. The application integrates TradingView widgets for market data display, uses Better Auth for authentication with MongoDB as the data store, and Sanity CMS for managing blog/article content with live preview capabilities.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint on the codebase
- `npm run typegen` - Extract Sanity schema and generate TypeScript types

### Environment Variables Required
The application requires the following environment variables (check `.env` file):
- `MONGODB_URI` - MongoDB connection string
- `BETTER_AUTH_SECRET` - Secret for Better Auth session encryption
- `BETTER_AUTH_URL` - Base URL for Better Auth (typically http://localhost:3000 in dev)
- `OPENAI_API_KEY` - OpenAI API key for Inngest AI functions
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset name (typically 'production' or 'development')
- `NEXT_PUBLIC_SANITY_API_VERSION` - Sanity API version (defaults to '2025-10-21')
- `SANITY_API_READ_TOKEN` - Sanity API token for reading content (required for live content)

## Architecture

### App Structure
The project uses Next.js 15 App Router with route groups:
- `(auth)` - Authentication routes (`/sign-in`, `/sign-up`)
- `(root)` - Main application routes (requires authentication via middleware)
  - `/` - Dashboard with market overview
  - `/search` - Stock search page
  - `/articles` - Articles/blog page (placeholder, Sanity integration in progress)
  - `/crypto` - Cryptocurrency market page
  - `/forex` - Forex market page
- `studio/[[...tool]]` - Sanity Studio CMS (mounted at `/studio`)
- `api/inngest` - Inngest background job endpoint
- `draft-mode` - Draft mode routes for Sanity live preview

### Authentication Flow
- **Better Auth** is used for authentication with MongoDB adapter
- Auth instance is initialized lazily in `src/lib/better-auth/auth.ts` via `getAuth()` function
- The auth instance is cached globally to prevent re-initialization
- Email/password authentication is enabled with auto sign-in after signup
- Middleware (`src/middleware/index.ts`) protects all routes except auth pages, API routes, and static assets
- Session validation uses `getSessionCookie()` from Better Auth

### Database Connection
MongoDB connection is managed in `src/database/mongoose.ts` with:
- Global caching to prevent multiple connections in serverless environments
- Connection promise caching to avoid race conditions
- Designed specifically for Next.js serverless functions
- Returns cached connection if available, otherwise creates and caches new connection

### Background Jobs (Inngest)
- **Inngest** handles background tasks and AI-powered email generation
- Client initialized in `src/lib/inngest/client.ts` with OpenAI integration
- Functions defined in `src/lib/inngest/functions.ts`
- Current function: `sendSignUpEmail` - Triggered on `app/user.created` event
  - Uses OpenAI GPT-4o-mini to generate personalized welcome email content
  - Takes user profile data (country, investment goals, risk tolerance, preferred industry)
  - Sends via Nodemailer after AI content generation
- Inngest endpoint served at `/api/inngest/route.ts` (supports GET, POST, PUT)

### Server Actions
Server actions in `src/lib/actions/auth.actions.ts`:
- `signUpWithEmail` - Creates user account and triggers Inngest event for welcome email
- `signInWithEmail` - Authenticates user with Better Auth
- `signOut` - Signs user out and clears session

All server actions are marked with `"use server"` directive.

### TradingView Integration
Multiple pre-configured TradingView widgets in `src/lib/constants.ts`:
- `MARKET_OVERVIEW_WIDGET_CONFIG` - Multi-tab market overview (Financial, Technology, Services)
- `HEATMAP_WIDGET_CONFIG` - S&P 500 heatmap by sector
- `TOP_STORIES_WIDGET_CONFIG` - Market news feed
- `MARKET_DATA_WIDGET_CONFIG` - Detailed stock data tables
- `SYMBOL_INFO_WIDGET_CONFIG(symbol)` - Single symbol info card
- `CANDLE_CHART_WIDGET_CONFIG(symbol)` - Candlestick chart for symbol
- `BASELINE_WIDGET_CONFIG(symbol)` - Baseline chart for symbol
- `TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)` - Technical indicators
- `COMPANY_PROFILE_WIDGET_CONFIG(symbol)` - Company information
- `COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)` - Financial statements

All widgets are configured for dark mode with consistent theming (`colorTheme: 'dark'`, `backgroundColor: '#141414'`).

The `useTradingViewWidget` hook (`src/hooks/useTradingViewWidget.ts`) handles dynamic widget injection into the DOM.

### Content Management (Sanity CMS)
The application integrates **Sanity CMS** for managing blog/article content:

#### Sanity Studio
- Accessible at `/studio` route (`src/app/studio/[[...tool]]/page.tsx`)
- Configured in `sanity.config.ts` with basePath '/studio'
- Includes Vision plugin for GROQ query testing
- Uses custom structure configuration from `src/sanity/structure.ts`

#### Content Schema Types
Located in `src/sanity/schemaTypes/`:
- **postType** (`postType.ts`) - Blog post schema with:
  - Content group: title, slug, author reference, body (blockContent)
  - Media group: mainImage with hotspot and alt text
  - Settings group: categories, publishedAt, isFeatured flag, readingTime
  - Organized into 3 tab groups for better content editing experience
  - Note: SEO field removed (can be re-added later with proper schema definition)
- **authorType** (`authorType.ts`) - Author profile schema with:
  - name, slug, image, bio (rich text array)
  - Social links: linkedin, github
  - Job title field
- **categoryType** (`categoryType.ts`) - Content categories with title, slug, description
- **blockContentType** (`blockContentType.ts`) - Rich text editor configuration with:
  - Text styles: Normal, H1-H4, Blockquote
  - Text decorations: Strong, Emphasis, Code (inline)
  - Lists: Bullet points
  - Annotations: URL links
  - Image embedding with hotspot support
  - Note: Advanced code blocks removed (Sanity's default 'code' type not available without custom schema)

#### Sanity Queries
Located in `src/sanity/lib/queries/`:
- **getAllPosts** (`getAllPosts.ts`) - Fetches all posts with author, categories, excerpt (generated from body), sorted by publishedAt descending
  - Uses `pt::text()` to extract plain text from portable text body
  - Generates 200-character excerpt with ellipsis
- **getPostBySlug** (`getPostBySlug.ts`) - Fetches single post by slug

#### Sanity Configuration
- **Client** (`src/sanity/lib/client.ts`) - Sanity client instance with project configuration
- **Live Content** (`src/sanity/lib/live.ts`) - Real-time content updates using Sanity's experimental live API
  - Exports `sanityFetch` for queries and `SanityLive` component
  - Uses experimental 'vX' API version for live content features
  - Requires `SANITY_API_READ_TOKEN` for both server and browser
- **Image Helper** (`src/sanity/lib/image.ts`) - Image URL builder for Sanity images
- **Environment** (`src/sanity/env.ts`) - Environment variable validation and exports

#### Draft Mode & Live Preview
- Draft mode routes in `src/app/draft-mode/` for content preview
- Visual editing component (`src/components/VisualEditing.tsx`) for in-Studio editing
- Enables content creators to preview unpublished changes

#### Articles Page Implementation
The articles page uses a **hybrid architecture** (Server + Client Components):

**Server Component** (`src/app/(root)/articles/page.tsx`):
- Fetches all posts from Sanity using `getAllPosts()`
- Server-side data fetching for SEO and performance
- Passes data to client component

**Client Component** (`src/app/(root)/articles/ArticlesClient.tsx`):
- Handles interactive features (search, tag filtering)
- Framer Motion animations
- Displays featured posts (posts with `isFeatured: true`)
- Image optimization using `urlFor()` from Sanity
- Falls back to initials if author has no profile image

**Data Flow**:
1. Server component fetches posts on each request
2. Posts include auto-generated excerpts from body content
3. Client component separates featured vs regular posts
4. Real-time filtering happens client-side for instant UX
5. Categories are used as tags for filtering

**TypeScript Types**:
- Generated automatically via `npm run typegen`
- `ALL_POSTS_QUERYResult` type from `sanity.types.ts`
- Type-safe queries ensure data consistency

## Key Patterns

### Import Aliases
Use `@/*` for all imports from the `src` directory (configured in `tsconfig.json`).

Example:
```typescript
import { auth } from "@/lib/better-auth/auth";
import { connectToDatabase } from "@/database/mongoose";
```

### Component Organization
- **UI components**: `src/components/ui/` - Radix UI primitives with Tailwind styling
- **Form components**: `src/components/forms/` - Reusable form fields (InputField, SelectField, CountrySelectField)
- **Feature components**: `src/components/` - Header, UserDropdown, TradingViewWidget, etc.

### Styling
- **Tailwind CSS 4** with PostCSS
- Global styles in `src/app/globals.css`
- Component styling uses `class-variance-authority` for variants
- Dark mode configured via `next-themes`
- Utility function `cn()` in `src/lib/utils.ts` for conditional class merging

### Form Handling
- Forms use `react-hook-form` for validation and state management
- Country selection via `react-select-country-list`
- Toast notifications via `sonner`

## Technology Stack

- **Framework**: Next.js 15.5.6 with App Router and Turbopack
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, Radix UI components
- **Database**: MongoDB with Mongoose ODM
- **CMS**: Sanity CMS 4.3.0 with live content API
- **Authentication**: Better Auth with MongoDB adapter
- **Background Jobs**: Inngest with OpenAI integration
- **Email**: Nodemailer for transactional emails
- **Charts**: TradingView widgets (client-side injection)
- **Animations**: Framer Motion 12.23.24

## Navigation Structure

Navigation items defined in `NAV_ITEMS` constant in `src/lib/constants.ts`:
- Dashboard (`/`)
- Crypto (`/crypto`)
- Forex (`/forex`)
- Articles (`/articles`)
- Search (`/search`)
- Watchlist (commented out, not yet implemented)

## Stock Symbol Data

`POPULAR_STOCK_SYMBOLS` array in `src/lib/constants.ts` contains 60+ stock symbols organized by category:
- Tech Giants (AAPL, MSFT, GOOGL, etc.)
- Growing Tech Companies (ADBE, INTC, AMD, etc.)
- Newer Tech Companies (SNOW, PLTR, COIN, etc.)
- Consumer & Delivery Apps (DOCU, UBER, DASH, etc.)
- International Companies (BABA, NIO, XPEV, etc.)

Use this for autocomplete, search suggestions, or default watchlist items.
