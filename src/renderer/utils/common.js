import * as TIMER_MODES from '../constants/timer-mode';

/**
 * Convert minutes to seconds
 * @param {Number} second
 */
export function m2s(second) {
  return second * 60;
}

/**
 * Get timer duration in seconds
 * @param {String} mode timer mode: work, break, long-break
 * @return {Number} timer duration in seconds
 */
export function getTimerDuration(mode) {
  let duration;
  switch (mode) {
    case TIMER_MODES.WORK:
      duration = m2s(25);
      break;

    case TIMER_MODES.BREAK:
      duration = m2s(5);
      break;

    case TIMER_MODES.LONG_BREAK:
      duration = m2s(15);
      break;

    default:
      break;
  }
  return duration;
}
