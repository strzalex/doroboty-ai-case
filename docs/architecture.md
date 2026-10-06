# Architecture

Next.js App Router composes pages. `src/features/dashboard` contains static data and the dashboard: metric cards, a chart, and a document table with search, status filtering, selection, and pagination. The layout follows the shadcn/ui `dashboard-01` block.

`/demo` → React components → file-backed data. Filters and selection exist only in page memory. The demo does not store data in localStorage or Supabase and requires no services or secrets. Only the theme preference is persisted by next-themes.

`/app` → verified Supabase session → the same dashboard with sample data. Supabase is currently used only for auth; the starter contains no domain tables or migrations. Missing configuration shows setup instructions, and a service failure never switches the application to demo mode.

`src/features/auth` contains auth forms. `src/features/component-examples` contains a React Hook Form and Zod example that does not save or send data. Server libraries are separated from browser libraries and marked `server-only`.

## Adding features

1. Define the expected behavior and add the feature in `src/features`.
2. Share the Zod input schema between the form and the server.
3. If the feature needs a database, create a new migration with its table, indexes, and RLS. Do not edit migrations already applied to a remote database.
4. Every server operation must verify its own session and input. Layouts do not replace mutation authorization. Never use service_role for normal user operations.
5. Build the interface with existing components, covering loading, empty results, errors, and retries.
6. Test critical behavior and RLS with two accounts, using only local Supabase. Keep the demo as a simple interface example with static data.

## Interface

shadcn/ui uses Base UI; components use `render`. The b0 preset (Nova, Neutral, Inter, Lucide, 0.625rem radius) defines the visual style. OKLCH tokens, fonts, and spacing live in `tokens.css`; layout styles live in `src/app/workspace.css`. Add new colors as tokens. Use visible field labels, error descriptions, accessible names for icon buttons, and dialog headings. Fonts are local; builds do not download Google Fonts.

Payments, uploads, multi-organization support, and AI are not included. Add them as separate features with tests and setup documentation.
