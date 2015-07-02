/* =========================================================================
 *
 * game-screen__onboarding.js
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

import GameControllerStore from '../stores/game__controller.js';
import OnboardingStore from '../stores/onboarding.js';
import OnboardingNewStore from '../stores/onboarding__new.js';

// Book Pages
import ScreenTitle from './onboarding__title.js';
import ScreenNew from './onboarding__new.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var timings = new Timings('GameMain');

var ScreenOnboarding = React.createClass({
    mixins: [
        Reflux.listenTo(OnboardingStore, 'onboardingStoreChange')
    ],

    getInitialState: function(){
        this._previousBookState = 'title';

        return {
            state: OnboardingStore.getState()
        };
    },

    // STORE Changes
    // --------------------------------
    onboardingStoreChange: function(message){
        // Change state if necessary
        // NOTE: We can't use props because we do NOT want to trigger an entire
        // re-render
        logger.log('components/onboarding:storeChange', 'called | %O', message);

        if(!Immutable.is(message.state, this.state.state)){
            // Book state is different, re-render everything
            logger.log('components/onboarding:storeChange:dataDiff', 'data not same, changing');

            this.setState({ state: message.state });
        }
        return this;
    },

    // Component Mounting
    // --------------------------------
    componentWillMount: function(){
        logger.log('components/onboarding:componentWillMount', 'called');
        timings.push('componentWillMount');
    },

    shouldComponentUpdate: function(nextProps, nextState){
        logger.log('components/onboarding:shouldComponentUpdate', 'checking | %O', arguments);

        // Only update (render) if the book state is different
        if(nextState.state.get('bookState') !== this.state.state.get('bookState')){
            logger.log('components/onboarding:shouldComponentUpdate', 'true');
            return true;
        } else {
            logger.log('components/onboarding:shouldComponentUpdate', 'false');
            return false;
        }
    },

    componentDidMount: function(){
        // After render is called, setup the flipbook
        timings.push('componentDidMount');
        logger.log('components/onboarding:componentDidMount',
        '<finished> called | took: ' + timings.printLast());
    },

    // Render
    // --------------------------------
    render: function(){
        logger.log('components/onboarding:render',
        'called | previousState: ' + this._previousBookState + ' | current: ' +
        this.state.state.get('bookState'));

        // Setup pages based on bookState (title, create, resume, or options page)
        var bookHtml;
        if(this.state.state.get('bookState') === 'title'){
            // TITLE PAGE
            bookHtml = ( <ScreenTitle /> );

        } else if (this.state.state.get('bookState') === 'new'){
            // CREATE NEW CHARACTER
            bookHtml = ( <ScreenNew /> );

        } else {
            logger.log('error:components/onboarding:render', 'invalid book state', this.state.state.get('bookState'));
            bookHtml = ( <div> INVALID STATE </div> );
        }

        return (
            <div id='game-screen__onboarding-wrapper'> 
                {bookHtml}
            </div>
        );
    }
});

export default ScreenOnboarding;
