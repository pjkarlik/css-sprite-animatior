import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppStyles from '../styles/styles.less';

export class MiniMap extends Component {
  static displayName = 'Animation';
  staticpropTypes = {
    config: PropTypes.object.isRequired,
    children: PropTypes.array
  };

  render() {
    const { config, children } = this.props;
    return (
      <ul className={AppStyles.minimap}>
        {children}
        <li>
          <a name="frame">frame {config.current || 0}</a>
        </li>
        <li>
          <a name="total">total {config.frames || 0}</a>
        </li>
      </ul>
    );
  }f
}
export default MiniMap;
