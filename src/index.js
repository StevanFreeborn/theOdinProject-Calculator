/**
 * @typedef {Object} State
 * @property {number} displayValue - The value to be displayed on the calculator
 * @property {boolean} waitingForFirstOperand - Whether the calculator is waiting for the first operand
 * @property {number} firstOperand - The first operand
 * @property {string} operator - The operator
 * @property {boolean} waitingForSecondOperand - Whether the calculator is waiting for the second operand
 * @property {number} secondOperand - The second operand
 * @property {boolean} hasBeenEvaluated - Whether the entered calculation has been evaluated
 */
const state = {
  displayValue: 0,
  waitingForFirstOperand: true,
  firstOperand: null,
  operator: null,
  waitingForSecondOperand: false,
  secondOperand: null,
  hasBeenEvaluated: false,
  hasErrored: false,
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
    handleEqualsClick(state);
  });

  const decimalButton = document.querySelector(
    '#decimal-button'
  );

  decimalButton.addEventListener('click', () => {
    handleDecimalClick(state);
  });

  const signButton = document.querySelector('#sign-button');

  signButton.addEventListener('click', () => {
    handleSignClick(state);
  });

  updateTime();
  setInterval(updateTime, 1000);
});

/**
 * @param {State} state
 * @returns {void}
 */
function handleSignClick(state) {
  if (state.displayValue === 0) {
    return;
  }

  const updatedDisplayValue = state.displayValue * -1;

  if (
    state.waitingForFirstOperand === true ||
    state.hasBeenEvaluated === true
  ) {
    updateState(state, {
      displayValue: updatedDisplayValue,
      firstOperand: state.firstOperand * -1,
    });
    return;
  }

  updateState(state, {
    displayValue: updatedDisplayValue,
    secondOperand: state.secondOperand * -1,
  });
}

/**
 * @param {State} state
 * @returns {void}
 */
function handleDecimalClick(state) {
  if (state.displayValue.toString().includes('.')) {
    return;
  }

  updateState(state, {
    displayValue: state.displayValue + '.',
  });
}

/**
 * @param {State} state
 * @returns {void}
 */
function handleEqualsClick(state) {
  const result = performCalculation(state);

  updateState(state, {
    displayValue: result,
    firstOperand: result,
    waitingForSecondOperand: true,
    hasBeenEvaluated: true,
  });
}

/**
 * @param {State} state
 * @param {string} operator
 * @returns {void}
 */
function handleOperatorClick(state, operator) {
  if (state.waitingForFirstOperand === true) {
    updateState(state, {
      operator,
      waitingForFirstOperand: false,
      waitingForSecondOperand: true,
    });
    return;
  }

  if (state.waitingForSecondOperand === true) {
    updateState(state, {
      operator,
      secondOperand: null,
      hasBeenEvaluated: false,
    });
    return;
  }

  const result = performCalculation(state);

  updateState(state, {
    displayValue: result,
    firstOperand: result,
    operator,
    waitingForSecondOperand: true,
  });
}

/**
 * @param {State} state
 * @param {string} number
 * @returns {void}
 */
function handleNumberClick(state, number) {
  let updatedDisplayValue = state.displayValue + number;

  if (state.hasBeenEvaluated === true) {
    updateState(state, {
      displayValue: number,
      firstOperand: Number(number),
      hasBeenEvaluated: false,
    });
    return;
  }

  if (
    state.waitingForFirstOperand === true &&
    state.firstOperand === null
  ) {
    updatedDisplayValue = number;
  }

  if (state.waitingForSecondOperand === true) {
    updatedDisplayValue = number;
  }

  const updatedDisplayValueAsNumber = Number(
    updatedDisplayValue
  );

  if (state.waitingForFirstOperand === true) {
    updateState(state, {
      displayValue: updatedDisplayValueAsNumber,
      firstOperand: updatedDisplayValueAsNumber,
    });
    return;
  }

  updateState(state, {
    displayValue: updatedDisplayValueAsNumber,
    secondOperand: updatedDisplayValueAsNumber,
    waitingForSecondOperand: false,
  });
}

/**
 * @param {State} state
 * @returns {number}
 */
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
    displayValue: 0,
    waitingForFirstOperand: true,
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false,
    secondOperand: null,
  });
}

/**
 * Updates the state object with the new state
 * @param {State} state
 * @param {State} newState
 * @returns {void}
 */
function updateState(state, newState) {
  Object.assign(state, newState);
  updateDisplayValue(state.displayValue);
}

/**
 * Updates the display value
 * @param {number} displayValue
 * @returns {void}
 */
function updateDisplayValue(displayValue) {
  const display = document.querySelector('#display-value');
  display.textContent =
    displayValue.toString().length > 9
      ? displayValue.toExponential(5).replace(/e\+/, 'e')
      : displayValue.toLocaleString();
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
