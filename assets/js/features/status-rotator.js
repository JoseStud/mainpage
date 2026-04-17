export function startStatusRotator(messages) {
  const statusRotator = document.getElementById("status-rotator");
  if (!statusRotator || !Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  let messageIndex = 0;
  statusRotator.textContent = messages[messageIndex];

  if (messages.length === 1) {
    return null;
  }

  return window.setInterval(() => {
    messageIndex = (messageIndex + 1) % messages.length;
    statusRotator.textContent = messages[messageIndex];
  }, 3200);
}
