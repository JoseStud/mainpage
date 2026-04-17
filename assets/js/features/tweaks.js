export function initTweaks(defaults) {
  if (!defaults) {
    return;
  }

  const root = document.documentElement;
  const state = Object.assign({}, defaults);

  function syncSegment(id, value) {
    const segment = document.getElementById(id);
    if (!segment) {
      return;
    }

    segment.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("on", button.dataset.val === value);
    });
  }

  function applyTweaks(nextState) {
    root.dataset.theme = nextState.theme;
    syncSegment("segTheme", nextState.theme);
  }

  applyTweaks(state);

  window.addEventListener("message", (event) => {
    const data = event.data || {};
    const button = document.getElementById("tweaksBtn");
    const panel = document.getElementById("tweaksPanel");
    if (!button || !panel) {
      return;
    }

    if (data.type === "__activate_edit_mode") {
      button.classList.add("visible");
      panel.classList.add("open");
    } else if (data.type === "__deactivate_edit_mode") {
      button.classList.remove("visible");
      panel.classList.remove("open");
    }
  });

  if (window.parent) {
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
  }

  const button = document.getElementById("tweaksBtn");
  const closeButton = document.getElementById("tweaksClose");
  const panel = document.getElementById("tweaksPanel");

  if (button && panel) {
    button.addEventListener("click", () => {
      panel.classList.toggle("open");
    });
  }

  if (closeButton && panel) {
    closeButton.addEventListener("click", () => {
      panel.classList.remove("open");
    });
  }

  const themeSegment = document.getElementById("segTheme");
  if (themeSegment) {
    themeSegment.addEventListener("click", (event) => {
      const buttonTarget = event.target.closest("button");
      if (!buttonTarget) {
        return;
      }

      state.theme = buttonTarget.dataset.val;
      applyTweaks(state);

      if (window.parent) {
        window.parent.postMessage(
          {
            type: "__edit_mode_set_keys",
            edits: { theme: state.theme },
          },
          "*",
        );
      }
    });
  }
}
