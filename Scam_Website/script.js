(() => {
  "use strict";

  // Fictional, local-only detector fixtures. Their attributes are checked without reading values.
  const fixtureInputs = [
    document.getElementById("fixture-nric"),
    document.getElementById("fixture-bank"),
    document.getElementById("fixture-password"),
    document.getElementById("fixture-otp"),
    document.getElementById("fixture-card"),
  ];

  const fixturePanelIsPresent = fixtureInputs.some((input) => input !== null);
  const fixtureIsSafe = !fixturePanelIsPresent || (fixtureInputs.length === 5 && fixtureInputs.every((input) => {
    return input
      && input.disabled
      && input.readOnly
      && input.getAttribute("tabindex") === "-1"
      && input.getAttribute("autocomplete") === "off"
      && input.closest("form") === null;
  }));

  if (!fixtureIsSafe) {
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = "<section class=\"page-shell\" style=\"padding: 5rem 0\"><h1>Safety configuration error</h1><p>This local specimen cannot run until its disabled test fixtures are restored.</p></section>";
    }
    return;
  }

  const reference = document.getElementById("voucher-reference");
  const modal = document.getElementById("simulation-modal");
  const closeButton = document.getElementById("modal-close");
  const countdown = document.getElementById("countdown");
  const countdownLabel = document.getElementById("countdown-label");
  const activityPopup = document.getElementById("activity-popup");
  let lastFocusedElement = null;
  let secondsRemaining = (4 * 60 * 60) + (27 * 60) + 18;

  function createReference() {
    const segment = () => String(Math.floor(1000 + Math.random() * 9000));
    return `CRV-${segment()}-${segment()}`;
  }

  function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
      .map((part) => String(part).padStart(2, "0"))
      .join(":");
  }

  function updateCountdown() {
    if (secondsRemaining <= 0) {
      countdown.textContent = "00:00:00";
      countdownLabel.textContent = "Review window reached";
      return false;
    }

    countdown.textContent = formatTime(secondsRemaining);
    secondsRemaining -= 1;
    return true;
  }

  function getFocusableModalElements() {
    return [...modal.querySelectorAll("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])")];
  }

  function openModal(trigger) {
    lastFocusedElement = trigger instanceof HTMLElement ? trigger : document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    closeButton.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }

  function handleBlockedLink(event) {
    event.preventDefault();
    const link = event.currentTarget;
    if (link.dataset.skip === "main") {
      document.getElementById("main-content").focus();
      return;
    }
    openModal(link);
  }

  function handleModalKeydown(event) {
    if (modal.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusableModalElements();
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (reference) reference.textContent = createReference();

  // Only explicit local pages are reachable. Every external-looking link stays on this specimen.
  document.querySelectorAll("a").forEach((link) => {
    if (link.hasAttribute("data-local-page")) return;
    link.addEventListener("click", handleBlockedLink);
  });

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => openModal(button));
  });

  document.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.querySelectorAll("[data-dismiss-popup]").forEach((button) => {
    button.addEventListener("click", () => {
      if (activityPopup) activityPopup.hidden = true;
    });
  });

  document.addEventListener("keydown", handleModalKeydown);

  if (countdown && countdownLabel) {
    updateCountdown();
    const timer = window.setInterval(() => {
      if (!updateCountdown()) window.clearInterval(timer);
    }, 1000);
  }
})();
