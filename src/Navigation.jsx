import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';

const Navigation = ({ selected, onChange }) => {
  const handleClick = (e) => {
    console.log(e.key);
    onChange(e.key);
  };

  return (
    <Menu
      onClick={handleClick}
      selectedKeys={[selected]}
      mode="horizontal"
    >
      <Menu.Item key="work">
        <Icon type="tool" />
        Work
      </Menu.Item>
      <Menu.Item key="break">
        <Icon type="coffee" />
        Break
      </Menu.Item>
      <Menu.Item key="long-break">
        <Icon type="smile" />
        Long break
      </Menu.Item>
    </Menu>
  );
};

Navigation.propTypes = {
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Navigation;
