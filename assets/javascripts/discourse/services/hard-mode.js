import Service, { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";

const STORAGE_KEY = "discourse-hard-mode-enabled";

export default class HardModeService extends Service {
  @service siteSettings;

  @tracked enabled = false;
  @tracked showHud = false;
  @tracked blockedClicks = 0;

  constructor() {
    super(...arguments);
    this.loadState();
  }

  loadState() {
    if (!this.siteSettings.hard_mode_enabled) {
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    this.enabled = stored === null ? false : stored === "true";
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem(STORAGE_KEY, this.enabled);

    if (this.enabled) {
      this.showHud = true;
    }
  }

  toggleHud() {
    this.showHud = !this.showHud;
  }

  recordBlockedClick() {
    this.blockedClicks++;
  }

  get isAvailable() {
    return this.siteSettings.hard_mode_enabled;
  }
}
