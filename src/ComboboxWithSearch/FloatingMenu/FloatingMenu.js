import React from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';

import TetherComponent from '../TetherComponent';

const options = {
  attachment: 'top left',
  targetAttachment: 'bottom left',
  constraints: [
    {
      to: 'window',
      attachment: 'together',
    },
  ],
};

const FloatingMenu = props => {
  const { dropdownFieldNode, ...menuProps } = props;
  return (
    <TetherComponent
      target={dropdownFieldNode}
      options={options}
      matchWidth={true}
    >
      <components.Menu {...menuProps}>
        {menuProps.children}
      </components.Menu>
    </TetherComponent>
  );
};

FloatingMenu.propTypes = {
  dropdownFieldNode: PropTypes.element,
};

export default FloatingMenu;
