# Copilot Instructions for Serial Date Converter

## Project Overview
A Progressive Web App (PWA) that converts between Excel serial date numbers and human-readable dates. Single-page vanilla JavaScript application with i18n support (EN, DA, NO, SV, DE).

## Architecture

**Single-Page Static PWA Structure:**
- `index.html` - Tailwind CSS UI with language toggle and bi-directional conversion inputs
- `script.js` - All business logic, event handlers, i18n, and analytics
- `sw.js` - Service worker for offline capability and asset caching
- `manifest.json` - PWA configuration for installability

**Core Components:**
- Date ↔ Excel conversion utilities (`getExcelSerial()`, `getDateFromExcel()`)
- Multi-language translation system with auto-detection (EN, DA, NO, SV, DE)
- Light/Dark theme with system preference detection
- Reference tables showing relative dates (past/future)
- Analytics via Google Forms (no-cors POST requests)

## Key Conventions

### Date Calculation Standard
Excel serial dates are calculated from `1899-12-30` as base (Day 0):
```javascript
const baseDate = Date.UTC(1899, 11, 30);
const serial = (utcDate - baseDate) / MS_PER_DAY;
```
Always use UTC methods to avoid timezone issues.

### Version Synchronization
**CRITICAL:** When making ANY changes to the application, ALWAYS increment the `VERSION` constant in BOTH `script.js` and `sw.js`. Service worker cache invalidation depends on this - users will not see changes without a version bump:
```javascript
const VERSION = '1.4'; // ALWAYS update in BOTH files for ANY change
const CACHE_NAME = `serial-date-converter-v${VERSION}`;
```

### Theme System
- Tailwind CSS `dark:` mode with class-based toggling
- System preference detection: `window.matchMedia('(prefers-color-scheme: dark)')`
- User preference stored in `localStorage.theme`
- Light mode: slate-50 background with white cards
- Dark mode: slate-950 background with slate-900 cards

### Internationalization Pattern
- Translations stored in `translations` object keyed by lang code (`en`, `da`, `no`, `sv`, `de`)
- HTML elements marked with `data-i18n` attribute
- Language auto-detected from `navigator.language`
- Update UI via `updateLanguage()` which also re-renders reference tables

### Analytics Approach
Uses Google Forms as a free analytics backend with `mode: 'no-cors'` to avoid CORS errors. Debounced to 2 seconds to prevent spam:
```javascript
function debouncedLog(action) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => logToGoogle(action), 2000);
}
```

## Development Workflow

**Local Testing:**
```powershell
# Serve with any static server (Python example)
python -m http.server 8000
# Then open http://localhost:8000
```

**PWA Testing:**
- Service worker only works over HTTPS or localhost
- Test installation on mobile devices via GitHub Pages deployment
- Clear cache between version updates to test SW updates

**Adding New Language:**
1. Add translation object to `translations` in `script.js`
2. Add button to language menu in `index.html` with correct flag icon (`fi fi-XX`)
3. Add case to auto-detection logic if needed
4. Update `langMap` in `updateLanguage()`

**Style Modifications:**
- Uses Tailwind CDN (loaded from `index.html`)
- Custom styles in `style.css` are minimal (scrollbar, dark mode fixes)
- Color scheme: slate-900 background with teal/blue gradients

## Testing Checklist
- Verify conversion accuracy for edge cases (year boundaries, leap years)
- Test offline functionality (disable network after first load)
- Check language switching updates all UI elements
- Verify PWA installability on iOS Safari, Android Chrome, desktop browsers
- Confirm analytics events fire without console errors

## Common Pitfalls
- **CRITICAL:** Forgetting to update VERSION in BOTH `script.js` AND `sw.js` means users won't see changes (cache invalidation fails)
- **REMEMBER:** Increment version for ANY change to HTML, CSS, or JS - service worker caches everything
- Using local time instead of UTC causes timezone-dependent bugs
- Service worker caching can hide changes during development (use DevTools → Application → Clear Storage)
- Google Forms analytics requires exact entry field IDs (changes break logging)
