# CraftworldCentre — Frontend

> Circular Economy Marketplace · Turning Waste into Wealth

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript (Vite) |
| UI Library | Material UI v6 |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion v11 |
| State | Zustand v5 |
| Forms | React Hook Form v7 |
| Routing | React Router v6 |
| HTTP | Fetch API (native) |
| Realtime | Socket.io Client |
| Payments | Paystack |
| Media | Cloudinary |

## Project Structure

```
src/
├── components/
│   ├── layout/        # Navbar, Footer
│   ├── sections/      # Homepage sections
│   └── ui/            # Reusable components
├── pages/             # Route-level pages
├── store/             # Zustand stores
├── types/             # TypeScript types
├── utils/             # Theme, constants, helpers
└── hooks/             # Custom hooks
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in your API keys

# 3. Start the dev server
npm run dev
```

## Sprint Progress

- [x] **Sprint 1** — Homepage · Login · Signup · Design System · Layout
- [ ] **Sprint 2** — Shop Page · Product Detail · Cart Drawer · Brand Filters
- [x] **Sprint 3** — Checkout · Paystack Integration · Order Confirmation
- [ ] **Sprint 4** — Account · Orders · Wishlist
- [ ] **Sprint 5** — Admin Dashboard (separate app)

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--brand-primary` | `#1A7A8A` | Buttons, links, primary CTA |
| `--brand-accent` | `#7BC8D8` | Highlights, hover states |
| `--brand-white` | `#FFFFFF` | Backgrounds |
| `--brand-cream` | `#F5F3EF` | Section backgrounds |
| `--brand-dark` | `#0d1f22` | Text, dark sections |

## Partner Brands

| Brand | Focus | Color |
|-------|-------|-------|
| CraftworldCentre | Flagship marketplace | Teal `#1A7A8A` |
| Adúláwò | Artisan crafts · African heritage | Amber `#8B6914` |
| Planet 3R | Industrial upcycling | Forest `#3d6b2d` |
# CW_Frontend
