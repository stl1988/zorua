# Zorua

Your content. Your vibe. Your rules. A fun, customizable [Nostr](https://nostr.com/) client that puts you in control.

**[zorua.shakespeare.wtf](https://zorua.shakespeare.wtf)** | **[Source](https://github.com/stl1988/zorua)** | **[Based on Ditto](https://gitlab.com/soapbox-pub/ditto)**

[![Edit with Marlowe](https://47h1rs70oqaspur8bichfzalg0wnassb8d7tslfacl7hwyaxhkmarlowe.nsite.lol/marlowe-badge.svg)](https://47h1rs70oqaspur8bichfzalg0wnassb8d7tslfacl7hwyaxhkmarlowe.nsite.lol/clone?url=https%3A%2F%2Fgithub.com%2Fstl1988%2Fzorua)

## About

Zorua is an open-source, decentralized social media client built on the Nostr protocol. It is a fork of [Ditto](https://ditto.pub) by Soapbox, customized and maintained by [stl1988](https://stl1988.shakespeare.wtf). Express yourself with custom themes, Lightning payments, and an ever-growing set of content types — all while owning your identity and data.

The name references a dark-type shapeshifter that reveals its true self in battle — a fitting metaphor for Nostr, where your cryptographic identity is always yours regardless of which client or relay you use.

## Features

- **Theming** — built-in theme presets including the signature Zorua dark-grey + dark-red palette, 19 CSS token properties for full customization, and the ability to publish and share themes as Nostr events
- **Infinite Content Types** — text notes, articles, short-form videos (Divines), live streams, polls, follow packs, color moments, geocaching, and Webxdc mini-apps
- **Lightning Payments** — zap posts and profiles with sats via Nostr Wallet Connect (NWC) or WebLN. On-chain Bitcoin zaps are intentionally not supported (see Privacy below)
- **Comments** — comment on anything: posts, URLs, profiles, hashtags, books, and more (NIP-22)
- **Blobbi virtual pets** — raise, hatch, and evolve virtual pets stored as Nostr events
- **Self-Hosting** — builds to static HTML/JS/CSS. Deploy anywhere — GitHub Pages, Netlify, Vercel, a VPS, or a Raspberry Pi
- **Mobile** — Android native app via Capacitor, responsive design for all screen sizes

## Privacy

Zorua does **not** derive Bitcoin Taproot addresses from Nostr pubkeys. This feature (present in upstream Ditto) links your on-chain identity directly to your Nostr identity, undermining privacy and plausible deniability. Lightning zaps are fully supported.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- npm 10.9.4+

### Development

```sh
git clone https://github.com/stl1988/zorua.git
cd zorua
npm install
npm run dev
```

The dev server starts at `http://localhost:8080`.

### Build

```sh
npm run build
```

The built site is output to `dist/`.

### Test

Runs type-checking, linting, unit tests, and a production build:

```sh
npm test
```

## Configuration

Zorua is configured through a `ditto.json` file at the project root, read at build time. This file is gitignored so each deployment can have its own configuration.

```jsonc
{
  "theme": "dark",
  "relayMetadata": {
    "relays": [
      { "url": "wss://relay.ditto.pub", "read": true, "write": true }
    ]
  },
  "blossomServers": ["https://blossom.ditto.pub"],
  "feedSettings": {
    "showPosts": true,
    "showReposts": true,
    "showArticles": true
    // ...and more content type toggles
  }
}
```

Configuration is resolved in three layers (highest priority first):

1. **User settings** stored in localStorage
2. **Build config** from `ditto.json`
3. **Hardcoded defaults**

Use an alternate config file path with: `DITTO_CONFIG_FILE=./my-config.json npm run build`

### Custom Branding

For self-hosted instances:

- Replace `public/logo.svg` with your logo
- Update the app name in `index.html` and `public/manifest.webmanifest`
- Replace `public/og-image.jpg` for social sharing previews
- Set default relays and upload servers in `ditto.json`

## Deployment

Zorua builds to static files and can be deployed anywhere that serves HTML.

- **GitHub Pages / GitLab Pages** — push to `main` and CI auto-deploys
- **Netlify / Vercel** — connect your fork and deploy. A `_redirects` file is included for SPA routing
- **VPS / Any web server** — build and copy `dist/` to your server. Configure SPA routing (e.g., Nginx `try_files $uri $uri/ /index.html`)

### Android

Build a native Android app with [Capacitor](https://capacitorjs.com/):

```sh
npm run build
npx cap sync
npx cap open android
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build | Vite |
| Language | TypeScript |
| Styling | TailwindCSS 3 + shadcn/ui |
| Routing | React Router 6 |
| Data | TanStack Query |
| Nostr | Nostrify + nostr-tools |
| Mobile | Capacitor |
| Testing | Vitest + React Testing Library |

## Project Structure

```
src/
  components/     UI components (100+), including shadcn/ui primitives
  hooks/          Custom React hooks (65+)
  pages/          Page components for each route (30+)
  contexts/       React context providers
  lib/            Utilities and shared logic
  blobbi/         Blobbi virtual pet subsystem
  test/           Test setup and helpers
public/           Static assets, icons, manifest, llms.txt
```

## Contributing

Contributions are welcome. Please keep pull requests small and focused. Use an AI coding agent for implementation. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Upstream

Zorua is a fork of [Ditto](https://gitlab.com/soapbox-pub/ditto) by [Soapbox](https://soapbox.pub), licensed under AGPL-3.0. Upstream changes are periodically merged.

## License

[AGPL-3.0](LICENSE)
