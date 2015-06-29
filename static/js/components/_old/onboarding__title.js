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

import OnboardingActions from '../actions/onboarding.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var OnboardingTitle = React.createClass({
    // --------------------------------
    // Handle actions
    // --------------------------------
    menuItemClickedNewGame: function() {
        logger.log('onboarding__title:component:menuItemClickedNewGame', 'called');

        // Change state
        OnboardingActions.showNew();
    },

    menuItemClickedResume: function(e) {
        logger.log('onboarding__title:component:menuItemClickedResume', 'called');

        // Change state
        OnboardingActions.showResume();
    },

    // --------------------------------
    // Render
    // --------------------------------
    render: function(){
        logger.log('onboarding__title:component:render', 'called');

        return (
            <div id="game-screen-onboarding__book">
                <div className="hard">
                    <div id='game-screen-title__wrapper'>
                        Title
                        <div id='game-screen-title__menu-wrapper'>

                            <div className='game-screen-title__menu-item'
                                onClick={this.menuItemClickedNewGame}>
                                New Game
                            </div>

                            <div className='game-screen-title__menu-item'>
                                Resume
                            </div>

                            <div className='game-screen-title__menu-item'>
                                Options
                            </div>

                        </div>
                    </div>
                </div>
                <div className="hard"> </div>
            </div>
        );
    }
});

export default OnboardingTitle;
