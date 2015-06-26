/* =========================================================================
 *
 * game__main.js
 *  Main game component
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import {RouteHandler} from 'react-router';
import logger from 'bragi-browser';
import Reflux from 'reflux';
import Immutable from 'immutable';

// Internal Dependencies
// ------------------------------------
import Timings from '../util/Timings.js';
import GameStore from '../stores/Game.js';
import GameActions from '../actions/game-actions.js';

// Main screens
import GameScreenOnboarding from './game-screen__onboarding.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var timings = new Timings('GameMain');

var GameMain = React.createClass({
    mixins: [Reflux.listenTo(GameStore, 'storeChange')],

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function(){
        logger.log('GameMain:component:getInitialState', 'called');
        return {
            // The current screen:
            //      1) onboarding (title, new, options, achievements)
            //      2) game (map, battle, battle results, shop)
            screen: 'onboarding'
        };
    },

    storeChange: function(message){
        logger.log('GameMain:component:storeChange', 'called | %O', message);

        // change screen if necessary
        if(message.data.screen && message.data.screen !== this.state.screen){
            logger.log('GameMain:component:storeChange:changeScreen',
            'changing screen to %O', message.data.screen);

            this.setState({ screen: message.data.screen });
        }

        return this;
    },

    componentWillMount: function(){
        timings.push('componentWillMount');
        logger.log('GameMain:component:componentWillMount:start', '<start> called');
    },
    componentDidMount: function(){
        timings.push('componentDidMount');
        logger.log('GameMain:component:componentDidMount:finish',
        '<finished> called | took: ' + timings.printLast());

        // TODO
        // Now that it's mounted, see if we need to load initial data
    },

    render: function render(){
        // Main game render function.
        // The shown part of the game (screen) depends on the state -
        // e.g., the create screen or map or battle
        logger.log('GameMain:component:render', 'called : ', this.props);

        // Get screen based on state
        var screenComponent;

        // TITLE Screen
        if(this.state.screen === 'onboarding'){
            screenComponent = (
                <GameScreenOnboarding
                    params={this.props.params}
                    gameState={this.state}
                />
            );
        }

        return (
            <div id='game__screen-wrapper'>
                {screenComponent}
            </div>
        );
    }
});

export default GameMain;
