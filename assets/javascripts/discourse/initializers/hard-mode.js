import { withPluginApi } from "discourse/lib/plugin-api";

function shouldAllowClick(event) {
  // Keyboard-triggered clicks have detail === 0
  // Mouse clicks have detail >= 1
  if (event.detail === 0) {
    return true;
  }

  const target = event.target;

  // Allow clicks in composer (need to type/format)
  if (target.closest("#reply-control, .d-editor")) {
    return true;
  }

  // Allow form inputs
  if (target.closest("input, textarea, select")) {
    return true;
  }

  // Allow modals (need to interact with dialogs)
  if (target.closest(".modal, .d-modal")) {
    return true;
  }

  // Block everything else (real mouse clicks)
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

function getShameTitle(count) {
  if (count >= 1000) {
    return `${count} blocked clicks - Platinum Shame`;
  } else if (count >= 500) {
    return `${count} blocked clicks - Gold Shame`;
  } else if (count >= 100) {
    return `${count} blocked clicks - Silver Shame`;
  }
  return `${count} blocked clicks in Hard Mode`;
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

  // Block ALL mouse clicks (except allowed areas)
  document.addEventListener(
    "click",
    (event) => {
      if (!hardModeService.enabled) {
        return;
      }

      if (!shouldAllowClick(event)) {
        event.preventDefault();
        event.stopPropagation();
        hardModeService.recordBlockedClick();
        showBlockedFeedback(event.clientX, event.clientY);
      }
    },
    true
  );

  // Add shame badge using the modern poster-name-icons transformer
  api.registerValueTransformer("poster-name-icons", ({ value, context }) => {
    const shameCount = context.post?.hard_mode_shame_count;

    if (!shameCount || shameCount === 0) {
      return value;
    }

    return [
      ...value,
      {
        icon: "mouse-pointer",
        className: "hard-mode-shame-icon",
        text: String(shameCount),
        title: getShameTitle(shameCount),
      },
    ];
  });
}

export default {
  name: "hard-mode",
  initialize() {
    withPluginApi("1.0.0", initializeHardMode);
  },
};
