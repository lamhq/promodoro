import React from 'react';
import { Button, Badge } from 'antd';
import Navigation from './Navigation';
import Clock from './Clock';
import * as TIMER_MODES from '../constants/timer-mode';
import {
  bounceDock, showNotification,
} from '../utils/electron';
import { getTimerDuration } from '../utils/common';
import styles from './HomePage.less';

class HomePage extends React.Component {
  constructor() {
    super();
    this.timerInterval = null;
    this.dockInterval = null;
    this.total = getTimerDuration(TIMER_MODES.WORK);
    this.remain = this.total;
    this.mode = TIMER_MODES.WORK;
    this.status = 'stopped';
    this.workCount = 0;
    this.state = {
      // total seconds for timer
      total: this.total,
      // remain seconds for timer
      remain: this.remain,
      // current timer mode
      mode: this.mode,
      // timer status
      status: this.status,
      // number of passed work timers
      workCount: this.workCount,
    };

    this.timer = null;
    this.handleStart = this.handleStart.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleResume = this.handleResume.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.handleInterval = this.handleInterval.bind(this);
  }

  componentDidMount() {
    setInterval(() => {
      if (this.status !== 'running') {
        showNotification({
          title: 'Timer is not running',
          body: 'Timer hasn\'t been running. Click here to start it',
          onClick: this.handleStart,
        });
      }
    }, 30 * 1000);
  }

  getMainButtonProps() {
    const { status } = this;
    switch (status) {
      case 'stopped':
        return {
          icon: 'caret-right',
          onClick: this.handleStart,
        };

      case 'paused':
        return {
          icon: 'caret-right',
          onClick: this.handleResume,
        };

      case 'running':
        return {
          icon: 'pause',
          onClick: this.handlePause,
        };

      default:
        return {
          icon: 'caret-right',
          onClick: this.handleStart,
        };
    }
  }

  updateState() {
    this.setState({
      total: this.total,
      remain: this.remain,
      mode: this.mode,
      status: this.status,
      workCount: this.workCount,
    });
  }

  resetTime() {
    const duration = getTimerDuration(this.mode);
    this.total = duration;
    this.remain = duration;
    this.updateState();
  }

  /**
   * Start timer
   */
  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(this.handleInterval, 1000);
  }

  /**
   * Start timer
   */
  stopTimer() {
    clearInterval(this.timerInterval);
  }

  startBouncing() {
    this.stopBouncing();
    this.dockInterval = setInterval(bounceDock, 2000);
  }

  stopBouncing() {
    clearInterval(this.dockInterval);
  }

  /**
   * Show notification to ask user advance to next mode
   */
  askToStartTimer() {
    const { mode } = this;

    let options = { title: '' };
    switch (mode) {
      case TIMER_MODES.LONG_BREAK:
        options = {
          title: 'Long break',
          body: 'Stand up and go around.',
        };
        break;

      case TIMER_MODES.BREAK:
        options = {
          title: 'Time to rest',
          body: 'You should take a rest to recover.',
        };
        break;

      case TIMER_MODES.WORK:
        options = {
          title: 'Back to work',
          body: 'Time to be on fire.',
        };
        break;

      default:
        break;
    }
    const { title, ...rest } = options;
    const notif = new Notification(title, rest);
    notif.onclick = this.handleStart;
  }

  handleStart() {
    this.stopBouncing();
    this.resetTime();
    this.startTimer();
    this.status = 'running';
    this.updateState();
  }

  handlePause() {
    this.stopTimer();
    this.status = 'paused';
    this.updateState();
  }

  handleResume() {
    this.startTimer();
    this.status = 'running';
    this.updateState();
  }

  /**
   * Event handler for clicking Stop button
   */
  handleStop() {
    this.stopTimer();
    this.stopBouncing();
    this.resetTime();
    this.status = 'stopped';
    this.updateState();
  }

  /**
   * Event handler for when clicking timer navigation
   */
  handleModeChange(mode) {
    // restart timer when user change mode
    this.mode = mode;
    this.handleStart();
    this.updateState();
  }

  /**
   * Event handler for setInterval
   */
  handleInterval() {
    const {
      remain, mode,
    } = this;
    if (remain === 0) {
      this.stopTimer();
      this.status = 'paused';
      if (mode === TIMER_MODES.WORK) {
        this.workCount += 1;
      }

      let nextMode;
      if (mode === TIMER_MODES.WORK) {
        // long break each 4 work timers
        const longBreakCircle = 4;
        nextMode = (this.workCount % longBreakCircle) === 0
          ? TIMER_MODES.LONG_BREAK
          : TIMER_MODES.BREAK;
      } else {
        nextMode = TIMER_MODES.WORK;
      }
      this.mode = nextMode;
      this.resetTime();
      this.askToStartTimer();
      this.startBouncing();
    } else {
      this.remain -= 1;
    }
    this.updateState();
  }

  render() {
    const {
      mode, total, remain, workCount,
    } = this.state;
    return (
      <React.Fragment>
        <Navigation selected={mode} onChange={this.handleModeChange} />
        <div className={styles.content}>
          <Badge
            count={parseInt(workCount, 10)}
            showZero
            className={styles.badge}
          />
          <Clock remain={remain} total={total} />
        </div>
        <div className={styles.controls}>
          <Button
            shape="circle"
            type="primary"
            className={styles.button}
            {...this.getMainButtonProps()}
          />
          <Button
            shape="circle"
            type="primary"
            className={styles.button}
            icon="stop"
            onClick={this.handleStop}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default HomePage;
