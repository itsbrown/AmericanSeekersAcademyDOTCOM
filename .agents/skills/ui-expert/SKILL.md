---
name: ui-expert
description: Design system and UI conventions for the American Seekers Academy project. Use whenever building, modifying, or reviewing any frontend components, pages, or visual elements in this project. Covers color palette, typography, Tailwind + Shadcn usage, custom CSS classes, animation patterns, responsive grids, modal conventions, lazy loading, and icon usage.
---

# UI Expert — American Seekers Academy Design System

## Color Palette

This project uses three primary brand colors, exposed as Tailwind utilities and CSS custom properties.

| Token | Tailwind class | HSL value | Hex approx. | Usage |
|-------|---------------|-----------|-------------|-------|
| Navy | `text-navy` / `bg-navy` | `hsl(212, 52%, 25%)` | `#1e3a5f` | Primary brand, headers, CTAs, backgrounds |
| Gold | `text-gold` / `bg-gold` | `hsl(38, 75%, 45%)` | `#c4a052` | Accent, section dividers, hover states |
| Cream | `text-cream` / `bg-cream` | `hsl(40, 33%, 96%)` | `#f8f5ef` | Alternate section backgrounds |

Additional semantic tokens (mapped in `index.css` and `tailwind.config.ts`):
- `bg-background` / `text-foreground` — page-level defaults (cream/navy)
- `bg-primary` / `text-primary-foreground` — navy / white
- `bg-accent` / `text-accent-foreground` — gold / white
- `bg-secondary` / `text-secondary-foreground` — red `hsl(352,80%,45%)` / white (used sparingly)
- `bg-muted` / `text-muted-foreground` — subtle backgrounds and helper text
- `bg-card` / `text-card-foreground` — card surfaces

For new and modified UI code, always use Tailwind tokens or CSS custom properties instead of hard-coded hex values. Some existing components (e.g., `Header.tsx`) use literal hex (`#1e3a5f`) for legacy reasons — do not propagate this pattern to new code.
Exception: inline email HTML in `server/routes.ts` may use literal hex (`#1e3a5f`, `#c4a052`).

### Gradients

```css
/* Navy gradient — hero backgrounds, CTA sections */
background: linear-gradient(135deg, hsl(212, 52%, 25%) 0%, hsl(212, 52%, 35%) 100%);

/* Gold gradient — accent buttons */
background: linear-gradient(135deg, hsl(38, 75%, 45%) 0%, hsl(38, 75%, 55%) 100%);

/* Hero pattern — light page sections */
background: linear-gradient(135deg, hsl(40, 33%, 98%) 0%, hsl(40, 33%, 94%) 100%);

/* Section divider line */
background: linear-gradient(90deg, hsl(212, 52%, 25%) 0%, hsl(38, 75%, 45%) 100%);
```

---

## Typography

| Font | Tailwind class | Usage |
|------|---------------|-------|
| Playfair Display | `font-playfair` | All headings (`h1`–`h6`), display text |
| Inter | `font-inter` | Body text, labels, UI elements |

Both are loaded from Google Fonts in `client/src/index.css`.

### Heading scale

```
h1: font-playfair font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl
h2: font-playfair font-bold tracking-tight text-3xl md:text-4xl
h3: font-playfair font-bold tracking-tight text-2xl md:text-3xl
h4: font-playfair font-bold tracking-tight text-xl md:text-2xl
```

All headings default to `font-playfair font-bold tracking-tight` via the global `@layer base` rule — no need to repeat these classes unless overriding.

Body text defaults to `font-inter` on `<body>` via the same base layer.

---

## Tailwind Usage Rules

1. **Use Tailwind tokens for everything**: spacing, color, border-radius, shadow, transition — avoid arbitrary values unless absolutely necessary.
2. **Responsive prefixes**: Always design mobile-first. Use `sm:`, `md:`, `lg:`, `xl:` prefixes for responsive breakpoints.
3. **Dark mode**: The project supports dark mode via `darkMode: ["class"]`. Apply `dark:` variants when building components that should adapt.
4. **`container-custom`**: Use `.container-custom` for standard page-width sections instead of repeating `container mx-auto px-4 sm:px-6 lg:px-8`.
5. **Do not add arbitrary `[color]` values** — the palette is fully mapped in `tailwind.config.ts`.
6. **Transitions**: Prefer `transition-all duration-300` for hover/focus effects to stay consistent with existing components.
7. **Border-radius**: Use the theme tokens `rounded-sm`, `rounded-md`, `rounded-lg` (mapped to CSS custom properties) rather than fixed values.

---

## Shadcn Component Conventions

Import from `@/components/ui/<component>`. All components are already installed.

