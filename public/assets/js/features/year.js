export function syncYear() {
  const year = new Date().getFullYear();

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(year);
  });

  return year;
}
