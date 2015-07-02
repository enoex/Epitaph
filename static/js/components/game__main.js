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

import GameStore from '../stores/game.js';
import GameControllerStore from '../stores/game__controller.js';

// Main screens
import ScreenOnboarding from './onboarding.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var timings = new Timings('GameMain');

var GameMain = React.createClass({
    mixins: [Reflux.listenTo(GameControllerStore, 'controllerStoreChange')],

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function(){
        logger.log('components/game__main:getInitialState', 'called');
        return {
            state: Immutable.fromJS({
                // The current screen:
                //      1) onboarding (title, new, options, achievements)
                //      2) game (map, battle, battle results, shop)
                screen: 'onboarding'
            })
        };
    },

    controllerStoreChange: function(message){
        logger.log('components/game__main:storeChange', 'called | %O', message);

        // change screen if necessary
        if(message.state && message.state.get('screen') !== this.state.state.get('screen')){
            logger.log('components/game__main:storeChange:changeScreen',
            'changing screen to %O', message.state.get('screen'));

            this.setState({ screen: message.state.get('screen') });
        }

        return this;
    },

    componentWillMount: function(){
        timings.push('componentWillMount');
        logger.log('components/game__main:componentWillMount:start', '<start> called');
    },
    componentDidMount: function(){
        timings.push('componentDidMount');
        logger.log('components/game__main:componentDidMount:finish',
        '<finished> called | took: ' + timings.printLast());

        // TODO
        // Now that it's mounted, see if we need to load initial data
    },

    render: function render(){
        // Main game render function.
        // The shown part of the game (screen) depends on the state -
        // e.g., the create screen or map or battle
        logger.log('components/game__main:render', 'called : %O', this.props);

        // Get screen based on state
        var screenComponent;

        // TITLE Screen
        if(this.state.state.get('screen') === 'onboarding'){
            screenComponent = (
                <ScreenOnboarding
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
