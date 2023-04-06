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

document.addEventListener('keydown', () => {
  console.log(document.activeElement);
});

window.addEventListener('DOMContentLoaded', () => {
  updateDisplayValue(state);

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

  document.addEventListener('keydown', handleKeyDown);

  updateTime();
  setInterval(updateTime, 1000);
});

/**
 * Handles the keydown event for the calculator
 * @param {KeyboardEvent} event - The keydown event
 * @returns {void}
 */
function handleKeyDown(event) {
  var button = document.querySelector(
    `[data-key="${event.key.toLowerCase()}"]`
  );

  if (button) {
    document.activeElement.blur();
    button.click();
  }
}

/**
 * Handles the click event for the backspace button
 * @param {State} state - The state of the calculator
 * @returns {void}
 */
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
 * Handles the click event for the sign button
 * @param {State} state - The state of the calculator
 * @returns {void}
 */
function handleSignClick(state) {
  if (state.hasErrored === true) {
    resetAll(state);
    return;
  }

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
 * Handles the click event for the equals button
 * @param {State} state - The state of the calculator
 * @returns {void}
 */
function handleEqualsClick(state) {
  if (state.hasErrored === true) {
    resetAll(state);
    return;
  }

  const result = performCalculation(state);

  updateState(state, {
    displayValue: result,
    firstOperand: result,
    waitingForFirstOperand: true,
    hasBeenEvaluated: true,
  });
}

/**
 * Handles the click event for an operator button
 * @param {State} state - The state of the calculator
 * @param {string} operator - The operator to be used in the calculation
 * @returns {void}
 */
function handleOperatorClick(state, operator) {
  if (state.hasErrored === true) {
    resetAll(state);
    return;
  }

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
      firstOperand:
        state.firstOperand ?? state.displayValue,
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
 * Handles the click event for a number button
 * @param {State} state - The state of the calculator
 * @param {string} number - The number to be added to the display value
 * @returns {void}
 */
function handleNumberClick(state, number) {
  if (state.hasErrored === true) {
    resetAll(state);
    return;
  }

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
 * Performs the calculation based on the current state
 * @param {State} state - The current state of the calculator
 * @returns {string} result - The result of the calculation
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
    case '*':
      result = firstOperandAsNumber * secondOperandAsNumber;
      break;
    case '÷':
    case '/':
      if (secondOperandAsNumber === 0) {
        updateState(state, {
          hasErrored: true,
        });
      }
      result = firstOperandAsNumber / secondOperandAsNumber;
      break;
    default:
      result = 0;
  }

  return result.toFixed(precision);
}

/**
 * Resets the state
 * @param {State} state - the current state object
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
    hasErrored: false,
  });
}

/**
 * Updates the state object with the new state
 * @param {State} state - the current state object
 * @param {State} newState - the new state object
 * @returns {void}
 */
function updateState(state, newState) {
  Object.assign(state, newState);
  updateDisplayValue(state);
}

/**
 * Updates the display value
 * @param {State} state - the current state object
 * @returns {void}
 */
function updateDisplayValue(state) {
  const display = document.querySelector('#display-value');

  if (state.hasErrored === true) {
    display.textContent = "don't do that";
    return;
  }

  display.textContent =
    state.displayValue.length > 9
      ? Number(state.displayValue)
          .toExponential(5)
          .replace(/e\+/, 'e')
      : state.displayValue;
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

export {
  performCalculation,
  resetAll,
  updateDisplayValue,
  updateState,
  updateTime,
};
