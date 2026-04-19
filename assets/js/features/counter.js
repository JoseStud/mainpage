export function startCounter() {
  const counter = document.getElementById("counter");
  if (!counter) {
    return null;
  }

  const cells = Array.from(counter.querySelectorAll("[data-counter-cell]"));
  if (cells.length === 0) {
    return null;
  }

  return window.setInterval(() => {
    let carry = 1;

    for (let index = cells.length - 1; index >= 0 && carry; index -= 1) {
      let next = Number.parseInt(cells[index].textContent || "0", 10) + carry;

      if (next >= 10) {
        next = 0;
        carry = 1;
      } else {
        carry = 0;
      }

      cells[index].textContent = String(next);
    }
  }, 12000);
}
