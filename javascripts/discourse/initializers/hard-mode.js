import { withPluginApi } from "discourse/lib/plugin-api";

function shouldAllowClick(event) {
  if (event.detail === 0) {
    return true;
  }

  const target = event.target;

  if (target.closest("#reply-control, .d-editor")) {
    return true;
  }

  if (target.closest("input, textarea, select")) {
    return true;
  }

  if (target.closest(".modal, .d-modal")) {
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
  const hardModeService = api.container.lookup("service:hard-mode");

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
}

export default {
  name: "hard-mode",
  initialize() {
    withPluginApi("1.0.0", initializeHardMode);
  },
};
