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

    // timer status: running, stopped
    status: 'stopped',
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
    const { mode } = this.state;
    let nextMode;
    // change to next mode
    if (mode === TIMER_MODES.WORK) {
      nextMode = TIMER_MODES.BREAK;
      this.askForBreak();
    } else {
      nextMode = TIMER_MODES.WORK;
      this.askForWork();
    }
    this.setState({ nextMode });
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
      title: 'Time to rest',
      message: 'You should take a rest in 5 mins :)',
      sound: true,
      wait: true,
      timeout: 15,
      closeLabel: 'Rest',
      dropdownLabel: 'Postpone',
      actions: [
        '5 mins',
        '10 mins',
        '15 mins',
      ],
    });
  }

  /**
   * Show notification to ask user to continue working
   */
  askForWork() {
    showNotification({
      title: 'Back to work',
      message: 'Time to be on fire XD',
      sound: true,
      wait: true,
      timeout: 15,
      closeLabel: 'Work',
      dropdownLabel: 'Postpone',
      actions: [
        '5 mins',
        '10 mins',
        '15 mins',
      ],
    });
  }

  /**
   * Redisplay notification after seconds
   */
  postpone(duration) {
    this.timer = setTimeout(this.handleTimerFinished, duration * 1000);
  }

  render() {
    const { mode, total, remain } = this.state;
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
