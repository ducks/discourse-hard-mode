import { withPluginApi } from "discourse/lib/plugin-api";

// Selectors for elements that should be blocked in hard mode
const BLOCKED_SELECTORS = [
  // Topic list navigation
  ".topic-list-item",
  ".topic-list .main-link a",
  ".category-list a",
  ".latest-topic-list-item a",

  // Post navigation and actions
  ".post-stream .topic-post",
  ".post-controls button",
  ".post-actions button",

  // Navigation links
  ".nav-pills a",
  ".navigation-container a",
  "#navigation-bar a",
  ".category-breadcrumb a",

  // Sidebar
  ".sidebar-section-link",

  // Header navigation
  ".header-dropdown-toggle",
  ".d-header .icons a",
];

function isRealMouseClick(event) {
  // Programmatic clicks (from keyboard shortcuts) have detail=0 or no coordinates
  // Real mouse clicks have detail >= 1 and real screen coordinates
  if (event.detail === 0) {
    return false;
  }

  // Also check if it's a synthetic click (no real pointer position)
  if (event.screenX === 0 && event.screenY === 0) {
    return false;
  }

  return true;
}

function shouldBlockClick(event) {
  // Only block real mouse clicks, not keyboard-triggered ones
  if (!isRealMouseClick(event)) {
    return false;
  }

  const target = event.target;

  // Allow clicks on hard mode controls
  if (target.closest(".hard-mode-toggle")) {
    return false;
  }

  // Allow clicks on form elements
  if (target.closest("input, textarea, select, button[type='submit']")) {
    return false;
  }

  // Allow clicks on composer
  if (target.closest("#reply-control, .d-editor")) {
    return false;
  }

  // Allow clicks on modals
  if (target.closest(".modal, .d-modal")) {
    return false;
  }

  // Allow clicks on keyboard shortcut help modal
  if (target.closest(".keyboard-shortcuts-modal")) {
    return false;
  }

  // Check if click is on a blocked element
  for (const selector of BLOCKED_SELECTORS) {
    if (target.closest(selector)) {
      return true;
    }
  }

  // Block all anchor clicks
  if (target.closest("a[href]")) {
    return true;
  }

  return false;
}

function showBlockedFeedback(x, y) {
  const feedback = document.createElement("div");
  feedback.className = "hard-mode-blocked-feedback";
  feedback.textContent = "Use keyboard!";
  feedback.style.left = `${x}px`;
  feedback.style.top = `${y}px`;
  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.classList.add("fade-out");
    setTimeout(() => feedback.remove(), 300);
  }, 500);
}

function initializeHardMode(api) {
  const siteSettings = api.container.lookup("service:site-settings");

  if (!siteSettings.hard_mode_enabled) {
    return;
  }

  const hardModeService = api.container.lookup("service:hard-mode");

  // Toggle hard mode with Ctrl+Shift+H
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === "H") {
        event.preventDefault();
        hardModeService.toggle();
      }
    },
    true
  );

  // Add click blocker
  document.addEventListener(
    "click",
    (event) => {
      if (!hardModeService.enabled) {
        return;
      }

      if (shouldBlockClick(event)) {
        event.preventDefault();
        event.stopPropagation();
        hardModeService.recordBlockedClick();

        // Visual feedback
        showBlockedFeedback(event.clientX, event.clientY);
      }
    },
    true
  );
}

export default {
  name: "hard-mode",
  initialize() {
    withPluginApi("1.0.0", initializeHardMode);
  },
};
