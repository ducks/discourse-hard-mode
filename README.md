# discourse-hard-mode

Vim-style hard mode for Discourse. Blocks mouse clicks and forces keyboard-only
navigation. Train yourself to use Discourse's keyboard shortcuts.

## Features

- Blocks all mouse clicks (except composer, form inputs, and modals)
- Keyboard-triggered actions work normally (Enter, Space, shortcuts)
- Shows "Use keyboard!" feedback on blocked clicks
- Toggle on/off with Ctrl+Shift+H
- Per-user preference stored in localStorage

## Installation

1. Go to Admin > Customize > Themes
2. Click "Install" > "From a git repository"
3. Paste: `https://github.com/ducks/discourse-hard-mode`
4. Add to your active theme

## Usage

Press Ctrl+Shift+H to toggle hard mode. Try to click something. Get rejected.
Learn the shortcuts.

## How It Works

Uses `event.detail` to distinguish mouse from keyboard clicks:

- `detail === 0`: keyboard-triggered (allowed)
- `detail >= 1`: real mouse click (blocked)

## Keyboard Shortcuts

Press `?` to see all shortcuts. Common ones:

| Key | Action |
|-----|--------|
| j / k | Next / Previous post |
| g h | Go home |
| g l | Go to latest |
| / | Search |
| r | Reply to topic |
| Shift+R | Reply to post |
| l | Like post |
| Enter | Open selected topic |
| ? | Show all shortcuts |

## What Still Works

Mouse clicks allowed on:

- Composer (need to position cursor, select text)
- Form inputs (search box, login fields)
- Modal dialogs

## License

MIT