| Component | When to use |
|-----------|-------------|
| `Button` | All interactive buttons. Use `variant` prop: `default` (navy fill), `outline`, `ghost`, `destructive`. |
| `Card`, `CardHeader`, `CardContent`, `CardFooter` | Content cards unless using `.card-elegant` or `.program-card` custom classes |
| `Dialog`, `DialogContent`, `DialogHeader` | Modals and overlays |
| `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` | All forms — wrap react-hook-form with these |
| `Input`, `Textarea` | Text inputs inside forms |
| `Label` | Standalone labels |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` | Dropdowns — always provide a `value` prop on `<SelectItem>` |
| `Badge` | Status tags, category labels |
| `Separator` | Horizontal rules |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Tabbed sections |
| `Toaster` + `useToast` | Notifications. Import `useToast` from `@/hooks/use-toast` |
| `Tooltip`, `TooltipProvider` | Hover hints; `TooltipProvider` is already at app root |

**Form pattern** (always follow this):

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="fieldName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Label</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

## Custom CSS Class Catalogue

Defined in `client/src/index.css` under `@layer components`:

| Class | Description |
|-------|-------------|
| `.container-custom` | Standard page container with responsive horizontal padding |
| `.program-card` | Card with hover lift effect (`-translate-y-1 shadow-xl`). Use for program listing cards |
| `.hero-pattern` | Light cream gradient background for hero/intro sections |
| `.section-divider` | Navy-to-gold gradient `w-20 h-1` horizontal line for section breaks |
| `.gold-accent` | Applies the gold color `hsl(38, 75%, 45%)` to text |
| `.navy-gradient` | Navy gradient background for full-bleed dark sections |
| `.cream-bg` | Solid cream background for alternate sections |
| `.btn-primary` | Navy gradient button with white text. Use for primary actions |
| `.btn-secondary` | Outlined navy button. Use for secondary actions |
| `.btn-accent` | Gold gradient button. Use for attention-grabbing CTAs (e.g., Donate) |
| `.card-elegant` | Subtle card with hover shadow and border enhancement |

Use these classes before writing custom Tailwind combinations — they are purpose-built for this project's aesthetic.

---

## Animation & Transition Patterns

### CSS Transitions (Tailwind)

- **Standard hover**: `transition-all duration-300` — applies to cards, buttons, links
- **Navigation links**: `transition-colors duration-200`
- **Card lift**: `.program-card:hover` applies `transition-all duration-300 -translate-y-1 shadow-xl`
- **Accordion**: Handled automatically by Shadcn + `tailwindcss-animate` plugin

### Framer Motion

The project has Framer Motion available. Use it for:
- Page-level entrance animations (`initial`, `animate`, `exit`)
- Staggered list reveals (e.g., program cards fading in sequence)
- Scroll-triggered animations (`whileInView`)

Keep Framer Motion animations subtle and purposeful. Prefer:
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: "easeOut" }}
```

Do **not** add heavy animations to elements that scroll frequently or to mobile views where they may degrade performance.

---

## Responsive Grid Rules

- **Default mobile**: single column, full width
- **Tablet (md)**: 2 columns for cards/features
- **Desktop (lg/xl)**: 3 or 4 columns for cards, constrained content columns

Common grid patterns used in this project:

```
Programs grid: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
Features/icons: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8
Two-column layout: grid grid-cols-1 lg:grid-cols-2 gap-12 items-center
```

Sections should use `.container-custom` for consistent max-width and padding. Section vertical spacing: `py-16 md:py-20 lg:py-24`.

---

## Modal Patterns

Custom modals in this project use a consistent pattern (see `RequestInfoModal.tsx` and `ContactModal.tsx`):

```tsx
if (!isOpen) return null;

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 z-10">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      {/* content */}
    </div>
  </div>
);
```

Rules:
- Backdrop click should close the modal
- Close button in top-right corner with `X` icon from lucide-react
- `z-50` for the overlay, `z-10` for the modal panel (relative to parent)
- `max-w-md` for standard forms, `max-w-2xl` for content-heavy modals
- For Shadcn `Dialog` component, prefer it over custom modals for new work unless the custom pattern is already in place nearby

---

## Lazy Loading Conventions

- **Images**: Use native `loading="lazy"` on non-critical images (below-the-fold)
- **Pages/Routes**: Heavy pages (`BlogAdmin`, `AdminDashboard`) should use `React.lazy` + `Suspense` if they grow large. Currently loaded eagerly via `App.tsx`
- **Data**: Use TanStack Query's built-in caching and `enabled` flag to defer data fetching until needed

```tsx
const { data, isLoading } = useQuery({
  queryKey: ['/api/blog'],
  enabled: isVisible,
});
```

---

## Icon Usage

### Primary library: `lucide-react`

Use for all UI icons (actions, navigation, status, form field decorators).

```tsx
import { X, Menu, Mail, Phone, User, ChevronDown, Loader2, CheckCircle } from "lucide-react";
```

Size convention:
- Navigation/close: `h-6 w-6`
- Inline with text: `h-4 w-4`
- Decorative/hero: `h-8 w-8` or larger

### Brand/company logos: `react-icons/si`

Use `react-icons/si` (Simple Icons) for company/brand logos.

```tsx
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
```

**Never** use stock images as backgrounds for large sections. Images should only appear as foreground content within bounded containers (cards, thumbnails).
