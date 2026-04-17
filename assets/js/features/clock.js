export function startClock() {
  const clockEl = document.getElementById("local-time");
  if (!clockEl) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const updateClock = () => {
    clockEl.textContent = formatter.format(new Date());
  };

  updateClock();
  return window.setInterval(updateClock, 1000);
}
