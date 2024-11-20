import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { select } from '@syncfusion/ej2-base';

const PropertyPane = ({ title, children }) => {
    const isMobile = window.matchMedia('(max-width:550px)').matches;
    const mobilePropPane = select('.sb-mobile-prop-pane');

    const content = (
        <div className='property-panel-section'>
            <div className="property-panel-header">
                {title}
            </div>
            <div className="property-panel-content">
                {children}
            </div>
        </div>
    );

    return isMobile && mobilePropPane
        ? ReactDOM.createPortal(content, mobilePropPane)
        : content;
};

PropertyPane.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

export default PropertyPane;
