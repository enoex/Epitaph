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

// ========================================================================
//
// Functionality
//
// ========================================================================
var ScreenTitle = React.createClass({
    // --------------------------------
    // Handle actions
    // --------------------------------
    menuItemClickedNewGame: function(targetState) {
        logger.log('ScreenTitle:component:menuItemClickedNewGame',
        'called with ' + targetState);

        // Change state
        GameActions.gameNew({
            targetOnboardingState: targetState
        });
    },

    menuItemClickedResume: function(e) {
        logger.log('ScreenTitle:component:menuItemClickedResume', 'called');

        // Change state
        GameActions.gameResume();
    },

    // --------------------------------
    // Render
    // --------------------------------
    render: function(){
        logger.log('ScreenTitle:component:render', 'called');

        return (
            <div id="game-screen-onboarding__book">
                <div className="hard">
                    <div id='game-screen-title__wrapper'>
                        Title
                        <div id='game-screen-title__menu-wrapper'>

                            <div className='game-screen-title__menu-item'
                                onClick={this.menuItemClickedNewGame.bind(this, 'create')}>
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

export default ScreenTitle;
