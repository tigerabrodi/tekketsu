# Tekketsu — Work Plan

Everything needed to ship Tekketsu, in order. Reference this as the single source of truth.

---

## Design Reference

All designs live in **Paper** (file: "Mild yacht").

### Landing Page

- **V4e — Oswald Light** is the chosen direction
- Warm white `#fafafa` background, manga editorial feel
- Kanji 鉄血 as hero title in Shippori Mincho 800
- TEKKETSU in IBM Plex Mono with horizontal rules
- Manga warrior image centered
- Body text in Oswald Light
- Black CTA button with Google icon, IBM Plex Mono label
- "Free forever. Let's lock in." footer text

### Workout Screen

- **W1 — Clean Stack** is the chosen layout
- All states designed:
  - **Timer mode ready** — 20:00 countdown, mode toggle, duration ±5 controls, play/pause + reset, 5 break presets (QUICK/MEDIUM/NORMAL/LONG/EXTENDED)
  - **Sets mode ready** — 30/30 remaining display, stopwatch at 00:00, same controls
  - **Break active** — Timer keeps running (17:23), sets incremented (3), break presets replaced with countdown (0:32) in blood red, mode toggle + duration controls dimmed
  - **Workout complete** — Crossed swords logo, "Workout Complete" heading, stats rows (SETS COMPLETED: 12, DURATION: 20:00), "Start New Workout" button

### Design System

| Token              | Value                                   |
| ------------------ | --------------------------------------- |
| Background         | `#fafafa`                               |
| Text primary       | `#111111`                               |
| Text secondary     | `rgba(17,17,17,0.55)`                   |
| Text muted         | `rgba(17,17,17,0.35)`                   |
| Accent (blood red) | `#8b1a1a`                               |
| Accent hover       | `#721515`                               |
| Border             | `rgba(17,17,17,0.1)`                    |
| Font display       | Shippori Mincho (800 for numbers/kanji) |
| Font body          | Oswald (300 light for body text)        |
| Font mono          | IBM Plex Mono (labels, buttons, status) |
| Radii              | 0px everywhere, 999px for round buttons |
| Active toggle      | Black bg `#111111`, white text          |
| Inactive toggle    | 1px border, muted text                  |

---

## What's Done

- [x] Project scaffolded from `react-tanstack-router-template`
- [x] Git initialized
- [x] Name: `tekketsu` in package.json
- [x] Theme tokens in `app.css` (colors, fonts, spacing, radii)
- [x] Font packages added (Shippori Mincho, Oswald, IBM Plex Mono)
- [x] Font imports in `main.tsx` + declarations
- [x] Landing page (`/`) — V4e design with Google OAuth, redirects to `/workout`
- [x] Loading screen — Kanji 鉄血 stroke-by-stroke animation with Framer Motion
- [x] Workout route placeholder (`/workout`) — hello world, authenticated
- [x] Auth guard (`_authenticated` layout route)
- [x] Root layout redirect (authenticated users → `/workout`)
- [x] Assets: manga warrior image, crossed swords logo, OG image, favicon
- [x] SFX: `break-finished.mp3` copied from gakucha
- [x] `index.html` — title, description, OG tags, Twitter card, favicon
- [x] Admin routes removed (not needed)
- [x] Deployed on Vercel with custom domain (tekketsu.com)
- [x] Google OAuth env vars set (dev + prod)
- [x] Convex auth wired (Google provider)

---

## What's Left — Build Order

### Phase 1: Workout UI (core feature)

This is the entire product. One screen, all states.

#### 1.1 Workout state management

- [ ] `useReducer` for workout state (no external lib)
- [ ] State shape: mode, currentTime, isRunning, currentSets, targetSets, timerDuration, breakTime, isOnBreak, breakDuration, isComplete
- [ ] Actions: setMode, startStop, reset, tick, startBreak, breakTick, endBreak, adjustDuration, adjustTargetSets
- [ ] Timer mode logic: countdown from configured duration, continues during breaks
- [ ] Sets mode logic: stopwatch counts up, pauses during breaks, resets to 00:00 after each break
- [ ] `useEffect` with 1-second interval for ticking
- [ ] Auto-complete when timer hits 0 (timer mode) or remaining sets hit 0 (sets mode)
- [ ] Format time helper: seconds → MM:SS with zero-padding

#### 1.2 Workout screen layout (W1 Clean Stack)

- [ ] Top bar: crossed swords logo + TEKKETSU label, sign out link
- [ ] Mode toggle: TIMER | SETS tabs (black = active, border = inactive)
- [ ] Duration/target control: - / value / + (5-min or 5-set increments)
- [ ] Main timer display: Shippori Mincho 96px, MM:SS or remaining/target
- [ ] Status indicator: colored dot + READY/RUNNING/PAUSED label
- [ ] Sets counter: number + SETS COMPLETED/REMAINING label
- [ ] Controls: play/pause circle button (black, 56px) + reset circle button (outline, 40px)
- [ ] Divider line
- [ ] Break presets: 5 buttons in a row (0:30, 0:45, 1:00, 1:30, 2:00 with labels)

