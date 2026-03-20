# AGENTS.md — Pre-Build Reference for American Seekers Academy

Read this file before starting any implementation work on this project. It summarizes the tech stack, file structure, dev patterns, available skills, and a pre-submission checklist.

---

## Available Skills

Load a skill's full `SKILL.md` when the task falls under its domain.

| Skill | Path | When to use |
|-------|------|-------------|
| **ui-expert** | `.agents/skills/ui-expert/SKILL.md` | Building, modifying, or reviewing any frontend component, page, or visual element |
| **agent-inbox** | `.local/skills/agent-inbox/SKILL.md` | Listing and managing user feedback, bug reports, or feature requests from the agent inbox |
| **artifacts** | `.local/skills/artifacts/SKILL.md` | Creating mockup sandbox artifacts (only supported artifact type in this project) |
| **database** | `.local/skills/database/SKILL.md` | Creating/migrating DB tables, running SQL queries, checking production data |
| **delegation** | `.local/skills/delegation/SKILL.md` | Delegating subtasks to local synchronous or background subagents |
| **deployment** | `.local/skills/deployment/SKILL.md` | Configuring and publishing the project to production |
| **design** | `.local/skills/design/SKILL.md` | Delegating visual design tasks to a specialized design subagent |
| **diagnostics** | `.local/skills/diagnostics/SKILL.md` | Running LSP diagnostics or rolling back to a checkpoint |
| **environment-secrets** | `.local/skills/environment-secrets/SKILL.md` | Viewing, setting, or requesting environment variables and secrets |
| **external_apis** | `.local/skills/external_apis/SKILL.md` | Accessing external APIs through Replit-managed billing |
| **fetch-deployment-logs** | `.local/skills/fetch-deployment-logs/SKILL.md` | Debugging issues in the deployed/published app |
| **integrations** | `.local/skills/integrations/SKILL.md` | Connecting third-party services (Brevo, Stripe, GitHub, etc.) via Replit integrations |
| **media-generation** | `.local/skills/media-generation/SKILL.md` | Generating AI images, videos, or retrieving stock images |
| **package-management** | `.local/skills/package-management/SKILL.md` | Installing npm packages or system dependencies |
| **post_merge_setup** | `.local/skills/post_merge_setup/SKILL.md` | Maintaining the post-merge setup script that runs after task merges |
| **project_tasks** | `.local/skills/project_tasks/SKILL.md` | Creating and managing persistent project tasks visible to the user (use only when directed) |
| **query-integration-data** | `.local/skills/query-integration-data/SKILL.md` | Querying or modifying data in connected integrations (Linear, GitHub, Slack, etc.) |
| **replit-docs** | `.local/skills/replit-docs/SKILL.md` | Searching Replit platform documentation for features, pricing, and deployment options |
| **repl_setup** | `.local/skills/repl_setup/SKILL.md` | Setting up host configuration, frontend/backend connectivity, and framework-specific Replit setup |
| **resolve_rebase_conflict** | `.local/skills/resolve_rebase_conflict/SKILL.md` | Resolving git rebase conflicts when explicitly instructed to rebase or merge |
| **revenuecat** | `.local/skills/revenuecat/SKILL.md` | Integrating RevenueCat for in-app payments and subscriptions in mobile apps |
| **skill-authoring** | `.local/skills/skill-authoring/SKILL.md` | Creating new reusable skills for this project |
| **stripe** | `.local/skills/stripe/SKILL.md` | Integrating Stripe for payments (web/mobile) |
| **suggest-new-project** | `.local/skills/suggest-new-project/SKILL.md` | Handling user requests for artifact types not supported in this project (slides, mobile app, etc.) |
| **validation** | `.local/skills/validation/SKILL.md` | Registering and running named validation/CI checks |
| **web-search** | `.local/skills/web-search/SKILL.md` | Real-time web lookups, API docs, current events |
| **workflows** | `.local/skills/workflows/SKILL.md` | Configuring, starting, stopping, or restarting dev workflows |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 with TypeScript |
| Build tool | Vite (configured — do NOT modify `vite.config.ts` or `server/vite.ts`) |
| Routing | `wouter` — use `Link` and `useLocation`, never manipulate `window.location` directly |
| Data fetching | TanStack Query v5 (`@tanstack/react-query`) |
| Forms | React Hook Form + Zod via `@hookform/resolvers/zod` |
| UI components | Shadcn/ui + Tailwind CSS |
| Animation | Framer Motion + `tailwindcss-animate` |
| Icons | `lucide-react` (UI icons), `react-icons/si` (brand logos) |
| Backend | Express (TypeScript) |
| ORM | Drizzle ORM |
| Database | PostgreSQL (production), in-memory optional for simple features |
| Schema validation | Zod (via `drizzle-zod`) |
| Email | Brevo API (transactional email) |
| Environment | Replit (NixOS container) |

