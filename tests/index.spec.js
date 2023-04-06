import { jest } from '@jest/globals';
import {
  updateDisplayValue,
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
});
