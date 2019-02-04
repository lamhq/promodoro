import React from 'react';
import { Button } from 'antd';
import Navigation from './Navigation';
import Clock from './Clock';

class HomePage extends React.Component {
  constructor() {
    super();
    this.timer = null;
    this.interval = null;
  }

  state = {
    total: 0,
    remain: 0,
    mode: 'work',
  }

  getTimerDuration() {
    const { mode } = this.state;
    switch (mode) {
      case 'work':
        return 60 * 25;

      case 'break':
        return 60 * 5;

      case 'long-break':
        return 60 * 15;

      default:
        return 0;
    }
  }

  handleTimeout = () => {
    clearInterval(this.interval);
  };

  handleInterval = () => {
    this.setState(state => ({ remain: state.remain - 1 }));
  };

  handleStart = () => {
    const duration = this.getTimerDuration();
    console.log(duration / 60);
    this.setState({
      total: duration,
      remain: duration,
    });
    this.timer = setTimeout(this.handleTimeout, (duration + 1) * 1000);
    this.interval = setInterval(this.handleInterval, 1000);
  };

  handleReset = () => {
    clearTimeout(this.timer);
    clearInterval(this.interval);
    this.setState(state => ({ remain: state.total }));
  };

  handleModeChange = (mode) => {
    this.setState({ mode });
    this.handleStart();
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
