/* =========================================================================
 *
 * NotFound.js
 *  404 / not found route
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import {RouteHandler} from 'react-router';
import logger from 'bragi-browser';


// Internal Dependencies
// ------------------------------------

// ========================================================================
//
// Functionality
//
// ========================================================================
var NotFound = React.createClass({
    render: function render(){
        logger.log('NotFound:component:render', 'called');

        return (
            <div>
                Page not found
            </div>
        );
    }
});

export default NotFound;
