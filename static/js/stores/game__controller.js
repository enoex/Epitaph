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

// ========================================================================
//
// Functionality
//
// ========================================================================
var GameControllerStore = Reflux.createStore({
    listenables: [GameControllerActions],

    init: function(){
        logger.log('stores/game__controller:init', 'called');

        // set initial data
        this.data = Immutable.fromJS({
            screen: 'onboarding'
        });

        // TODO: Don't embed this logic here, do it elsewhere
        // listen to own changes to store data
        this.listen((d)=>{
            // Update localforage when state changes
            window.localforage.setItem(
                'store:game',
                JSON.stringify(this.data.toJS())
            );
        });

        // get initial state from localForage
        // TODO: don't do this here?
        window.localforage.getItem('store:game', (err, d)=>{
            requestAnimationFrame(()=>{
                logger.log('stores/game__controller:init:loadLocalData', 'called | %O', {
                    err: err,
                    data: d
                });

                this.data = Immutable.fromJS(JSON.parse(d));
                this.trigger({ data: this.data });
            });
        });

        return this;
    },

    getState: function(){
        // Returns the state of this controller
        return this.data;
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
