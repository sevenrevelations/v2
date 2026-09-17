# blobby.vip

A minimalist, highly customizable browser-controller homepage designed for GitHub Pages + MIT App Inventor.

## What changed in v6

- Removed the web-based tab bar. Tabs are expected to be handled natively in MIT App Inventor.
- Removed the duplicate homepage search box. There is now one omnibox for both searches and URLs.
- Redesigned the interface around a cleaner minimalist visual system.
- Rebuilt Layout Edit as a **12 × 12 snap grid**.
- Every visible major block can be moved square-by-square.
- Grid drops that would overlap another visible block are rejected.
- Pointer/touch dragging and keyboard arrow nudging are supported in Grid Edit.
- Existing v5 settings are migrated automatically.
- Themes, custom colors, backgrounds, ambient effects, RGB mode, profiles, shortcuts, recent pages, Performance Mode, and imports/exports remain available.

## Layout blocks

The movable grid currently includes:

- Utility/settings controls
- Search/navigation bar
- blobby.vip title
- Clock
- Shortcuts
- Recent pages
- Desktop preview

Open **Settings → Layout → Edit grid layout**, or press the ⌘ button. Drag a block using its ✥ handle. Green cells are available; red cells are occupied/invalid. Save or cancel from the floating toolbar.

The editor works with mouse, touch/pointer input, and arrow keys while a move handle is focused.

## Customization

The project keeps the full customization system:

- 19+ preset themes
- Custom color editor
- Solid, gradient, URL, or uploaded backgrounds
- Panel opacity, glass blur, radius, shadows
- RGB logo/search/buttons/panels/ambient glow
- Rain + lightning + rainy glass
- Snow, stars, particles, fireflies, orbs, aurora, fog, Matrix rain, bubbles, shooting stars, waves, RGB glow, dust
- Effect density, speed, opacity, size
- Homepage visibility controls
- Shortcut folders and reordering
- Complete customization profiles
- Saved grid layouts
- Performance Mode and reduced motion
- Settings/theme import and export

## App Inventor architecture

GitHub Pages hosts the UI only. External websites are loaded by App Inventor's real browser WebViewer rather than an iframe.

blobby.vip sends commands such as:

```text
NAVIGATE|https://example.com/
BACK|https://previous.example/
FORWARD|https://next.example/
REFRESH
HOME
EXPAND_UI|settings
EXPAND_UI|layout
RESTORE_UI|browser
RESTORE_UI|home
```

Tabs are deliberately not sent or managed by the GitHub UI anymore. Your MIT App Inventor tab system can own the active WebViewer and send its current URL back with `URL|https://...`.

See `APP_INVENTOR_SETUP.md` for the block logic.

## Files

```text
index.html
style.css
core.js
themes.js
effects.js
layout.js
browser-bridge.js
app.js
APP_INVENTOR_SETUP.md
README.md
tests/check.cjs
```

## GitHub Pages

Upload the files directly to your repository root so `index.html` is visible immediately. Then use Settings → Pages → Deploy from a branch → main → / (root).
