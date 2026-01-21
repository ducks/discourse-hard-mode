import Service, { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";

const STORAGE_KEY = "discourse-hard-mode-enabled";

export default class HardModeService extends Service {
  @service siteSettings;

  @tracked enabled = false;
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
    this.enabled = stored === "true";
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem(STORAGE_KEY, this.enabled);

    // Show toast notification
    const message = this.enabled ? "Hard Mode: ON" : "Hard Mode: OFF";
    this.showToast(message);
  }

  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "hard-mode-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 1500);
  }

  recordBlockedClick() {
    this.blockedClicks++;
  }

  get isAvailable() {
    return this.siteSettings.hard_mode_enabled;
  }
}
