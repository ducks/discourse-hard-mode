import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

const STORAGE_KEY = "discourse-hard-mode-enabled";

export default class HardModeService extends Service {
  @tracked enabled = false;
  @tracked blockedClicks = 0;

  constructor() {
    super(...arguments);
    this.loadState();
  }

  loadState() {
    const stored = localStorage.getItem(STORAGE_KEY);
    this.enabled = stored === "true";
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem(STORAGE_KEY, this.enabled);
    this.showToast(this.enabled ? "HARD MODE ON" : "Hard Mode Off");
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
}
