# discourse-hard-mode

Vim-style hard mode for Discourse. Disables mouse navigation and forces
keyboard-only interaction. Train yourself to use Discourse's excellent keyboard
shortcuts instead of reaching for the mouse.

## Features

- Blocks mouse clicks on navigation elements (topic list, posts, sidebar,
  header links)
- Shows "Use keyboard!" feedback on blocked clicks with a shake animation
- Floating HUD displays common keyboard shortcuts
- Tracks blocked click count as a badge of shame
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

## Keyboard Shortcuts

Hard mode enforces usage of Discourse's built-in shortcuts:

| Key | Action |
|-----|--------|
| j / k | Next / Previous post |
| g h | Go home |
| g l | Go to latest |
| g n | Go to new |
| g u | Go to unread |
| g c | Go to categories |
| g t | Go to top |
| / | Search |
| r | Reply to topic |
| l | Like post |
| t | New topic |
| e | Edit post |
| ? | Show all shortcuts |

Press `?` anywhere in Discourse to see the complete list.

## What Gets Blocked

Hard mode blocks clicks on:

- Topic list links
- Post content and actions
- Navigation pills and breadcrumbs
- Sidebar links
- Header navigation icons
- Any anchor link

What still works:

- Form inputs (search box, composer, etc.)
- Modal dialogs
- The hard mode HUD itself
- Submit buttons

## License

MIT
