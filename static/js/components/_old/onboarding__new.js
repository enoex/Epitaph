/* =========================================================================
 *
 * game-screen__new.js
 *      New character create flow
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

import OnboardingNewStore from '../stores/onboarding__new.js';
import OnboardingActions from '../actions/onboarding.js';
import OnboardingStore from '../stores/onboarding.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var ScreenCreate = React.createClass({
    mixins: [
        Reflux.listenTo(OnboardingNewStore, 'onboardingNewStoreChange')
    ],

    getInitialState: function(){
        return OnboardingNewStore.getData();
    },

    onboardingNewStoreChange: function(d){
        logger.log('components/onboarding__new:onboardingNewStoreChange',
        'called %O', d);

        return this;
    },

    // --------------------------------
    // Utility functions
    // --------------------------------
    getIntroText: function(){
        // TODO: get different text based on past game play
        return `I am old and tired now, but I was not young when the destruction of Felithport began.
        The years since then seem more dim and faded than the years of my youth. Now, I wait.
        Like a gnarled tree, withered and weathered, with nothing to do but decay to the grave.`;
    },

    // --------------------------------
    // Component handling
    // --------------------------------
    componentDidMount: function(){
        logger.log('components/onboarding__new:componentDidMount', 'called');

        // Trigger animations / transitions based on state

        return this;
    },

    // --------------------------------
    // Handle actions
    // --------------------------------
    // NOTE: we can call OnboardingActions.turnPage({ page: X }) to turn the page

    // --------------------------------
    // Render
    // --------------------------------
    render: function(){
        logger.log('components/onboarding__new:render', 'called');

        // ----------------------------
        // Get HTML for pages
        // ----------------------------

        // PAGE 1
        // ---------------------------
        let page1Html;
        page1Html = (
            <div>
                <div className='onboarding-new__page-1__intro-text'>
                    {this.getIntroText()}
                </div>
            </div>
        );


        // Render it
        // ----------------------------
        return (
            <div id="game-screen-onboarding__book">
                <div className="hard"> </div>
                <div className="hard"> </div>

                <div> {page1Html} </div>

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
