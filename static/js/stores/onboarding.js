/* =========================================================================
 *
 * Game Onboarding.js
 *  Game onboarding store (e.g., new / history)
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import logger from 'bragi-browser';
import _ from 'lodash';

import React from 'react';
import Reflux from 'reflux';
import Immutable from 'immutable';

// Internal Dependencies
// ------------------------------------
import OnboardingActions from '../actions/onboarding.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var OnboardingStore = Reflux.createStore({
    listenables: [OnboardingActions],

    init: function(){
        logger.log('stores/onboarding:init', 'called');
        // set initial data
        this.data = Immutable.fromJS({ bookState: 'title' });

        return this;
    },

    getState: function getState(){
        return this.data;
    },

    // TODO: save / load functionality

    // Page Turns
    // --------------------------------
    onTurnPage: function( options ){
        // Called when a page is turned
        logger.log('stores/onboarding:onTurnPage', 'called | %O', options);

        this.data = Immutable.fromJS({
            bookState: options.bookState || this.data.get('bookState'),
            page: +(options.targetPage || options.page || this.data.get('page'))
        });

        this.trigger({ data: this.data });
    },

    // Handle book switches
    // --------------------------------
    onShowTitle: function( d ){
        logger.log('stores/onboarding:onShowTitle', 'called');

        this.data = Immutable.fromJS({ bookState: 'title' });
        this.trigger({ data: this.data });
    },

    onShowNew: function() {
        logger.log('stores/onboarding:onShowNew', 'called');

        this.data = Immutable.fromJS({ bookState: 'new' });
        this.trigger({ data: this.data });
    }
});

export default OnboardingStore;
