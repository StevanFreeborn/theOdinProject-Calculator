/**
 * @typedef {Object} State
 * @property {string} displayValue - The value to be displayed on the calculator
 * @property {boolean} waitingForFirstOperand - Whether the calculator is waiting for the first operand
 * @property {string} firstOperand - The first operand
 * @property {string} operator - The operator
 * @property {boolean} waitingForSecondOperand - Whether the calculator is waiting for the second operand
 * @property {string} secondOperand - The second operand
 * @property {boolean} hasBeenEvaluated - Whether the entered calculation has been evaluated
 */
const state = {
  displayValue: '0',
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

  document.querySelectorAll('.digit').forEach(button => {
    button.addEventListener('click', () => {
      handleNumberClick(state, button.textContent);
    });
  });

  document
    .querySelector('#clear-button')
    .addEventListener('click', () => {
      resetAll(state);
    });

  document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
      handleOperatorClick(state, button.textContent);
    });
  });

  document
    .querySelector('#equals-button')
    .addEventListener('click', () => {
      handleEqualsClick(state);
    });

  document
    .querySelector('#sign-button')
    .addEventListener('click', () => {
      handleSignClick(state);
    });

  document
    .querySelector('#backspace-button')
    .addEventListener('click', () => {
      handleBackspaceClick(state);
    });

  updateTime();
  setInterval(updateTime, 1000);
});

function handleBackspaceClick(state) {
  if (state.displayValue === 0) {
    return;
  }

  const updatedDisplayValue =
    state.displayValue.slice(0, -1) === ''
      ? '0'
      : state.displayValue.slice(0, -1);

  if (
    state.waitingForFirstOperand === true ||
    state.hasBeenEvaluated === true
  ) {
    updateState(state, {
      displayValue: updatedDisplayValue,
      firstOperand:
        updatedDisplayValue === '0'
          ? null
          : updatedDisplayValue,
    });
    return;
  }

  updateState(state, {
    displayValue: updatedDisplayValue,
    secondOperand: updatedDisplayValue,
    waitingForSecondOperand: updatedDisplayValue === '0',
  });
}

/**
 * @param {State} state
 * @returns {void}
 */
function handleSignClick(state) {
  if (state.displayValue === '0') {
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
function handleEqualsClick(state) {
  const result = performCalculation(state);

  updateState(state, {
    displayValue: result,
    firstOperand: result,
    waitingForFirstOperand: true,
    hasBeenEvaluated: true,
  });
}

/**
 * @param {State} state
 * @param {string} operator
 * @returns {void}
 */
function handleOperatorClick(state, operator) {
  if (state.hasBeenEvaluated === true) {
    updateState(state, {
      operator,
      waitingForFirstOperand: false,
      waitingForSecondOperand: true,
      hasBeenEvaluated: false,
    });
    return;
  }

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
  if (state.displayValue === '0' && number === '0') {
    return;
  }

  if (number === '.' && state.displayValue.includes('.')) {
    return;
  }

  let updatedDisplayValue = state.displayValue + number;

  if (
    (state.waitingForFirstOperand === true &&
      state.firstOperand === null) ||
    state.waitingForSecondOperand === true ||
    state.hasBeenEvaluated === true
  ) {
    updatedDisplayValue = number === '.' ? '0.' : number;
  }

  if (state.hasBeenEvaluated === true) {
    updateState(state, {
      displayValue: updatedDisplayValue,
      firstOperand: updatedDisplayValue,
      hasBeenEvaluated: false,
    });
    return;
  }

  if (state.waitingForFirstOperand === true) {
    updateState(state, {
      displayValue: updatedDisplayValue,
      firstOperand: updatedDisplayValue,
    });
    return;
  }

  updateState(state, {
    displayValue: updatedDisplayValue,
    secondOperand: updatedDisplayValue,
    waitingForSecondOperand: false,
  });
}

/**
 * @param {State} state
 * @returns {string} result
 */
function performCalculation(state) {
  const { firstOperand, secondOperand, operator } = state;

  const firstOperandAsNumber = Number(firstOperand);
  const secondOperandAsNumber = Number(secondOperand);
  const precision = Math.max(
    firstOperand.toString().split('.')[1]?.length || 0,
    secondOperand.toString().split('.')[1]?.length || 0
  );

  let result;

  switch (operator) {
    case '+':
      result = firstOperandAsNumber + secondOperandAsNumber;
      break;
    case '-':
      result = firstOperandAsNumber - secondOperandAsNumber;
      break;
    case 'x':
      result = firstOperandAsNumber * secondOperandAsNumber;
      break;
    case '÷':
      result = firstOperandAsNumber / secondOperandAsNumber;
      break;
    default:
      result = 0;
  }

  return result.toFixed(precision);
}

/**
 * Resets the state
 * @param {State} state
 * @returns {void}
 */
function resetAll(state) {
  updateState(state, {
    displayValue: '0',
    waitingForFirstOperand: true,
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false,
    secondOperand: null,
    hasBeenEvaluated: false,
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
 * @param {string} displayValue
 * @returns {void}
 */
function updateDisplayValue(displayValue) {
  const display = document.querySelector('#display-value');

  display.textContent =
    displayValue.length > 9
      ? Number(displayValue)
          .toExponential(5)
          .replace(/e\+/, 'e')
      : displayValue;
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