#### 1.3 Workout states & interactions

- [ ] Ready state: all controls enabled, break presets visible but only tappable when running
- [ ] Running state: timer ticking, mode toggle disabled, duration controls disabled
- [ ] Paused state: timer frozen, status shows PAUSED, break presets visible but disabled
- [ ] Break active state: break countdown in blood red replaces presets, "BREAK IN PROGRESS" label, mode toggle + duration dimmed, main timer continues (timer mode) or pauses (sets mode)
- [ ] Completed state: overlay with crossed swords, "Workout Complete", stats rows, "Start New Workout" button

#### 1.4 Disable rules

- [ ] Mode toggle: disabled when running, paused mid-workout, or on break
- [ ] Duration/target adjustment: disabled when running, paused mid-workout, or on break
- [ ] Break presets: disabled when paused, hidden when on break
- [ ] No break stacking
- [ ] No break cancellation
- [ ] Reset cancels active break

### Phase 2: Sound & Notifications

#### 2.1 Sound effect manager

- [ ] Singleton manager class (`src/managers/sound-effect.ts`)
- [ ] Preload `break-finished.mp3` on initialization
- [ ] Play on break completion
- [ ] Reset currentTime before play (prevent overlap)
- [ ] Try/catch with console.error (graceful autoplay failure)

#### 2.2 Notification manager

- [ ] Request notification permission on app init (silent fail if denied)
- [ ] `registration.showNotification()` when break completes
- [ ] Notification content: title "Break Over", body "Time to get back to work", icon (crossed swords)
- [ ] Notification click: focus existing window or open new one
- [ ] Tag-based deduplication (`tag: 'break-finished'`)

### Phase 3: PWA

#### 3.1 Dependencies

- [ ] Install `vite-plugin-pwa@1.2.0` (with `--force` for Vite 8 peer dep)
- [ ] Install `workbox-precaching@7.4.0` and `workbox-routing@7.4.0`

#### 3.2 Vite PWA config

- [ ] Add `VitePWA()` to `vite.config.ts`
- [ ] `registerType: 'autoUpdate'`
- [ ] `strategies: 'injectManifest'`
- [ ] `srcDir: 'src'`, `filename: 'sw.ts'`
- [ ] Manifest: name "Tekketsu", short_name "Tekketsu", display standalone, orientation portrait
- [ ] Theme color: `#fafafa`, background color: `#fafafa`
- [ ] Icons: crossed swords at 192x192 and 512x512 (need to generate sized versions)
- [ ] `includeAssets` for images/audio
- [ ] Runtime caching for fonts (cache-first, 1 year TTL)

#### 3.3 Service worker (`src/sw.ts`)

- [ ] `precacheAndRoute(self.__WB_MANIFEST)`
- [ ] `cleanupOutdatedCaches()`
- [ ] Skip-waiting message handler
- [ ] Push notification event listener
- [ ] Notification click handler (focus/open window)
- [ ] Navigation route fallback to index.html

#### 3.4 Offline support

- [ ] All static assets precached (JS, CSS, HTML, images, audio, fonts)
- [ ] App fully functional offline after first load (auth is the only network dependency)

### Phase 4: Polish

- [ ] Test all states on actual mobile device (iPhone + Android)
- [ ] Verify single-screen constraint — no scrolling on 390x844 viewport
- [ ] Verify notification fires when phone is locked / app is backgrounded
- [ ] Verify sound plays on break completion
- [ ] Verify PWA installs to home screen (iOS + Android)
- [ ] Verify offline works after install
- [ ] Verify Google OAuth flow end-to-end (dev + prod)
- [ ] Loading screen shows kanji animation on initial load / auth check

---

## Product Spec Reference

Full product spec is in `gakucha-spec.md` at the Desktop root. Key behavioral rules to remember:

**Timer Mode**

- Countdown from configured duration (1–60 min, default 20, ±5 increments)
- MM:SS zero-padded display
- Timer keeps running during breaks
- Sets increment when break starts (not ends)
- Complete when timer hits 00:00

**Sets Mode**

- Target sets (1–100, default 30, ±5 increments)
- Display: remaining / target (e.g. 27 / 30)
- Stopwatch counts up between sets
- Stopwatch pauses during breaks
- Stopwatch resets to 00:00 after each break
- Sets decrement when break starts
- Complete when remaining hits 0

**Break System**

- 5 presets: 30s, 45s, 60s, 90s, 120s
- One tap to start, no confirmation
- No stacking, no cancellation
- Only available while workout is running (not paused)
- Sound + notification fire on completion

**State Management**

- React built-in only (`useReducer`)
- No external state library
- All state is ephemeral — nothing persists to database
- Only database table is `users` from auth
