# blobby.vip + MIT App Inventor setup

blobby.vip is the customizable **home/controller UI**. It no longer renders browser tabs. Your MIT App Inventor project can own the tab system and the real WebViewer(s).

External websites are never loaded in an iframe. JavaScript in blobby.vip sends commands through `window.AppInventor.setWebViewString(...)`.

## Recommended Designer structure

Create:

1. `VerticalArrangement_Main`
   - Width: Fill parent
   - Height: Fill parent
2. `WebViewer_UI`
   - HomeUrl: your GitHub Pages blobby.vip URL
   - Width: Fill parent
   - Height: Fill parent while on the blobby.vip home screen
3. `WebViewer_Browser`
   - Width: Fill parent
   - Height: Fill parent
   - Visible: false initially

If you build App Inventor tabs later, each tab can point to its own browser WebViewer/state. blobby.vip itself does not create or close tabs anymore.

## Controller behavior

On the home screen, `WebViewer_UI` fills the screen so users can see their title, effects, shortcuts, clock, recent sites, and custom grid layout.

After a website opens, blobby.vip automatically changes its internal layout to a compact controller containing only the search/navigation bar. In App Inventor, shrink `WebViewer_UI` to about **70–76 px** and show the real browser WebViewer underneath it.

Settings and Grid Edit send `EXPAND_UI`, so App Inventor can temporarily hide the browser and expand the blobby.vip UI to full screen. Closing those panels sends `RESTORE_UI`.

## Messages sent from blobby.vip

| Message | App Inventor action |
|---|---|
| `NAVIGATE|https://example.com/` | Show the active browser WebViewer and call `GoToUrl(url)` |
| `BACK|https://target.example/` | Navigate the active browser tab/WebViewer to the supplied target |
| `FORWARD|https://target.example/` | Navigate the active browser tab/WebViewer to the supplied target |
| `REFRESH` | Reload the active browser WebViewer |
| `HOME` or `SHOW_HOME` | Hide browser content and expand `WebViewer_UI` |
| `OPEN_EXTERNAL|url` | Optional: open in Android's system browser |
| `EXPAND_UI|settings` | Hide browser content and expand `WebViewer_UI` to Fill parent |
| `EXPAND_UI|layout` | Same, so the 12 × 12 grid editor has the whole screen |
| `RESTORE_UI|browser` | Shrink `WebViewer_UI` back to about 74 px and show the active browser WebViewer |
| `RESTORE_UI|home` | Keep `WebViewer_UI` full screen |

There are intentionally **no NEW_TAB / CLOSE_TAB / SWITCH_TAB messages** now. Build those natively in App Inventor.

## WebViewStringChange logic

Pseudo-block logic:

```text
when WebViewer_UI.WebViewStringChange(value)

if value starts with "NAVIGATE|"
    set url to text after "NAVIGATE|"
    set WebViewer_UI.Height to 74 px
    set WebViewer_Browser.Visible to true
    call WebViewer_Browser.GoToUrl(url)

else if value starts with "BACK|"
    call WebViewer_Browser.GoToUrl(text after "BACK|")

else if value starts with "FORWARD|"
    call WebViewer_Browser.GoToUrl(text after "FORWARD|")

else if value = "REFRESH"
    call WebViewer_Browser.Reload

else if value = "HOME" or value = "SHOW_HOME"
    set WebViewer_Browser.Visible to false
    set WebViewer_UI.Height to Fill parent

else if value starts with "EXPAND_UI|"
    set WebViewer_Browser.Visible to false
    set WebViewer_UI.Height to Fill parent

else if value = "RESTORE_UI|browser"
    set WebViewer_UI.Height to 74 px
    set WebViewer_Browser.Visible to true

else if value = "RESTORE_UI|home"
    set WebViewer_Browser.Visible to false
    set WebViewer_UI.Height to Fill parent
```

## Sync the real page URL back to blobby.vip

When the active browser WebViewer loads a page:

```text
when WebViewer_Browser.PageLoaded(url)
    set WebViewer_UI.WebViewString to join "URL|" url
```

If your App Inventor tab system changes active tabs, send the selected tab's URL back to blobby.vip using the same `URL|...` message so the omnibox always matches the current tab.

## GitHub Pages

Keep `index.html` at the repository root, then enable Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
