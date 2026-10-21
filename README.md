# Dripless

**Dress different. Build an outfit around what you already own.**

Dripless is a team hackathon project that turns a clothing photo into three complementary styling suggestions, searches for secondhand options, and generates an outfit illustration. This repository consolidates the original React/Express application into a reproducible local setup.

[Project story and demo on Devpost](https://devpost.com/software/dripless) · [Original team repository](https://github.com/Sail-endra/dripless)

## Run in two commands

Requires **Node.js 22.12+** and npm. Run these commands from the repository root:

```bash
npm ci
npm run demo
```

Open **http://127.0.0.1:5173**. Upload a JPEG, PNG or WebP under 8 MB, or use the camera on a compatible device.

**Demo mode is an offline UI sample.** It returns a fixed, clearly labeled outfit. It does not analyze the uploaded photo, fetch products, or generate an AI image, and does not need keys or make paid API calls.

## Enable real AI styling

```bash
cp .env.example .env
# Edit .env and set OPENAI_API_KEY and SEARCHAPI_KEY
npm run dev
```

Keep secrets in the root `.env`, never in frontend code. Stop the demo process before starting live mode. `OPENAI_API_KEY` enables image analysis, recommendations and illustration generation. `SEARCHAPI_KEY` enables Google Shopping search via [SearchAPI](https://www.searchapi.io/); it is not a SerpAPI key. Requests can incur provider charges and require model access/quota.

The server defaults to port **3001**, avoiding the common macOS AirPlay conflict on 5000. Vite forwards `/api` to the backend, so the frontend has no hardcoded localhost API URL. `PORT` in the root `.env` changes the backend and proxy target together. `HOST` controls the backend bind address; the default is loopback.

| Command | Purpose |
| --- | --- |
| `npm run demo` | Start both services with explicit offline sample mode |
| `npm run dev` | Start both services with real provider integration |
| `npm run build` | Build the frontend into `client/dist` |
| `npm start` | Serve the built frontend and API on port 3001 |
| `npm run lint` | Check frontend code |
| `npm test` | Run API tests with mocked external services |

For a production-style local run: `npm run build`, then `npm start`, then open http://localhost:3001. Set `DEMO_MODE=true` in `.env` to use sample mode with this command. This is a local/demo application; add authentication and request quotas before exposing paid endpoints publicly.

## How it works

1. The backend sends the photo to GPT-4o for structured garment identification.
2. A second call suggests exactly three complementary pieces using gender and season preferences.
3. SearchAPI looks up the pieces concurrently with secondhand/pre-owned search terms.
4. GPT Image creates an illustrative outfit based on the base garment, suggestions and available listing titles. Base64 output avoids temporary image-link expiration.

Models can be configured through `OPENAI_CHAT_MODEL` and `OPENAI_IMAGE_MODEL`; defaults are `gpt-4o` and `gpt-image-1`. The image integration uses the [OpenAI Images API](https://developers.openai.com/api/reference/resources/images/methods/generate) and expects a GPT Image model returning `b64_json`.

Search results are not a guarantee of secondhand condition, sustainable production, current stock or price. Check each listing. The generated image is an illustration, not an exact product photograph or virtual try-on. Search/image failures show warnings while retaining successful recommendations. Missing OpenAI configuration produces an actionable message rather than crashing at startup.

## Repository layout

```text
client/                  React + Vite UI and original visual assets
server/                  Express API and mocked-provider integration tests
scripts/dev.mjs          Starts both development services
archive/brand-research/  Original experimental brand classification work
docs/RECOVERY.md         Branch audit and restoration decisions
.env.example             Safe configuration template
package-lock.json        Single workspace dependency lockfile
```

The old Next.js scaffold, committed dependencies, duplicate assets and temporary Git files are excluded from this consolidated application. The original repository retains their history. The experimental brand data is preserved for reference, but is not presented as a verified sustainability rating.

## Credits and provenance

This is a consolidation of **the team's Dripless project**, not a new solo project. The original Git history records work by `Sail-endra` / `skaruparthi`, `BADBOYROY` / `xinrui`, and `CedricLiu87`. The source, project story, original design, video and team contributions are credited above. See [the recovery notes](docs/RECOVERY.md) for exact source revisions and changes.

No new license is assigned to the team's original code or media in this cleanup.