---

## File Structure

```
/
├── client/
│   ├── index.html
│   └── src/
│       ├── App.tsx                  # Router + top-level layout
│       ├── main.tsx                 # Entry point
│       ├── index.css                # Global styles, CSS custom properties, custom classes
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── ProgramDetail.tsx
│       │   ├── BlogList.tsx
│       │   ├── BlogPost.tsx
│       │   ├── BlogAdmin.tsx
│       │   ├── AdminDashboard.tsx
│       │   └── not-found.tsx
│       ├── components/
│       │   ├── ui/                  # Shadcn components (do not edit these directly)
│       │   ├── layout/
│       │   │   ├── Header.tsx
│       │   │   └── Footer.tsx
│       │   ├── common/              # Shared cross-page components
│       │   │   ├── RequestInfoModal.tsx
│       │   │   ├── ContactModal.tsx
│       │   │   ├── LocationForm.tsx
│       │   │   └── AnalyticsTracker.tsx
│       │   └── home/               # Home page section components
│       │       ├── Hero.tsx
│       │       ├── Programs.tsx
│       │       ├── Curriculum.tsx
│       │       ├── About.tsx
│       │       ├── Locations.tsx
│       │       ├── FAQ.tsx
│       │       ├── Testimonials.tsx
│       │       ├── CTA.tsx
│       │       ├── ChecklistSection.tsx
│       │       ├── Comparison.tsx
│       │       ├── Philosophy.tsx
│       │       ├── SessionCalendar.tsx
│       │       └── VideoSection.tsx
│       ├── hooks/
│       │   └── use-toast.ts         # Import useToast from here (not from ui/)
│       └── lib/
│           └── queryClient.ts       # Default fetcher + apiRequest helper
├── server/
│   ├── index.ts                     # Express app entry
│   ├── routes.ts                    # All API route handlers
│   ├── storage.ts                   # IStorage interface + DatabaseStorage implementation
│   ├── db.ts                        # Drizzle DB connection
│   └── vite.ts                      # Vite dev server integration (DO NOT EDIT)
├── shared/
│   └── schema.ts                    # Drizzle table definitions, insert schemas, and types
├── tailwind.config.ts               # Tailwind theme (color tokens, font families)
├── drizzle.config.ts                # Drizzle config (DO NOT EDIT)
├── vite.config.ts                   # Vite config (DO NOT EDIT)
└── package.json                     # (DO NOT EDIT scripts; use package-management skill to add deps)
```

---

## Required Dev Patterns

### 1. Schema-First Development

Always define or update `shared/schema.ts` before writing backend or frontend code.

For each model, write:
- Drizzle table using `pgTable`
- Insert schema using `createInsertSchema(...).omit({ id: true, createdAt: true })` or `.pick({ ... })`
- `InsertX` type via `z.infer<typeof insertXSchema>`
- `X` select type via `typeof table.$inferSelect`

Array columns: use `text().array()` — **not** `array(text())`.

### 2. Storage Interface

Every CRUD operation must go through `IStorage` in `server/storage.ts`. Steps:

1. Add method signature to `IStorage`
2. Implement in `DatabaseStorage`
3. Call from `routes.ts` via `storage.<method>()`

Use `DatabaseStorage` (PostgreSQL) for all data. Only use in-memory storage when explicitly instructed.

### 3. Thin Routes

`server/routes.ts` should only:
- Parse and validate request body with the relevant Zod schema
- Call a storage method
- Return a JSON response

Business logic (email sending, external API calls) should live in helper functions in `routes.ts`, not inline in route handlers.

