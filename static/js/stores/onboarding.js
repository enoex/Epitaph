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
import OnboardingNewStore from './onboarding__new.js';

import saveDataOnChangeForKey from './util/save-data-on-change-for-key.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var STORE_KEY = 'store:onboarding';

var OnboardingStore = Reflux.createStore({
    listenables: [OnboardingActions],

    init: function(){
        logger.log('stores/onboarding:init', 'called');

        // listen for changes and update
        saveDataOnChangeForKey(this, STORE_KEY);

        // set initial state
        this.state = Immutable.fromJS({ bookState: 'title' });

        return this;
    },

    loadInitialState: function(){
        // called from game__controller. Loads the initial state (if it exists)
        // and updates the model. Loads any children sub stores (e.g., `new`)
        //
        window.localforage.getItem(STORE_KEY, (err, d)=>{
            requestAnimationFrame(()=>{
                if(!d || !JSON.parse(d) || !JSON.parse(d).bookState){
                    logger.log('warn:stores/onboarding:loadInitialState',
                    'no data ' + d);
                    return false;
                }

                // setup initial data
                var dataParsed;
                dataParsed = JSON.parse(d);

                logger.log('stores/onboarding:loadInitialState', 'called | %O', {
                    err: err, data: dataParsed
                });

                this.state = Immutable.fromJS(dataParsed);
                this.trigger({ state: this.state });

                // Now, call corresponding state loads based on current screen
                // --------------------
                if(dataParsed.bookState === 'new'){
                    OnboardingNewStore.loadInitialState();
                }
            });
        });

    },

    getState: function getState(){
        return this.state;
    },

    // Page Turns
    // --------------------------------
    onTurnPage: function( options ){
        // Called when a page is turned
        logger.log('stores/onboarding:onTurnPage', 'called | %O', options);

        this.state = Immutable.fromJS({
            bookState: options.bookState || this.state.get('bookState'),
            page: +(options.targetPage || options.page || this.state.get('page'))
        });

        this.trigger({ state: this.state });
    },

    // Handle book switches
    // --------------------------------
    onShowTitle: function( d ){
        logger.log('stores/onboarding:onShowTitle', 'called');

        this.state = Immutable.fromJS({ bookState: 'title' });
        this.trigger({ state: this.state });
    },

    onShowNew: function() {
        logger.log('stores/onboarding:onShowNew', 'called');

        this.state = Immutable.fromJS({ bookState: 'new' });
        this.trigger({ state: this.state });
    }
});

// TODO: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// REMOVE THIS
window.ONBOARDING_STORE = OnboardingStore;
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

export default OnboardingStore;
