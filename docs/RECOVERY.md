# Recovery and consolidation — 2026-10-21

## Sources reviewed

- Team repository: https://github.com/Sail-endra/dripless
- Project description: https://devpost.com/software/dripless
- `main`: `abbd466` — complete React/Vite UI under `client`, Express backend under `server`, plus an obsolete root Next.js application.
- `Roy`: `f813c15` — camera-related commit also removes the React/Express application and many other files. Not merged. Main already contains `capture="environment"` on the camera input.
- `Cedric`: `5b03067` — older UI and alternate SerpAPI/image helper modules. Its brand research already exists on main. Preserved that research as reference rather than mixing incompatible provider configurations into the active pipeline.

The root README and npm scripts previously described/started Next.js, although the later UI lived in `client`. Server dependencies were tracked in Git. The frontend requested port 3001 while the backend defaulted to 5000. These conflicts explain why a normal clone-and-run was unreliable.

## Local recovery

A name-based filesystem search of the user's home directory and a Spotlight query did not locate an existing Dripless source directory. Project-description PDFs were found, but not source code. macOS denied access to Trash; its contents could not be checked. `tmutil listlocalsnapshots /` returned no snapshots. This does not establish that all external/cloud backups are absent or that deleted data is unrecoverable.

The consolidated application is therefore recovered from the complete GitHub main revision, not claimed to be the missing local folder.

## Changes

- One npm workspace and lockfile; one command starts both frontend and backend.
- Root `.env` template; port 3001; same-origin API requests through Vite in development and Express in the built application.
- Original editorial interface, camera input, gender/season controls and static hero video retained.
- Explicit offline sample mode; no invented purchase URLs or simulated AI output presented as live.
- Image size/type validation, provider timeouts, structured model-output validation and safe product URL handling.
- Search/provider failures surfaced to users; successful recommendations remain visible if illustration/search fails.
- GPT Image base64 generation replaces the legacy DALL-E URL-download code. Listing titles feed the illustration prompt; illustration is not represented as an exact product photo.
- Original brand experiments archived; old Next.js scaffold, dependencies and unused assets omitted.
- Team provenance retained, with a link to the original Git history. This clean repository starts a new history rather than importing thousands of committed dependency files.

## Verification

- Frontend production build passed.
- Frontend ESLint passed.
- Seven Node test-runner tests passed, covering explicit demo output, invalid uploads, absent credentials, malformed model JSON, the mocked full pipeline, partial provider failures and unsafe URLs.
- Browser checked the original video landing page, capture page, preferences, upload and explicit demo results using the local backend through the Vite proxy.
- Real OpenAI/SearchAPI requests were **not** performed: no project credentials were configured. Model permissions, billing, live search results, camera behavior on a physical phone and full live-service latency remain unverified.

## Description vs. code

The Devpost narrative contains implementation details that differ from the checked-in source (including eBay vs. SearchAPI and statements about concurrency/grounding). This README documents the runnable implementation rather than repeating those claims. Search calls run concurrently; illustration generation follows them to include available product titles. There is no guaranteed 30-second latency.
