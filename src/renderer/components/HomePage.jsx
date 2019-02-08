/* eslint-disable class-methods-use-this */
import React from 'react';
import { Button } from 'antd';
import Navigation from './Navigation';
import Clock from './Clock';
import * as TIMER_MODES from '../constants/timer-mode';
import { showNotification, registerHandler } from '../utils/notification';
import { m2s, getTimerDuration } from '../utils/common';
import styles from './HomePage.less';

class HomePage extends React.Component {
  constructor() {
    super();
    this.interval = null;
    this.timer = null;
    this.notifOptions = {
      wait: true,
      timeout: 15,
      dropdownLabel: 'Postpone',
      actions: [
        '5 mins',
        '10 mins',
        '15 mins',
      ],
    };
    this.handleStop = this.handleStop.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.handleNotification = this.handleNotification.bind(this);
    this.handleTimerFinished = this.handleTimerFinished.bind(this);
    this.handleInterval = this.handleInterval.bind(this);
    registerHandler(this.handleNotification);
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

  getMainButtonProps() {
    const { status } = this.state;
    switch (status) {
      case 'stopped':
        return {
          icon: 'caret-right',
          type: 'primary',
          children: 'Run',
        };

      case 'running':
        return {
          icon: 'pause',
          type: 'warning',
          children: 'Pause',
        };

      case 'paused':
        return {
          icon: 'caret-right',
          type: 'primary',
          children: 'Resume',
        };

      default:
        return {
          icon: 'caret-right',
          type: 'primary',
          children: 'Run',
        };
    }
  }

  setTime() {
    const { mode } = this.state;
    const duration = getTimerDuration(mode);
    this.setState({
      total: duration,
      remain: duration,
    });
  }

  /**
   * Start timer
   */
  startTimer() {
    this.stopTimer();
    this.interval = setInterval(this.handleInterval, 1000);
  }

  /**
   * Start timer
   */
  stopTimer() {
    clearInterval(this.interval);
  }

  /**
   * Show notification to ask user to take a break
   */
  askForBreak() {
    showNotification({
      ...this.notifOptions,
      sound: 'Glass',
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
      sound: 'Ping',
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

  /**
   * Event handler for clicking Start/Pause/Resume button
   */
  handleButtonClick() {
    const { status } = this.state;
    switch (status) {
      case 'stopped':
        this.handleStart();
        break;

      case 'running':
        this.handlePause();
        break;

      case 'paused':
        this.handleResume();
        break;

      default:
        break;
    }
  }

  handleStart() {
    this.setTime();
    this.startTimer();
    this.setState({ status: 'running' });
  }

  handlePause() {
    this.stopTimer();
    this.setState({ status: 'paused' });
  }

  handleResume() {
    this.startTimer();
    this.setState({ status: 'running' });
  }

  /**
   * Event handler for clicking Stop button
   */
  handleStop() {
    this.stopTimer();
    this.setTime();
    this.setState({ status: 'stopped' });
  }

  /**
   * Event handler for when clicking timer navigation
   */
  handleModeChange(mode) {
    // restart timer when user change mode
    this.setState({ mode }, this.handleStart);
  }

  /**
   * Event handler for setInterval
   */
  handleInterval() {
    this.setState(
      state => ({ remain: state.remain - 1 }),
      () => {
        const { remain } = this.state;
        if (remain === 0) {
          this.stopTimer();
          this.setState({ status: 'stopped' });
          this.handleTimerFinished();
        }
      },
    );
  }

  /**
   * Called when timer is finished
   */
  handleTimerFinished() {
    const { mode, workCount } = this.state;
    let nextMode;

    if (mode === TIMER_MODES.WORK) {
      // long break each 4 work timers
      const longBreakCircle = 4;
      const nextWorkCount = workCount + 1;
      nextMode = (nextWorkCount % longBreakCircle) === 0
        ? TIMER_MODES.LONG_BREAK
        : TIMER_MODES.BREAK;
      this.setState({ workCount: nextWorkCount });
    } else {
      nextMode = TIMER_MODES.WORK;
    }
    this.setState({ nextMode });

    // ask user to change to next mode
    switch (nextMode) {
      case TIMER_MODES.LONG_BREAK:
        this.askForLongBreak();
        break;

      case TIMER_MODES.BREAK:
        this.askForBreak();
        break;

      case TIMER_MODES.WORK:
        this.askForWork();
        break;

      default:
        break;
    }
  }

  /**
   * Event handler for notification interaction
   * @see https://electronjs.org/docs/api/ipc-renderer
   */
  handleNotification(e, arg) {
    const { activationValue, activationType } = arg;
    const { status } = this.state;

    // redisplay notification in case user has no interactions
    if (activationType === 'timeout' && status === 'running') {
      this.postpone(m2s(3));
      return;
    }

    // proceed to next state when user click on notification content
    if (activationType === 'contentsClicked') {
      this.setState(state => ({ mode: state.nextMode }), this.handleStart);
      return;
    }

    switch (activationValue) {
      // switch no next mode
      case 'Rest':
      case 'Work':
        this.setState(state => ({ mode: state.nextMode }), this.handleStart);
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

  render() {
    const {
      mode, total, remain,
    } = this.state;
    return (
      <React.Fragment>
        <Navigation selected={mode} onChange={this.handleModeChange} />
        <div className={styles.content}>
          <Clock remain={remain} total={total} />
        </div>
        <div className={styles.controls}>
          <Button
            shape="round"
            size="large"
            onClick={this.handleButtonClick}
            {...this.getMainButtonProps()}
          />
          <Button
            type="default"
            shape="round"
            icon="stop"
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
