/* =========================================================================
 *
 * Categories.js
 *  Store for categories list / interactions
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
import GameActions from '../actions/game-actions.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
// keep track of state

// Store
var GameStore = Reflux.createStore({
    listenables: [GameActions],

    init: function(){
        logger.log('Game:store:init', 'called');
        // set initial data
        this.data = Immutable.fromJS({
            screen: 'onboarding',
            screenState: {}
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
                logger.log('Game:store:init:loadLocalData', 'called | %j', {
                    err: err,
                    data: d
                });
                this.data = Immutable.fromJS(JSON.parse(d));
                this.trigger({ data: this.data });
            });
        });

        return this;
    },

    onGameNew: function( d ){
        logger.log('Game:store:onGameNew', 'called | %o', d);

        this.data = Immutable.fromJS({
            screen: 'onboarding',
            screenState: {
                bookState: 'create',
                page: 2
            }
        });

        this.trigger({ data: this.data });
    },

    onGameResume: function( d ){
        logger.log('Game:store:onGameResume', 'called');

        this.data = Immutable.fromJS({
            screen: 'game',
            screenState: {}
        });

        this.trigger({ data: this.data });
    }

});

export default GameStore;
