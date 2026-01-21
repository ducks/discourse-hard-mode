import Component from "@glimmer/component";
import { service } from "@ember/service";
import { on } from "@ember/modifier";
import icon from "discourse/helpers/d-icon";

const SHORTCUTS = [
  { key: "j / k", action: "Next / Previous post" },
  { key: "g h", action: "Go home" },
  { key: "g l", action: "Go to latest" },
  { key: "g n", action: "Go to new" },
  { key: "g u", action: "Go to unread" },
  { key: "g c", action: "Go to categories" },
  { key: "g t", action: "Go to top" },
  { key: "/", action: "Search" },
  { key: "r", action: "Reply to topic" },
  { key: "l", action: "Like post" },
  { key: "t", action: "New topic" },
  { key: "!", action: "Flag post" },
  { key: "e", action: "Edit post" },
  { key: "d", action: "Delete post" },
  { key: "s", action: "Share topic" },
  { key: "u", action: "Back" },
  { key: "?", action: "Show all shortcuts" },
];

export default class HardModeHud extends Component {
  @service hardMode;

  get shortcuts() {
    return SHORTCUTS;
  }

  <template>
    {{#if this.hardMode.enabled}}
      {{#if this.hardMode.showHud}}
        <div class="hard-mode-hud">
          <div class="hard-mode-hud__header">
            <span class="hard-mode-hud__title">
              {{icon "keyboard"}} HARD MODE
            </span>
            <button
              class="hard-mode-hud__close"
              {{on "click" this.hardMode.toggleHud}}
              type="button"
            >×</button>
          </div>
          <div class="hard-mode-hud__stats">
            <span class="blocked-count">{{this.hardMode.blockedClicks}} clicks blocked</span>
          </div>
          <div class="hard-mode-hud__shortcuts">
            {{#each this.shortcuts as |shortcut|}}
              <div class="shortcut-row">
                <kbd>{{shortcut.key}}</kbd>
                <span>{{shortcut.action}}</span>
              </div>
            {{/each}}
          </div>
          <div class="hard-mode-hud__footer">
            Press <kbd>?</kbd> for all shortcuts
          </div>
        </div>
      {{else}}
        <button
          class="hard-mode-indicator"
          {{on "click" this.hardMode.toggleHud}}
          title="Hard Mode Active - Click to show shortcuts"
          type="button"
        >
          {{icon "keyboard"}}
          <span class="blocked-count">{{this.hardMode.blockedClicks}}</span>
        </button>
      {{/if}}
    {{/if}}
  </template>
}
