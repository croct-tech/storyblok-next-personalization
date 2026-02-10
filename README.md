<p align="center">
  <img src="public/storyblok-croct.svg" alt="Storyblok + Croct" width="242" />
</p>

<h3 align="center">Personalized e-commerce demo</h3>

<p align="center">
  A Next.js 16 storefront powered by <a href="https://www.storyblok.com">Storyblok</a> for content management<br/>and <a href="https://croct.com">Croct</a> for real-time personalization.
</p>

<p align="center">
  <a href="https://storyblok-next-personalization.vercel.app/">Live demo</a>
</p>

---

## Background

Storyblok published a great [tutorial on personalization with Next.js](https://www.storyblok.com/tp/personalization-nextjs) that walks through building personalized experiences using cookies, middleware rewrites, and manually defined content variants. It's a solid starting point for understanding the concepts.

In practice, though, that approach requires custom code for every new audience segment, manual variant wiring in the CMS, and has no built-in support for A/B testing or analytics. As the number of pages and segments grows, it becomes hard to maintain.

This project is a fork of the [original demo](https://github.com/fgiuliani/storyblok-next-personalization) that replaces the manual personalization logic with [Croct](https://croct.com). With Croct, any content already managed in Storyblok becomes personalizable and ready for A/B testing, without changing how you structure or deliver your pages.

## What's inside

A minimal fashion store that demonstrates how Storyblok and Croct work together in a Next.js App Router project:

- **Storyblok** manages the homepage hero, call-to-action blocks, and product catalog
- **Croct** delivers personalized content and tracks user interests in real time
- **Shopping cart** with add, remove, and quantity controls

## Getting started

### Prerequisites

- Node.js 18+
- A [Storyblok](https://app.storyblok.com/#!/signup) space with the demo content
- A [Croct](https://app.croct.com) workspace (or use the pre-configured one)

### 1. Clone and install

```bash
git clone <repo-url>
cd storyblok-next-personalization
npm install
```

### 2. Set up Storyblok

Create a `.env.local` file with your Storyblok access token:

```env
NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN=<your-token>
```

### 3. Set up Croct

Run the Croct CLI to configure the app ID and API key automatically:

```bash
npx croct init
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How the integration works

Adding Croct to an existing Storyblok + Next.js project takes three small changes. Check the [commit history](https://github.com/croct-tech/storyblok-next-personalization/commit/ed9cb61c4915aa9f1a11e513a8dc1d125642f57c) to see the exact diff.

**1. Wrap the Storyblok init with `withCroct`**

```ts
// lib/storyblok.ts
import {withCroct} from '@croct/plug-storyblok/next';

export const getStoryblokApi = storyblokInit(withCroct({
    accessToken: '...',
    use: [apiPlugin],
    components: { ... },
}));
```

**2. Add the `<CroctProvider>`**

```tsx
// app/layout.tsx
import {CroctProvider} from '@croct/plug-next/CroctProvider';

<CroctProvider>
    {children}
</CroctProvider>
```

**3. Export the proxy middleware**

```ts
// proxy.ts
export {proxy} from '@croct/plug-next/proxy';
```

That's it. No extra config, no migration. Once integrated, any content managed in Storyblok becomes personalizable and ready for A/B testing through Croct.

For the full integration guide, see the [Storyblok SDK documentation](https://docs.croct.com/reference/sdk/storyblok/integration).

## Project structure

```
app/
├── page.tsx                        # Home (Storyblok story + static sections)
├── catalog/[[...category]]/        # Product listing with category filtering
├── product/[slug]/                 # Product detail page
└── cart/                           # Shopping cart
components/
├── blocks/                         # Storyblok content blocks (CTA, Catalog, Note…)
└── core/                           # App shell (Navigation, Cart, TopBar…)
```

## Deploying

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcroct-tech%2Fstoryblok-next-personalization&env=NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN&envDescription=Your%20Storyblok%20Content%20Delivery%20API%20access%20token&envLink=https%3A%2F%2Fwww.storyblok.com%2Fdocs%2Fapi%2Fcontent-delivery%2Fv2%2Fgetting-started%2Fauthentication)

Make sure to set the environment variables listed above in your hosting provider's dashboard.

## Docs

- [Storyblok docs](https://www.storyblok.com/docs)
- [Croct docs](https://docs.croct.com)
- [Next.js docs](https://nextjs.org/docs)
