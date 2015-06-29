/* =========================================================================
 *
 * Main.js
 *  Main root game component
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import {RouteHandler} from 'react-router';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import Timings from '../util/Timings.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var timings = new Timings('Main');

var Main = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    componentWillMount: function(){
        timings.push('componentWillMount');
        logger.log('components/main:componentWillMount:start', '<start> called');
    },
    componentDidMount: function(){
        timings.push('componentDidMount');
        logger.log('components/main:componentDidMount:finish',
        '<finished> called | took: ' + timings.printLast());
    },

    render: function render(){
        logger.log('components/main:render', 'called : %O', this.props);

        return (
            <div id='game__wrapper'>
                <RouteHandler {...this.props} />
            </div>
        );
    }
});

export default Main;
