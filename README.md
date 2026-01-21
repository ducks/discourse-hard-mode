# discourse-hard-mode

Vim-style hard mode for Discourse. Blocks all mouse clicks and forces
keyboard-only interaction. Train yourself to use Discourse's excellent keyboard
shortcuts instead of reaching for the mouse.

## Features

- Blocks all mouse clicks (except composer, form inputs, and modals)
- Allows keyboard-triggered actions (Enter, Space, shortcuts like r/l/t)
- Shows "Use keyboard!" feedback on blocked clicks with a shake animation
- Per-user preference stored in localStorage
- Toggle on/off with Ctrl+Shift+H

## Installation

Clone this repository into your Discourse plugins folder:

```bash
cd /var/discourse
git clone https://github.com/ducks/discourse-hard-mode.git plugins/discourse-hard-mode
./launcher rebuild app
```

For development, symlink into your local plugins directory:

```bash
ln -s ~/dev/discourse-hard-mode ~/discourse/plugins/discourse-hard-mode
```

## Usage

1. Enable the plugin in Admin > Settings > Plugins (`hard_mode_enabled`)
2. Press Ctrl+Shift+H to toggle hard mode on
3. Try to click something. Get rejected. Learn the shortcuts.

## How It Works

The plugin uses `event.detail` to distinguish between mouse and keyboard clicks:

- `detail === 0`: keyboard-triggered click (allowed)
- `detail >= 1`: real mouse click (blocked)

This means all of Discourse's keyboard shortcuts work normally, but you cannot
use the mouse to navigate.

## Keyboard Shortcuts

Hard mode enforces usage of Discourse's built-in shortcuts. Press `?` anywhere
to see the complete list. Some common ones:

| Key | Action |
|-----|--------|
| j / k | Next / Previous post |
| g h | Go home |
| g l | Go to latest |
| g n | Go to new |
| g u | Go to unread |
| / | Search |
| r | Reply to topic |
| Shift+R | Reply to post |
| l | Like post |
| t | New topic |
| Enter | Open selected topic |
| u | Go back |
| ? | Show all shortcuts |

## What Still Works

Mouse clicks are allowed on:

- Composer (need to position cursor, select text)
- Form inputs (search box, login fields)
- Modal dialogs (confirmations, settings)

## License

MIT
