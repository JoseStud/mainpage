# Systems + Guestbook Split

## Purpose

Owns the paired two-column portal area that presents the status board and the latest guestbook entries as one shared layout chunk.

## Important anchors and classes

- Anchors: `site-signals`, `guestbook`
- Shared layout wrapper: `portal-split portal-split-signals`
- Systems classes: `terminal-box`, `terminal-header`, `terminal-grid`, `terminal-row`
- Guestbook classes: `guestbook-box`, `entry-list`, `entry-item`, `entry-top`, `entry-state`

## Edit when

Edit this partial when changing the status board rows, guestbook preview entries, or the shared split layout. Keep both sections in the same file unless the layout contract itself changes, because the wrapper controls their side-by-side composition.
