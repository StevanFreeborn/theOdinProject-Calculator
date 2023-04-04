/**
 * @typedef {Object} State
 * @property {string} displayValue
 * @property {number} firstOperand
 * @property {string} operator
 * @property {number} secondOperand
 * @property {boolean} waitingForFirstOperand
 * @property {boolean} waitingForSecondOperand
 */
const state = {
  displayValue: '0',
  firstOperand: null,
  operator: null,
  secondOperand: null,
  waitingForFirstOperand: true,
  waitingForSecondOperand: false,
};

window.addEventListener('click', () => console.log(state));

window.addEventListener('DOMContentLoaded', () => {
  updateDisplayValue(state.displayValue);

  const numberButtons = document.querySelectorAll('.digit');

  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      handleNumberClick(state, button.textContent);
    });
  });

  const clearButton =
    document.querySelector('#clear-button');

  clearButton.addEventListener('click', () => {
    resetAll(state);
  });

  const operatorButtons =
    document.querySelectorAll('.operator');

  operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
      handleOperatorClick(state, button.textContent);
    });
  });

  const equalsButton = document.querySelector(
    '#equals-button'
  );

  equalsButton.addEventListener('click', () => {
    const result = performCalculation(state);
    updateState(state, {
      displayValue: String(result.toLocaleString()),
      firstOperand: result,
      waitingForFirstOperand: false,
      waitingForSecondOperand: true,
    });
    updateDisplayValue(state.displayValue);
  });

  updateTime();
  setInterval(updateTime, 1000);
});

function handleOperatorClick(state, operator) {
  if (state.waitingForSecondOperand === true) {
    updateState(state, {
      operator,
    });
    return;
  }

  if (state.firstOperand === null) {
    updateState(state, {
      firstOperand: Number(state.displayValue),
    });
  }

  if (state.operator !== null) {
    const result = performCalculation(state);
    updateState(state, {
      displayValue: String(result.toLocaleString()),
      firstOperand: result,
      operator,
      waitingForFirstOperand: false,
      waitingForSecondOperand: true,
    });
    updateDisplayValue(state.displayValue);
    return;
  }

  updateState(state, {
    waitingForFirstOperand: false,
    waitingForSecondOperand: true,
    operator,
  });
}

/**
 * @param {State} state
 * @param {string} number
 * @returns {void}
 */
function handleNumberClick(state, number) {
  const displayValue = state.displayValue.replaceAll(
    ',',
    ''
  );

  if (displayValue.length === 10) {
    return;
  }

  let updatedDisplayValue = displayValue + number;

  if (
    state.waitingForSecondOperand === true ||
    state.waitingForFirstOperand === true
  ) {
    updatedDisplayValue = number;
  }

  const updatedDisplayValueAsNumber = Number(
    updatedDisplayValue
  );

  updateDisplayValue(
    updatedDisplayValueAsNumber.toLocaleString()
  );

  updateState(state, {
    displayValue: updatedDisplayValue,
  });

  if (state.waitingForSecondOperand === true) {
    updateState(state, {
      secondOperand: updatedDisplayValueAsNumber,
    });
    return;
  }

  updateState(state, {
    firstOperand: updatedDisplayValueAsNumber,
    waitingForFirstOperand: false,
  });
}

function performCalculation(state) {
  const { firstOperand, secondOperand, operator } = state;

  switch (operator) {
    case '+':
      return firstOperand + secondOperand;
    case '-':
      return firstOperand - secondOperand;
    case 'x':
      return firstOperand * secondOperand;
    case '÷':
      return firstOperand / secondOperand;
    default:
      return 0;
  }
}

/**
 * Resets the state
 * @param {State} state
 * @returns {void}
 */
function resetAll(state) {
  updateState(state, {
    displayValue: '0',
    firstOperand: 0,
    operator: null,
    secondOperand: null,
    waitingForSecondOperand: false,
  });

  updateDisplayValue(state.displayValue);
}

/**
 * Updates the display value
 * @param {string} displayValue
 * @returns {void}
 */
function updateDisplayValue(displayValue) {
  const display = document.querySelector('#display-value');
  display.textContent = displayValue;
}

/**
 * Updates the state object with the new state
 * @param {State} state
 * @param {State} newState
 * @returns {void}
 */
function updateState(state, newState) {
  Object.assign(state, newState);
}

/**
 * Updates the time
 * @returns {void}
 */
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
