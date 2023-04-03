window.addEventListener('DOMContentLoaded', () => {
  const display = getDisplayValue();

  const numberButtons = document.querySelectorAll('.digit');

  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      handleNumberClick(display, button.textContent);
    });
  });

  updateTime();
  setInterval(updateTime, 1000);
});

/**
 * @param {HTMLInputElement} display
 * @param {string} number
 * @returns {void}
 */
function handleNumberClick(display, number) {
  const displayValue = display.textContent.replaceAll(
    ',',
    ''
  );

  if (displayValue.length === 9) {
    return;
  }

  const updatedDisplayValue = displayValue + number;
  const updatedDisplayValueAsNumber = Number(
    updatedDisplayValue
  );
  display.textContent =
    updatedDisplayValueAsNumber.toLocaleString();
}

function getDisplayValue() {
  return document.getElementById('display-value');
}

function updateTime() {
  const time = document.getElementById('time');
  const date = new Date();
  const hours =
    date.getHours() > 12
      ? date.getHours() - 12
      : date.getHours();
  const minutes =
    date.getMinutes() < 10
      ? `0${date.getMinutes()}`
      : date.getMinutes();
  time.innerHTML = `${hours}:${minutes}`;
}