Validation pattern:
```ts
const validatedData = insertXSchema.parse(req.body);
// if ZodError, catch and return fromZodError(error).message with 400
```

### 4. Form Patterns

Use Shadcn's `Form` component wrapping `react-hook-form`:
```tsx
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { field: "" },
});
```

Always provide `defaultValues`. Use `.extend()` on insert schemas for extra validation rules.

Log `form.formState.errors` when debugging form submissions that silently fail.

### 5. Query & Mutation Patterns

**Queries** (TanStack Query v5 — always use object form):
```tsx
const { data, isLoading } = useQuery({
  queryKey: ['/api/endpoint'],
});
```

- Show loading/skeleton state while `isLoading` is true
- Use hierarchical array query keys: `['/api/recipes', id]` not `[\`/api/recipes/${id}\`]`
- Do not define a custom `queryFn` — the default fetcher handles it

**Mutations**:
```tsx
const mutation = useMutation({
  mutationFn: async (data) => {
    const res = await apiRequest("POST", "/api/endpoint", data);
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/endpoint'] });
  },
});
```

- Import `apiRequest` from `@/lib/queryClient`
- Import `queryClient` from `@/lib/queryClient` for cache invalidation
- Show pending state while `mutation.isPending` is true

### 6. Environment Variables

- Backend: `process.env.VAR_NAME`
- Frontend: `import.meta.env.VITE_VAR_NAME` (prefix required for Vite exposure)
- Never hardcode secrets. Use the environment-secrets skill to manage them.

### 7. Routing

- Register new pages in `client/src/App.tsx` under the `<Switch>`
- Use `Link` from `wouter` for internal navigation
- Use `useLocation` for reading the current path
- For programmatic navigation, use the `useLocation` hook's setter

### 8. UI Conventions

**Read `.agents/skills/ui-expert/SKILL.md` for the full design system.**

Key rules:
- Colors: use Tailwind tokens (`text-navy`, `bg-gold`, `text-primary`, etc.) — no hardcoded hex in JSX
- Typography: `font-playfair` for headings, `font-inter` for body (applied globally)
- Custom classes: prefer `.btn-primary`, `.btn-accent`, `.card-elegant`, `.program-card`, `.container-custom`, `.section-divider` before writing new Tailwind combinations
- Icons: `lucide-react` for UI, `react-icons/si` for brand logos
- Modals: follow the pattern in `RequestInfoModal.tsx` or use Shadcn `Dialog`

---

## Forbidden Changes

The following files must **never** be modified:

| File | Reason |
|------|--------|
| `vite.config.ts` | Vite is pre-configured for this environment |
| `server/vite.ts` | Vite dev server integration — modifying breaks the setup |
| `drizzle.config.ts` | Drizzle config is environment-specific |
| `package.json` scripts | Use the package-management skill to add dependencies |

---

## Pre-Submission Checklist

Before marking any task complete, verify:

- [ ] **Schema-first**: `shared/schema.ts` updated before backend/frontend code if a new model was added
- [ ] **Storage interface**: `IStorage` updated and `DatabaseStorage` implements all new methods
- [ ] **Thin routes**: No business logic inline in route handlers; Zod validation present on all POST/PUT routes
- [ ] **Form patterns**: Forms use `useForm` + `zodResolver` + `defaultValues`; `<Form>` component wraps the form
- [ ] **Query patterns**: `useQuery` uses object form; mutations invalidate the correct query keys; loading/pending states shown
- [ ] **Env vars**: No secrets hardcoded; frontend vars prefixed with `VITE_`
- [ ] **UI conventions**: Colors use Tailwind tokens; headings use `font-playfair`; custom CSS classes used where applicable; icons from `lucide-react` or `react-icons/si`
- [ ] **No forbidden changes**: `vite.config.ts`, `server/vite.ts`, `drizzle.config.ts`, and `package.json` scripts are untouched
- [ ] **Responsive design**: All new UI works on mobile, tablet, and desktop
- [ ] **Accessibility**: Interactive elements have `aria-label` where needed; focus-visible styles preserved
- [ ] **`replit.md` updated**: Architectural changes or new dependencies are documented
