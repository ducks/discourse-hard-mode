import Service, { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { ajax } from "discourse/lib/ajax";
import discourseDebounce from "discourse/lib/debounce";

const STORAGE_KEY = "discourse-hard-mode-enabled";
const SAVE_DEBOUNCE_MS = 5000;
const SAVE_THRESHOLD = 10;

export default class HardModeService extends Service {
  @service siteSettings;
  @service currentUser;

  @tracked enabled = false;
  @tracked blockedClicks = 0;
  @tracked shameCount = 0;

  // Track unsaved clicks for debouncing
  _unsavedClicks = 0;

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

    // Load shame count from current user
    if (this.currentUser) {
      this.shameCount = this.currentUser.hard_mode_shame_count || 0;
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem(STORAGE_KEY, this.enabled);

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
    this._unsavedClicks++;

    // Save immediately if we hit the threshold, otherwise debounce
    if (this._unsavedClicks >= SAVE_THRESHOLD) {
      this._saveShameCount();
    } else {
      this._debouncedSave();
    }
  }

  _debouncedSave() {
    discourseDebounce(this, this._saveShameCount, SAVE_DEBOUNCE_MS);
  }

  async _saveShameCount() {
    if (!this.currentUser || this._unsavedClicks === 0) {
      return;
    }

    const clicksToSave = this._unsavedClicks;
    this._unsavedClicks = 0;

    const newShameCount = this.shameCount + clicksToSave;

    try {
      await ajax(`/u/${this.currentUser.username}.json`, {
        type: "PUT",
        data: {
          custom_fields: {
            hard_mode_shame_count: newShameCount,
          },
        },
      });

      this.shameCount = newShameCount;

      // Update currentUser so it reflects everywhere
      if (this.currentUser) {
        this.currentUser.set("hard_mode_shame_count", newShameCount);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[hard-mode] Failed to save shame count:", error);
      // Put the clicks back so we can try again
      this._unsavedClicks += clicksToSave;
    }
  }

  get isAvailable() {
    return this.siteSettings.hard_mode_enabled;
  }
}
