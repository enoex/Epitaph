/* =========================================================================
 *
 * game-screen__title.js
 *      Title screen
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import {RouteHandler} from 'react-router';
import logger from 'bragi-browser';
import Reflux from 'reflux';
import Immutable from 'immutable';

import $ from 'jquery';

// Internal Dependencies
// ------------------------------------
import Timings from '../util/Timings.js';

import GameStore from '../stores/Game.js';
import GameActions from '../actions/game-actions.js';
import GameScreenTitle from './game-screen__onboarding--title.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var ScreenCreate = React.createClass({
    // --------------------------------
    // Handle actions
    // --------------------------------

    // --------------------------------
    // Render
    // --------------------------------
    render: function(){
        logger.log('ScreenCreate:component:render', 'called');

        return (
            <div id="game-screen-onboarding__book">
                <div className="hard"> </div>
                <div className="hard"> </div>

                <div> Page 1 </div>
                <div> Page 2 </div>
                <div> Page 3 </div>
                <div> Page 4 </div>
                <div> Page 5 </div>
                <div> Page 6 </div>

                <div className="hard"> </div>
                <div className="hard"> </div>
            </div>
        );
    }
});

export default ScreenCreate;
