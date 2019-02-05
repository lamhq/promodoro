import React from 'react';
import { Button } from 'antd';
import Navigation from './Navigation';
import Clock from './Clock';

function getTimerDuration(mode) {
  let duration;
  switch (mode) {
    case 'work':
      duration = 60 * 25;
      break;

    case 'break':
      duration = 60 * 5;
      break;

    case 'long-break':
      duration = 60 * 15;
      break;

    default:
      break;
  }
  duration = 5;
  return duration;
}


class HomePage extends React.Component {
  constructor() {
    super();
    this.timer = null;
  }

  state = {
    total: 0,
    remain: 0,
    mode: 'work',
  }

  handleStart = () => {
    this.startTimer();
  }

  handleReset = () => {
    clearInterval(this.timer);
    this.setState(state => ({ remain: state.total }));
  };

  handleModeChange = (mode) => {
    this.setState({ mode }, this.startTimer);
  }

  handleInterval = () => {
    this.setState(state => ({ remain: state.remain - 1 }), () => {
      const { remain } = this.state;
      if (remain === 0) {
        clearInterval(this.timer);
        this.handleTimeout();
      }
    });
  }

  handleTimeout = () => {
    console.log('time out');
  }

  startTimer = () => {
    const { mode } = this.state;
    const duration = getTimerDuration(mode);
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({
      total: duration,
      remain: duration,
    });
    this.timer = setInterval(this.handleInterval, 1000);
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
            onClick={this.handleReset}
          >
            Reset
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default HomePage;
