/* eslint-disable class-methods-use-this */
import React from 'react';
import { Button } from 'antd';
import Navigation from './Navigation';
import Clock from './Clock';
import * as TIMER_MODES from './constants/timer-mode';
import { showNotification, registerHandler } from './utils/notification';
import { m2s, getTimerDuration } from './utils/common';


class HomePage extends React.Component {
  constructor() {
    super();
    this.interval = null;
    this.timer = null;
    this.notifOptions = {
      sound: true,
      wait: true,
      timeout: 15,
      dropdownLabel: 'Postpone',
      actions: [
        '5 mins',
        '10 mins',
        '15 mins',
      ],
    };
    registerHandler(this.handleNotifAction);
  }

  state = {
    // total seconds for timer
    total: getTimerDuration(TIMER_MODES.WORK),

    // remain seconds for timer
    remain: getTimerDuration(TIMER_MODES.WORK),

    // current timer mode
    mode: TIMER_MODES.WORK,

    // next mode after the current timer finished
    nextMode: TIMER_MODES.BREAK,

    // timer status: running, stopped, paused
    status: 'stopped',

    // number of passed work timers
    workCount: 0,
  }

  /**
   * Event handler for clicking Start/Pause/Resume button
   */
  handleStart = () => {
    this.startTimer();
  }

  /**
   * Event handler for clicking Stop button
   */
  handleStop = () => {
    clearInterval(this.interval);
    clearTimeout(this.timer);
    // reset time
    this.setState(state => ({
      remain: state.total,
      status: 'stopped',
    }));
  };

  /**
   * Event handler for when clicking timer navigation
   */
  handleModeChange = (mode) => {
    // restart timer when user change mode
    this.setState({ mode }, this.startTimer);
  }

  /**
   * Event handler for setInterval
   */
  handleInterval = () => {
    this.setState(state => ({ remain: state.remain - 1 }), () => {
      const { remain } = this.state;
      if (remain === 0) {
        clearInterval(this.interval);
        this.handleTimerFinished();
      }
    });
  }

  /**
   * Called when timer is finished
   */
  handleTimerFinished = () => {
    // long break each 4 work timers
    const longBreakCircle = 4;
    const { mode, workCount } = this.state;
    let nextMode;
    let newWorkCount = workCount;

    // ask user to change to next mode
    if (mode === TIMER_MODES.WORK) {
      newWorkCount += 1;
      nextMode = (newWorkCount % longBreakCircle) === 0
        ? TIMER_MODES.LONG_BREAK
        : TIMER_MODES.BREAK;
      this.askForBreak();
      if (nextMode === TIMER_MODES.LONG_BREAK) {
        this.askForBreak();
      } else {
        this.askForBreak();
      }
    } else {
      nextMode = TIMER_MODES.WORK;
      this.askForWork();
    }

    this.setState({
      nextMode,
      workCount: newWorkCount,
    });
  }

  /**
   * Event handler for notification interaction
   * @see https://electronjs.org/docs/api/ipc-renderer
   */
  handleNotifAction = (e, arg) => {
    const { activationValue, activationType } = arg;
    const { status } = this.state;

    // redisplay notification in case user has no interactions
    if (activationType === 'timeout' && status === 'running') {
      this.postpone(m2s(3));
      return;
    }

    // proceed to next state when user click on notification content
    if (activationType === 'contentsClicked') {
      this.setState(state => ({ mode: state.nextMode }), this.startTimer);
      return;
    }

    switch (activationValue) {
      // switch no next mode
      case 'Rest':
      case 'Work':
        this.setState(state => ({ mode: state.nextMode }), this.startTimer);
        break;

      // re-display notification when snoozed
      case '5 mins':
        this.postpone(m2s(5));
        break;

      case '10 mins':
        this.postpone(m2s(10));
        break;

      case '15 mins':
        this.postpone(m2s(15));
        break;

      default:
        break;
    }
  }

  /**
   * Start timer
   */
  startTimer = () => {
    this.handleStop();
    const { mode } = this.state;
    const duration = getTimerDuration(mode);
    this.setState({
      total: duration,
      remain: duration,
      status: 'running',
    });
    this.interval = setInterval(this.handleInterval, 1000);
  }

  /**
   * Show notification to ask user to take a break
   */
  askForBreak() {
    showNotification({
      ...this.notifOptions,
      title: 'Time to rest',
      message: 'You should take a rest to be more productive :)',
      closeLabel: 'Rest',
    });
  }

  /**
   * Show notification to ask user to take a break
   */
  askForLongBreak() {
    showNotification({
      ...this.notifOptions,
      title: 'Long break',
      message: 'Stand up and go around',
      closeLabel: 'Rest',
    });
  }

  /**
   * Show notification to ask user to continue working
   */
  askForWork() {
    showNotification({
      ...this.notifOptions,
      title: 'Back to work',
      message: 'Time to be on fire XD',
      closeLabel: 'Work',
    });
  }

  /**
   * Redisplay notification after seconds
   */
  postpone(duration) {
    this.timer = setTimeout(this.handleTimerFinished, duration * 1000);
  }

  render() {
    const {
      mode, total, remain,
    } = this.state;
    return (
      <React.Fragment>
        <Navigation selected={mode} onChange={this.handleModeChange} />
        <Clock remain={remain} total={total} />
        <div>
          <Button
            type="primary"
            shape="round"
            icon="play-circle"
            size="large"
            onClick={this.handleStart}
          >
            Start
          </Button>
          <Button
            type="default"
            shape="round"
            icon="reload"
            size="large"
            onClick={this.handleStop}
          >
            Stop
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default HomePage;
