/* =========================================================================
 *
 * Game.js
 *  Main game store.
 *
 *  TODO: This is a sort of "omni" store pattern where in this game
 *  store is the source of truth for the entire app. Other stores are used
 *  essentially as data caches / data aggregations
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
// TODO: Check version. If version mismatch, clear localstorage
// TODO: Load state from local storage, change how data is passed to substores

// Store
var GameStore = Reflux.createStore({
    listenables: [GameControllerActions],

    init: function(){
        logger.log('stores/game:store:init', 'called');
    }
});

export default GameStore;
