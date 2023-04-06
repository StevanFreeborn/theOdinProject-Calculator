import { jest } from '@jest/globals';
import {
  handleEqualsClick,
  handleNumberClick,
  handleOperatorClick,
  performCalculation,
  resetAll,
  updateDisplayValue,
  updateState,
  updateTime,
} from '../src/index.js';
import { loadView } from './utils.js';

describe('index', () => {
  let dom;

  beforeEach(() => {
    dom = loadView('index.html');
    document.documentElement.innerHTML = dom;
  });

  describe('updateTime', () => {
    it('should update the time correctly when hour is 12 or less and minutes are less than 10', () => {
      const date = new Date(2020, 0, 1, 12, 0, 0);
      jest.useFakeTimers({
        now: date.getTime(),
      });
      updateTime();
      expect(
        document.getElementById('time').textContent
      ).toBe('12:00');
      jest.useRealTimers();
    });

    it('should update the time correctly when hour is 12 or less and minutes are greater than 10', () => {
      const date = new Date(2020, 0, 1, 12, 15, 0);
      jest.useFakeTimers({
        now: date.getTime(),
      });
      updateTime();
      expect(
        document.getElementById('time').textContent
      ).toBe('12:15');
      jest.useRealTimers();
    });

    it('should update the time correctly when hour is greater than 12 and minutes are less than 10', () => {
      const date = new Date(2020, 0, 1, 13, 0, 0);
      jest.useFakeTimers({
        now: date.getTime(),
      });
      updateTime();
      expect(
        document.getElementById('time').textContent
      ).toBe('1:00');
      jest.useRealTimers();
    });

    it('should update the time correctly when hour is greater than 12 and minutes are greater than 10', () => {
      const date = new Date(2020, 0, 1, 13, 15, 0);
      jest.useFakeTimers({
        now: date.getTime(),
      });
      updateTime();
      expect(
        document.getElementById('time').textContent
      ).toBe('1:15');
      jest.useRealTimers();
    });
  });

  describe('updateDisplayValue', () => {
    it('should update the display value correctly when the value is less than 9 characters', () => {
      const state = {
        displayValue: '12345678',
        hasErrored: false,
      };
      updateDisplayValue(state);
      expect(
        document.getElementById('display-value').textContent
      ).toBe('12345678');
    });

    it('should update the display value correctly when the value is greater than 9 characters', () => {
      const state = {
        displayValue: '1234567890',
        hasErrored: false,
      };
      updateDisplayValue(state);
      expect(
        document.getElementById('display-value').textContent
      ).toBe('1.23457e9');
    });

    it('should update the display value correctly when the value is greater than 9 characters and hasErrored is true', () => {
      const state = {
        displayValue: '1234567890',
        hasErrored: true,
      };
      updateDisplayValue(state);
      expect(
        document.getElementById('display-value').textContent
      ).toBe("don't do that");
    });

    it('should update the display value correctly when the value is less than 9 characters and hasErrored is true', () => {
      const state = {
        displayValue: '12345678',
        hasErrored: true,
      };
      updateDisplayValue(state);
      expect(
        document.getElementById('display-value').textContent
      ).toBe("don't do that");
    });
  });

  describe('updateState', () => {
    it('should update the state correctly', () => {
      const state = {
        displayValue: '12345678',
        waitingForFirstOperand: true,
        firstOperand: null,
        operator: null,
        waitingForSecondOperand: false,
        secondOperand: null,
        hasBeenEvaluated: false,
        hasErrored: false,
      };
      const newState = {
        displayValue: '0',
        waitingForFirstOperand: true,
        firstOperand: null,
        operator: null,
        waitingForSecondOperand: false,
        secondOperand: null,
        hasBeenEvaluated: false,
        hasErrored: false,
      };
      updateState(state, newState);
      expect(state).toEqual(newState);
    });
  });

  describe('resetAll', () => {
    it('should reset the state correctly', () => {
      const state = {
        displayValue: '12345678',
        waitingForFirstOperand: true,
        firstOperand: null,
        operator: null,
        waitingForSecondOperand: false,
        secondOperand: null,
        hasBeenEvaluated: false,
        hasErrored: false,
      };
      resetAll(state);
      expect(state).toEqual({
        displayValue: '0',
        waitingForFirstOperand: true,
        firstOperand: null,
        operator: null,
        waitingForSecondOperand: false,
        secondOperand: null,
        hasBeenEvaluated: false,
        hasErrored: false,
      });
    });
  });

  describe('performCalculation', () => {
    it('should perform the calculation correctly when the operator is + and the required precision is 0', () => {
      const state = {
        displayValue: '3',
        waitingForFirstOperand: false,
        firstOperand: '1',
        operator: '+',
        waitingForSecondOperand: false,
        secondOperand: '3',
      };
      const result = performCalculation(state);
      expect(result).toBe('4');
    });

    it('should perform the calculation correctly when the operator is + and the required precision greater than 0', () => {
      const state = {
        displayValue: '3.1',
        waitingForFirstOperand: false,
        firstOperand: '1.1',
        operator: '+',
        waitingForSecondOperand: false,
        secondOperand: '3.1',
      };
      const result = performCalculation(state);
      expect(result).toBe('4.2');
    });

    it('should perform the calculation correctly when the operator is - and the required precision is 0', () => {
      const state = {
        displayValue: '3',
        waitingForFirstOperand: false,
        firstOperand: '1',
        operator: '-',
        waitingForSecondOperand: false,
        secondOperand: '3',
      };
      const result = performCalculation(state);
      expect(result).toBe('-2');
    });

    it('should perform the calculation correctly when the operator is - and the required precision greater than 0', () => {
      const state = {
        displayValue: '3.1',
        waitingForFirstOperand: false,
        firstOperand: '1.1',
        operator: '-',
        waitingForSecondOperand: false,
        secondOperand: '3.1',
      };
      const result = performCalculation(state);
      expect(result).toBe('-2.0');
    });

    it('should perform the calculation correctly when the operator is x and the required precision is 0', () => {
      const state = {
        displayValue: '3',
        waitingForFirstOperand: false,
        firstOperand: '1',
        operator: 'x',
        waitingForSecondOperand: false,
        secondOperand: '3',
      };
      const result = performCalculation(state);
      expect(result).toBe('3');
    });

    it('should perform the calculation correctly when the operator is x and the required precision greater than 0', () => {
      const state = {
        displayValue: '3.1',
        waitingForFirstOperand: false,
        firstOperand: '1.1',
        operator: 'x',
        waitingForSecondOperand: false,
        secondOperand: '3.1',
      };
      const result = performCalculation(state);
      expect(result).toBe('3.4');
    });

    it('should perform the calculation correctly when the operator is ÷ and the required precision is 0', () => {
      const state = {
        displayValue: '3',
        waitingForFirstOperand: false,
        firstOperand: '1',
        operator: '÷',
        waitingForSecondOperand: false,
        secondOperand: '3',
      };
      const result = performCalculation(state);
      expect(result).toBe('0');
    });

    it('should perform the calculation correctly when the operator is ÷ and the required precision greater than 0', () => {
      const state = {
        displayValue: '3.1',
        waitingForFirstOperand: false,
        firstOperand: '1.1',
        operator: '÷',
        waitingForSecondOperand: false,
        secondOperand: '3.1',
      };
      const result = performCalculation(state);
      expect(result).toBe('0.4');
    });

    it('should update the state as having errored when the operator is ÷ and the second operand is 0', () => {
      const state = {
        displayValue: '0',
        waitingForFirstOperand: false,
        firstOperand: '1',
        operator: '÷',
        waitingForSecondOperand: false,
        secondOperand: '0',
        hasBeenEvaluated: false,
        hasErrored: false,
      };
      performCalculation(state);
      expect(state.hasErrored).toBe(true);
    });

    it('should return 0 when an unsupported operator is used', () => {
      const state = {
        displayValue: '3',
        waitingForFirstOperand: false,
        firstOperand: '1',
        operator: '^',
        waitingForSecondOperand: false,
        secondOperand: '3',
      };
      const result = performCalculation(state);
      expect(result).toBe('0');
    });

    it('should return 0 when the operator is null', () => {
      const state = {
        displayValue: '3',
        waitingForFirstOperand: false,
        firstOperand: '1',
        operator: null,
        waitingForSecondOperand: false,
        secondOperand: '3',
      };
      const result = performCalculation(state);
      expect(result).toBe('0');
    });
  });

  describe('handleNumberClick', () => {
    let state;

    beforeEach(() => {
      state = {
        hasErrored: false,
        displayValue: '0',
        waitingForFirstOperand: true,
        firstOperand: null,
        operator: null,
        waitingForSecondOperand: false,
        secondOperand: null,
        hasBeenEvaluated: false,
      };
    });

    it('should reset state and return when state hasErrored is true', () => {
      state.hasErrored = true;

      handleNumberClick(state, '1');

      expect(state).toEqual({
        hasErrored: false,
        displayValue: '0',
        waitingForFirstOperand: true,
        firstOperand: null,
        operator: null,
        waitingForSecondOperand: false,
        secondOperand: null,
        hasBeenEvaluated: false,
      });
    });

    it('should do nothing when number is 0 and displayValue is already 0', () => {
      state.displayValue = '0';

      handleNumberClick(state, '0');

      expect(state.displayValue).toBe('0');
      expect(state.waitingForFirstOperand).toBe(true);
      expect(state.firstOperand).toBe(null);
    });

    it('should do nothing when number is a dot and displayValue already contains a dot', () => {
      state.displayValue = '3.14';

      handleNumberClick(state, '.');

      expect(state.displayValue).toBe('3.14');
      expect(state.waitingForFirstOperand).toBe(true);
      expect(state.firstOperand).toBe(null);
    });

    it('should update displayValue with the number when waiting for first operand and first operand is null', () => {
      handleNumberClick(state, '1');

      expect(state.displayValue).toBe('1');
      expect(state.waitingForFirstOperand).toBe(true);
      expect(state.firstOperand).toBe('1');
    });

    it('should update displayValue with the number when waiting for second operand', () => {
      state.waitingForFirstOperand = false;
      state.waitingForSecondOperand = true;
      state.firstOperand = '3';

      handleNumberClick(state, '2');

      expect(state.displayValue).toBe('2');
      expect(state.waitingForSecondOperand).toBe(false);
      expect(state.secondOperand).toBe('2');
    });

    it('should update displayValue with 0. when number is dot and waiting for first operand and first operand is null', () => {
      handleNumberClick(state, '.');

      expect(state.displayValue).toBe('0.');
      expect(state.waitingForFirstOperand).toBe(true);
      expect(state.firstOperand).toBe('0.');
    });

    it('should update displayValue with the number when hasBeenEvaluated is true', () => {
      state.hasBeenEvaluated = true;

      handleNumberClick(state, '3');

      expect(state.displayValue).toBe('3');
      expect(state.firstOperand).toBe('3');
      expect(state.hasBeenEvaluated).toBe(false);
    });

    it('should update displayValue with the number when waiting for first operand', () => {
      state.displayValue = '4';
      state.firstOperand = '4';

      handleNumberClick(state, '5');

      expect(state.displayValue).toBe('45');
      expect(state.firstOperand).toBe('45');
      expect(state.waitingForFirstOperand).toBe(true);
      expect(state.waitingForSecondOperand).toBe(false);
    });

    it('should update displayValue with 0. when number is dot and waiting for first operand', () => {
      handleNumberClick(state, '.');

      expect(state.displayValue).toBe('0.');
      expect(state.waitingForFirstOperand).toBe(true);
      expect(state.firstOperand).toBe('0.');
    });

    it('should update displayValue with the number when waiting for second operand and hasBeenEvaluated is true', () => {
      state.waitingForFirstOperand = false;
      state.firstOperand = '2';
      state.secondOperand = '3';
      state.hasBeenEvaluated = true;

      handleNumberClick(state, '4');

      expect(state.displayValue).toBe('4');
      expect(state.firstOperand).toBe('4');
      expect(state.hasBeenEvaluated).toBe(false);
    });

    it('should update displayValue with the number when waiting for second operand and hasBeenEvaluated is false', () => {
      state.waitingForFirstOperand = false;
      state.firstOperand = '2';
      state.secondOperand = '3';
      state.displayValue = '3';

      handleNumberClick(state, '4');

      expect(state.displayValue).toBe('34');
      expect(state.secondOperand).toBe('34');
      expect(state.waitingForSecondOperand).toBe(false);
    });

    it('should update displayValue with 0. when number is dot and waiting for second operand and second operand is null', () => {
      state.waitingForFirstOperand = false;
      state.firstOperand = '2';

      handleNumberClick(state, '.');

      expect(state.displayValue).toBe('0.');
      expect(state.waitingForSecondOperand).toBe(false);
      expect(state.secondOperand).toBe('0.');
    });

    it('should update displayValue with the number when waiting for second operand and second operand is not null', () => {
      state.waitingForFirstOperand = false;
      state.firstOperand = '2';
      state.secondOperand = '3';
      state.displayValue = '3';

      handleNumberClick(state, '4');

      expect(state.displayValue).toBe('34');
      expect(state.secondOperand).toBe('34');
      expect(state.waitingForSecondOperand).toBe(false);
    });
  });

  describe('handleOperatorClick', () => {
    let state;

    beforeEach(() => {
      state = {
        hasErrored: false,
        displayValue: '0',
        waitingForFirstOperand: true,
        firstOperand: null,
        operator: null,
        waitingForSecondOperand: false,
        secondOperand: null,
        hasBeenEvaluated: false,
      };
    });

    it('should reset state and return when state hasErrored is true', () => {
      state.hasErrored = true;

      handleOperatorClick(state, '+');

      expect(state).toEqual({
        hasErrored: false,
        displayValue: '0',
        waitingForFirstOperand: true,
        firstOperand: null,
        operator: null,
        waitingForSecondOperand: false,
        secondOperand: null,
        hasBeenEvaluated: false,
      });
    });

    it('should update operator when previous operation has been evaluated', () => {
      state.firstOperand = '3';
      state.operator = '+';
      state.secondOperand = '2';
      state.displayValue = '5';
      state.hasBeenEvaluated = true;

      handleOperatorClick(state, '-');

      expect(state.operator).toBe('-');
      expect(state.waitingForFirstOperand).toBe(false);
      expect(state.waitingForSecondOperand).toBe(true);
      expect(state.firstOperand).toBe('3');
      expect(state.secondOperand).toBe('2');
      expect(state.displayValue).toBe('5');
      expect(state.hasBeenEvaluated).toBe(false);
    });

    it('should update operator when waiting for first operand and first operand is null', () => {
      handleOperatorClick(state, '+');

      expect(state.operator).toBe('+');
      expect(state.waitingForFirstOperand).toBe(false);
      expect(state.firstOperand).toBe('0');
    });

    it('should update operator when waiting for first operand and first operand is not null', () => {
      state.firstOperand = '3';

      handleOperatorClick(state, '+');

      expect(state.operator).toBe('+');
      expect(state.waitingForFirstOperand).toBe(false);
      expect(state.waitingForSecondOperand).toBe(true);
    });

    it('should update operator when waiting for second operand and second operand is null', () => {
      state.waitingForFirstOperand = false;
      state.waitingForSecondOperand = true;
      state.firstOperand = '3';

      handleOperatorClick(state, '+');

      expect(state.operator).toBe('+');
      expect(state.waitingForSecondOperand).toBe(true);
      expect(state.secondOperand).toBe(null);
    });

    it('should perform calculation when a complete operation has previously been entered', () => {
      state.firstOperand = '3';
      state.operator = '+';
      state.secondOperand = '2';
      state.displayValue = '2';
      state.waitingForFirstOperand = false;
      state.waitingForSecondOperand = false;

      handleOperatorClick(state, '-');

      expect(state.operator).toBe('-');
      expect(state.firstOperand).toBe('5');
      expect(state.secondOperand).toBe('2');
      expect(state.displayValue).toBe('5');
      expect(state.waitingForFirstOperand).toBe(false);
      expect(state.waitingForSecondOperand).toBe(true);
    });
  });

  describe('handleEqualsClick', () => {
    let state;

    beforeEach(() => {
      state = {
        hasErrored: false,
        displayValue: '0',
        waitingForFirstOperand: true,
        firstOperand: null,
        operator: null,
        waitingForSecondOperand: false,
        secondOperand: null,
        hasBeenEvaluated: false,
      };
    });

    it('should reset state and return when state hasErrored is true', () => {
      state.hasErrored = true;

      handleEqualsClick(state);

      expect(state).toEqual({
        hasErrored: false,
        displayValue: '0',
        waitingForFirstOperand: true,
        firstOperand: null,
        operator: null,
        waitingForSecondOperand: false,
        secondOperand: null,
        hasBeenEvaluated: false,
      });
    });

    it('should perform calculation when a complete operation has previously been entered', () => {
      state.firstOperand = '3';
      state.operator = '+';
      state.secondOperand = '2';
      state.displayValue = '2';

      handleEqualsClick(state);

      expect(state.displayValue).toBe('5');
      expect(state.firstOperand).toBe('5');
      expect(state.secondOperand).toBe('2');
      expect(state.operator).toBe('+');
      expect(state.waitingForFirstOperand).toBe(true);
      expect(state.waitingForSecondOperand).toBe(false);
      expect(state.hasBeenEvaluated).toBe(true);
    });
  });
});
