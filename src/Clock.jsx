import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import numeral from 'numeral';
import { Progress } from 'antd';

const Clock = ({ total, remain }) => {
  const formatDuration = (percent) => {
    const seconds = percent * total / 100;
    const m = moment.duration(seconds, 'seconds');
    return `${numeral(m.minutes()).format('00')}:${numeral(m.seconds()).format('00')}`;
  };
  return (
    <Progress
      type="circle"
      percent={remain * 100 / total}
      format={formatDuration}
    />
  );
};

Clock.propTypes = {
  total: PropTypes.number.isRequired,
  remain: PropTypes.number.isRequired,
};


export default Clock;
