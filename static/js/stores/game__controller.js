/* =========================================================================
 *
 * game__controller
 *  Controller for game - handles screen state, loading data, etc
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
import GameControllerActions from '../actions/game__controller.js';

// Screen stores
import OnboardingStore from './onboarding.js';

import saveDataOnChangeForKey from './util/save-data-on-change-for-key.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var STORE_KEY = 'store:game';

var GameControllerStore = Reflux.createStore({
    listenables: [GameControllerActions],

    init: function(){
        logger.log('stores/game__controller:init', 'called');

        // set initial data
        this.state = Immutable.fromJS({
            screen: 'onboarding'
        });

        // update store when data changes
        saveDataOnChangeForKey(this, STORE_KEY);

        // trigger initial change to save data
        this.trigger({ state: this.state });

        // load initial state
        this.loadInitialState();

        return this;
    },

    loadInitialState: function(){
        // Called when user clicks "Resume"
        // Loads initial game state and propagates down to load all 'screen'
        // state stores
        //
        logger.log('stores/game__controller:loadInitialState', 'called');

        // get initial state from localForage
        // TODO: don't do this here?
        window.localforage.getItem(STORE_KEY, (err, d)=>{

            requestAnimationFrame(()=>{
                if(!d || !JSON.parse(d)){
                    logger.log('warn:stores/game__controller:loadInitialState',
                    'no data ' + d);
                    return false;
                }

                // setup initial data
                var dataParsed;
                dataParsed = JSON.parse(d);

                if(!dataParsed.screen){
                    logger.log('warn:stores/game__controller:loadInitialState',
                    'no screen state %j', {data: dataParsed});
                    return false;
                }

                logger.log('stores/game__controller:loadInitialState', 'called | %O', {
                    err: err,
                    data: dataParsed
                });

                this.state = Immutable.fromJS(dataParsed);
                this.trigger({ state: this.state });

                // Now, call corresponding state loads based on current screen
                // --------------------
                if(dataParsed.screen === 'onboarding'){
                    OnboardingStore.loadInitialState();
                }
            });
        });
    },

    getState: function(){
        // Returns the state of this controller
        return this.state;
    },

    // --------------------------------
    //
    // onboarding - NOTE should be own store
    //
    // --------------------------------
    onShowOnboarding: function( d ){
    },
});

export default GameControllerStore;
